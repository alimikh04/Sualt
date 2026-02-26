import { randomUUID } from 'crypto';

export type OrderType = 'city' | 'intercity' | 'magistral';
export type OrderStatus =
  | 'created'
  | 'bidding'
  | 'assigned'
  | 'enroute_pickup'
  | 'loaded'
  | 'enroute_dropoff'
  | 'delivered'
  | 'closed';

export interface Order {
  id: string;
  type: OrderType;
  status: OrderStatus;
  shipperId: string;
  bidDeadline: Date;
  requirements: string[];
}

export class OrdersService {
  private readonly orders: Order[] = [];

  create(input: Omit<Order, 'id' | 'status'>): Order {
    const order: Order = { ...input, id: randomUUID(), status: 'bidding' };
    this.orders.push(order);
    return order;
  }

  get(orderId: string): Order {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order табылмады');
    return order;
  }

  updateStatus(orderId: string, status: OrderStatus) {
    const order = this.get(orderId);
    order.status = status;
    return order;
  }
}
