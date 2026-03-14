import { createServer } from 'node:http';
import { AuthService } from './modules/auth/auth.service.js';
import { OrdersService } from './modules/orders/orders.service.js';
import { AuctionService } from './modules/auction/auction.service.js';
import { PaymentsService } from './modules/payments/payments.service.js';
import { DocumentsService } from './modules/documents/documents.service.js';
import { NotificationsService } from './modules/notifications/notifications.service.js';
import { AdminService } from './modules/admin/admin.service.js';
import { AuditService } from './modules/common/audit.service.js';

const ALLOWED_ORDER_TYPES = new Set(['city', 'intercity', 'magistral']);

export function createApp() {
  const store = {
    otps: new Map(),
    users: new Map(),
    orders: new Map(),
    bids: new Map(),
    escrow: new Map(),
    documents: new Map(),
    kyc: new Map(),
    webhookEvents: new Map(),
    auditLogs: [],
  };

  const auth = new AuthService(store);
  const orders = new OrdersService(store);
  const auction = new AuctionService(store);
  const payments = new PaymentsService(store);
  const docs = new DocumentsService(store);
  const notifications = new NotificationsService();
  const admin = new AdminService(store);
  const audit = new AuditService(store);

  function json(res, code, body) {
    res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(body));
  }

  async function readBody(req) {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    if (!chunks.length) return {};
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  }

  function parseAuth(req) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return null;
    return auth.parseAccessToken(header.slice('Bearer '.length));
  }

  function requireRole(actor, allowedRoles) {
    if (!actor || !allowedRoles.includes(actor.role)) {
      const label = allowedRoles.join(', ');
      throw new Error(`Role access denied. Required: ${label}`);
    }
  }

  function validateCreateOrder(body) {
    if (!ALLOWED_ORDER_TYPES.has(body.type)) throw new Error('Order type қате');
    if (!body.pickup || !body.dropoff || !body.cargo) throw new Error('pickup/dropoff/cargo міндетті');
    if (!body.bidDeadline) throw new Error('bidDeadline міндетті');
  }

  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? await readBody(req) : {};

      if (req.method === 'GET' && url.pathname === '/health') return json(res, 200, { ok: true });

      if (req.method === 'POST' && url.pathname === '/v1/auth/request-otp') {
        const result = auth.requestOtp(body.phone);
        audit.log({ action: 'auth.request_otp', entity: 'user', entityId: body.phone, meta: { phone: body.phone } });
        return json(res, 200, result);
      }
      if (req.method === 'POST' && url.pathname === '/v1/auth/verify-otp') {
        const result = auth.verifyOtp(body.phone, body.otp, body.role);
        audit.log({ actorUserId: result.userId, actorRole: result.activeRole, action: 'auth.verify_otp', entity: 'user', entityId: result.userId });
        return json(res, 200, result);
      }

      const actor = parseAuth(req);
      if (!actor && !url.pathname.startsWith('/v1/payments/webhooks/')) {
        return json(res, 401, { message: 'Unauthorized' });
      }

      if (req.method === 'POST' && url.pathname === '/v1/orders') {
        requireRole(actor, ['shipper', 'corporate_operator']);
        validateCreateOrder(body);
        const order = orders.create({
          type: body.type,
          shipperUserId: actor.userId,
          pickup: body.pickup,
          dropoff: body.dropoff,
          cargo: body.cargo,
          requirements: body.requirements ?? [],
          bidDeadline: body.bidDeadline,
        });
        audit.log({ actorUserId: actor.userId, actorRole: actor.role, action: 'orders.create', entity: 'order', entityId: order.id });
        return json(res, 201, order);
      }

      if (req.method === 'GET' && url.pathname === '/v1/orders') {
        return json(res, 200, orders.list(url.searchParams.get('status')));
      }

      if (req.method === 'POST' && /^\/v1\/orders\/[^/]+\/bids$/.test(url.pathname)) {
        requireRole(actor, ['driver', 'carrier_admin']);
        const orderId = url.pathname.split('/')[3];
        const order = orders.get(orderId);
        const bid = auction.placeBid(order, {
          carrierId: actor.userId,
          driverId: body.driverId,
          vehicleType: body.vehicleType,
          amountKzt: body.amountKzt,
          etaMinutes: body.etaMinutes,
        });
        audit.log({ actorUserId: actor.userId, actorRole: actor.role, action: 'auction.place_bid', entity: 'bid', entityId: bid.id, meta: { orderId } });
        return json(res, 201, bid);
      }

      if (req.method === 'POST' && /^\/v1\/orders\/[^/]+\/bids\/[^/]+\/accept$/.test(url.pathname)) {
        requireRole(actor, ['shipper', 'corporate_operator']);
        const [, , , orderId, , bidId] = url.pathname.split('/');
        const order = orders.get(orderId);
        if (order.shipperUserId !== actor.userId) throw new Error('Тек тапсырыс иесі accept жасай алады');

        const selected = auction.acceptBid(orderId, bidId);
        orders.setStatus(orderId, 'assigned');
        const hold = payments.hold(orderId, selected.amountKzt);
        notifications.sendPush(selected.carrierId, `Order ${orderId} сізге берілді`);
        audit.log({ actorUserId: actor.userId, actorRole: actor.role, action: 'auction.accept_bid', entity: 'bid', entityId: bidId, meta: { orderId } });
        return json(res, 200, { bid: selected, escrow: hold });
      }

      if (req.method === 'POST' && /^\/v1\/orders\/[^/]+\/tracking$/.test(url.pathname)) {
        requireRole(actor, ['driver', 'carrier_admin']);
        const orderId = url.pathname.split('/')[3];
        const updated = orders.addTracking(orderId, body);
        audit.log({ actorUserId: actor.userId, actorRole: actor.role, action: 'orders.tracking_update', entity: 'order', entityId: orderId, meta: { status: body.status } });
        return json(res, 200, updated);
      }

      if (req.method === 'GET' && /^\/v1\/payments\/escrow\/[^/]+$/.test(url.pathname)) {
        const orderId = url.pathname.split('/')[4];
        return json(res, 200, payments.mustGet(orderId));
      }

      if (req.method === 'POST' && url.pathname === '/v1/payments/webhooks/simulated') {
        const result = payments.webhook(body);
        audit.log({ action: 'payments.webhook', entity: 'escrow', entityId: body.orderId, meta: { event: body.event, idempotencyKey: body.idempotencyKey, replay: result.idempotentReplay } });
        return json(res, 200, result);
      }

      if (req.method === 'POST' && url.pathname === '/v1/documents/ettn') {
        requireRole(actor, ['shipper', 'corporate_operator', 'carrier_admin']);
        const doc = docs.createEttn(body.orderId);
        audit.log({ actorUserId: actor.userId, actorRole: actor.role, action: 'documents.create_ettn', entity: 'document', entityId: doc.id, meta: { orderId: body.orderId } });
        return json(res, 201, doc);
      }

      if (req.method === 'POST' && /^\/v1\/admin\/kyc\/[^/]+\/verify$/.test(url.pathname)) {
        requireRole(actor, ['admin', 'support']);
        const userId = url.pathname.split('/')[4];
        const result = admin.verifyKyc(userId);
        audit.log({ actorUserId: actor.userId, actorRole: actor.role, action: 'admin.kyc_verify', entity: 'user', entityId: userId });
        return json(res, 200, result);
      }

      if (req.method === 'GET' && url.pathname === '/v1/admin/audit-logs') {
        requireRole(actor, ['admin', 'support']);
        const limit = Number(url.searchParams.get('limit') ?? 50);
        return json(res, 200, audit.list(limit));
      }

      json(res, 404, { message: 'Not found' });
    } catch (error) {
      const message = error?.message || 'Bad request';
      const status = message.includes('Role access denied') ? 403 : 400;
      json(res, status, { message });
    }
  });

  return { server, store };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT || 3000);
  createApp().server.listen(port, () => {
    console.log(`[ITtcargo API] listening on :${port}`);
  });
}
