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
