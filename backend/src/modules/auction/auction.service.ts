import { randomUUID } from 'crypto';
import { Order } from '../orders/orders.service';

export interface Bid {
  id: string;
  orderId: string;
  carrierId: string;
  driverId?: string;
  vehicleType: string;
  amountKzt: number;
  etaMinutes: number;
  status: 'active' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: Date;
}

export class AuctionService {
  private readonly bids: Bid[] = [];
  private readonly bidCounters = new Map<string, number>();
  private readonly lastBidAt = new Map<string, number>();

  placeBid(order: Order, input: Omit<Bid, 'id' | 'status' | 'createdAt'>): Bid {
    if (order.status !== 'bidding') throw new Error('Auction жабық');
    if (order.bidDeadline.getTime() <= Date.now()) throw new Error('Bid deadline өтті');
    if (!order.requirements.includes(input.vehicleType)) throw new Error('Vehicle талабы сәйкес емес');

    const key = `${order.id}:${input.carrierId}`;
    const count = this.bidCounters.get(key) ?? 0;
    if (count >= 20) throw new Error('Bid лимит асып кетті');

    const now = Date.now();
    const last = this.lastBidAt.get(key) ?? 0;
    if (now - last < 60_000) throw new Error('Cooldown 60 сек');

    const bid: Bid = { ...input, id: randomUUID(), createdAt: new Date(), status: 'active' };
    this.bids.push(bid);
    this.bidCounters.set(key, count + 1);
    this.lastBidAt.set(key, now);
    return bid;
  }

  acceptBid(orderId: string, bidId: string): Bid {
    const selected = this.bids.find((b) => b.id === bidId && b.orderId === orderId);
    if (!selected) throw new Error('Bid табылмады');
    this.bids.forEach((b) => {
      if (b.orderId === orderId) b.status = b.id === bidId ? 'accepted' : 'rejected';
    });
    return selected;
  }

  list(orderId: string) {
    return this.bids.filter((b) => b.orderId === orderId);
  }
}
