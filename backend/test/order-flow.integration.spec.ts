import { describe, expect, it } from 'vitest';
import { OrdersService } from '../src/modules/orders/orders.service';
import { AuctionService } from '../src/modules/auction/auction.service';
import { PaymentsService } from '../src/modules/payments/payments.service';

describe('Order flow integration', () => {
  it('create -> bid -> accept -> release', () => {
    const orders = new OrdersService();
    const auction = new AuctionService();
    const payments = new PaymentsService();

    const order = orders.create({
      type: 'city',
      shipperId: 'shipper-1',
      bidDeadline: new Date(Date.now() + 3600_000),
      requirements: ['manipulator'],
    });

    const bid = auction.placeBid(order, {
      orderId: order.id,
      carrierId: 'carrier-1',
      vehicleType: 'manipulator',
      amountKzt: 50000,
      etaMinutes: 45,
    });

    auction.acceptBid(order.id, bid.id);
    orders.updateStatus(order.id, 'assigned');
    orders.updateStatus(order.id, 'delivered');

    payments.hold(order.id, 50000, 0.08, 500);
    const released = payments.release(order.id);
    expect(released.status).toBe('released');
  });
});
