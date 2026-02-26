import test from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from '../src/modules/auth/auth.service.js';
import { AuctionService } from '../src/modules/auction/auction.service.js';
import { PaymentsService } from '../src/modules/payments/payments.service.js';

test('Auth: OTP verify', () => {
  const store = { otps: new Map(), users: new Map() };
  const svc = new AuthService(store);
  svc.requestOtp('+77011234567');
  const t = svc.verifyOtp('+77011234567', '0000', 'shipper');
  assert.equal(t.activeRole, 'shipper');
});

test('Auction: vehicle mismatch rejects', () => {
  const store = { bids: new Map() };
  const svc = new AuctionService(store);
  const order = {
    id: 'o1',
    status: 'bidding',
    bidDeadline: new Date(Date.now() + 60_000).toISOString(),
    requirements: ['manipulator'],
  };
  assert.throws(
    () =>
      svc.placeBid(order, {
        carrierId: 'c1',
        vehicleType: 'refrigerator',
        amountKzt: 10000,
        etaMinutes: 20,
      }),
    /Vehicle талабы сәйкес емес/,
  );
});

test('Payments: hold/release', () => {
  const store = { escrow: new Map() };
  const svc = new PaymentsService(store);
  svc.hold('o1', 10000, 0.1, 500);
  const rel = svc.release('o1');
  assert.equal(rel.status, 'released');
  assert.equal(rel.platformFee, 1000);
});
