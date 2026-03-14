import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/server.js';

async function httpJson(base, path, method = 'GET', body, token) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { status: res.status, body: await res.json() };
}

test('happy path: create -> bid -> accept -> escrow', async () => {
  const { server } = createApp();
  await new Promise((r) => server.listen(0, r));
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;

  const auth1 = await httpJson(base, '/v1/auth/request-otp', 'POST', { phone: '+77011111111' });
  assert.equal(auth1.status, 200);
  const shipper = await httpJson(base, '/v1/auth/verify-otp', 'POST', {
    phone: '+77011111111', otp: '0000', role: 'shipper',
  });

  const order = await httpJson(base, '/v1/orders', 'POST', {
    type: 'city',
    pickup: { city: 'Almaty' },
    dropoff: { city: 'Almaty' },
    cargo: { type: 'cement' },
    requirements: ['manipulator'],
    bidDeadline: new Date(Date.now() + 300_000).toISOString(),
  }, shipper.body.accessToken);
  assert.equal(order.status, 201);

  await httpJson(base, '/v1/auth/request-otp', 'POST', { phone: '+77012222222' });
  const carrier = await httpJson(base, '/v1/auth/verify-otp', 'POST', {
    phone: '+77012222222', otp: '0000', role: 'driver',
  });

  const bid = await httpJson(base, `/v1/orders/${order.body.id}/bids`, 'POST', {
    vehicleType: 'manipulator', amountKzt: 55000, etaMinutes: 35,
  }, carrier.body.accessToken);
  assert.equal(bid.status, 201);

  const accept = await httpJson(base, `/v1/orders/${order.body.id}/bids/${bid.body.id}/accept`, 'POST', {}, shipper.body.accessToken);
  assert.equal(accept.status, 200);
  assert.equal(accept.body.escrow.status, 'held');

  const escrow = await httpJson(base, `/v1/payments/escrow/${order.body.id}`, 'GET', undefined, shipper.body.accessToken);
  assert.equal(escrow.status, 200);
  assert.equal(escrow.body.orderId, order.body.id);

  server.close();
});

test('rbac: driver cannot create order', async () => {
  const { server } = createApp();
  await new Promise((r) => server.listen(0, r));
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;

  await httpJson(base, '/v1/auth/request-otp', 'POST', { phone: '+77013333333' });
  const driver = await httpJson(base, '/v1/auth/verify-otp', 'POST', {
    phone: '+77013333333', otp: '0000', role: 'driver',
  });

  const order = await httpJson(base, '/v1/orders', 'POST', {
    type: 'city',
    pickup: { city: 'A' },
    dropoff: { city: 'B' },
    cargo: { type: 'x' },
    bidDeadline: new Date(Date.now() + 300_000).toISOString(),
  }, driver.body.accessToken);

  assert.equal(order.status, 403);
  server.close();
});

test('payments webhook idempotency and audit logs access', async () => {
  const { server } = createApp();
  await new Promise((r) => server.listen(0, r));
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;

  await httpJson(base, '/v1/auth/request-otp', 'POST', { phone: '+77014444444' });
  const shipper = await httpJson(base, '/v1/auth/verify-otp', 'POST', {
    phone: '+77014444444', otp: '0000', role: 'shipper',
  });

  const order = await httpJson(base, '/v1/orders', 'POST', {
    type: 'city',
    pickup: { city: 'Almaty' },
    dropoff: { city: 'Taraz' },
    cargo: { type: 'bricks' },
    bidDeadline: new Date(Date.now() + 300_000).toISOString(),
  }, shipper.body.accessToken);

  // To create escrow hold, need a bid + accept
  await httpJson(base, '/v1/auth/request-otp', 'POST', { phone: '+77015555555' });
  const driver = await httpJson(base, '/v1/auth/verify-otp', 'POST', {
    phone: '+77015555555', otp: '0000', role: 'driver',
  });

  const bid = await httpJson(base, `/v1/orders/${order.body.id}/bids`, 'POST', {
    vehicleType: 'truck', amountKzt: 48000, etaMinutes: 90,
  }, driver.body.accessToken);

  // If requirement mismatch because empty requirements not enforced, bid should pass
  assert.equal(bid.status, 201);

  const accept = await httpJson(base, `/v1/orders/${order.body.id}/bids/${bid.body.id}/accept`, 'POST', {}, shipper.body.accessToken);
  assert.equal(accept.status, 200);

  const firstWebhook = await httpJson(base, '/v1/payments/webhooks/simulated', 'POST', {
    event: 'payment_succeeded',
    orderId: order.body.id,
    idempotencyKey: 'idem-1',
  });
  assert.equal(firstWebhook.status, 200);
  assert.equal(firstWebhook.body.idempotentReplay, false);

  const secondWebhook = await httpJson(base, '/v1/payments/webhooks/simulated', 'POST', {
    event: 'payment_succeeded',
    orderId: order.body.id,
    idempotencyKey: 'idem-1',
  });
  assert.equal(secondWebhook.status, 200);
  assert.equal(secondWebhook.body.idempotentReplay, true);

  await httpJson(base, '/v1/auth/request-otp', 'POST', { phone: '+77016666666' });
  const admin = await httpJson(base, '/v1/auth/verify-otp', 'POST', {
    phone: '+77016666666', otp: '0000', role: 'admin',
  });

  const auditLogs = await httpJson(base, '/v1/admin/audit-logs?limit=10', 'GET', undefined, admin.body.accessToken);
  assert.equal(auditLogs.status, 200);
  assert.equal(Array.isArray(auditLogs.body), true);
  assert.ok(auditLogs.body.length > 0);

  server.close();
});
