import { describe, expect, it } from 'vitest';
import { AuctionService } from '../src/modules/auction/auction.service';
import type { Order } from '../src/modules/orders/orders.service';

const order: Order = {
  id: 'o1',
  type: 'city',
  status: 'bidding',
  shipperId: 's1',
  bidDeadline: new Date(Date.now() + 5 * 60_000),
  requirements: ['manipulator'],
};

describe('Auction rules', () => {
  it('vehicle requirement сәйкес болмаса reject', () => {
    const service = new AuctionService();
    expect(() =>
      service.placeBid(order, {
        orderId: 'o1',
        carrierId: 'c1',
        vehicleType: 'refrigerator',
        amountKzt: 20000,
        etaMinutes: 30,
      }),
    ).toThrow(/Vehicle/);
  });
});
