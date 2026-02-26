import { randomUUID } from 'node:crypto';

export class OrdersService {
  constructor(store) {
    this.store = store;
  }

  create({ type, shipperUserId, pickup, dropoff, cargo, requirements = [], bidDeadline }) {
    const order = {
      id: randomUUID(),
      type,
      status: 'bidding',
      shipperUserId,
      pickup,
      dropoff,
      cargo,
      requirements,
      bidDeadline,
      tracking: [],
      createdAt: new Date().toISOString(),
    };
    this.store.orders.set(order.id, order);
    return order;
  }

  get(orderId) {
    const o = this.store.orders.get(orderId);
    if (!o) throw new Error('Order табылмады');
    return o;
  }

  list(status) {
    return Array.from(this.store.orders.values()).filter((o) => (status ? o.status === status : true));
  }

  setStatus(orderId, status) {
    const order = this.get(orderId);
    order.status = status;
    return order;
  }

  addTracking(orderId, point) {
    const order = this.get(orderId);
    order.tracking.push({ ...point, ts: new Date().toISOString() });
    if (point.status) order.status = point.status;
    return order;
  }
}
