import { randomUUID } from 'node:crypto';

export class AuctionService {
  constructor(store) {
    this.store = store;
    this.bidCounters = new Map();
    this.lastBidAt = new Map();
  }

  placeBid(order, input) {
    if (order.status !== 'bidding') throw new Error('Auction жабық');
    if (new Date(order.bidDeadline).getTime() <= Date.now()) throw new Error('Bid deadline өтті');
    if (order.requirements.length && !order.requirements.includes(input.vehicleType)) {
      throw new Error('Vehicle талабы сәйкес емес');
    }

    const key = `${order.id}:${input.carrierId}`;
    const count = this.bidCounters.get(key) ?? 0;
    if (count >= 20) throw new Error('Bid лимит асып кетті');

    const now = Date.now();
    const last = this.lastBidAt.get(key) ?? 0;
    if (now - last < 60_000) throw new Error('Cooldown 60 сек');

    const bid = {
      id: randomUUID(),
      orderId: order.id,
      carrierId: input.carrierId,
      driverId: input.driverId,
      vehicleType: input.vehicleType,
      amountKzt: Number(input.amountKzt),
      etaMinutes: Number(input.etaMinutes),
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    this.store.bids.set(bid.id, bid);
    this.bidCounters.set(key, count + 1);
    this.lastBidAt.set(key, now);
    return bid;
  }

  acceptBid(orderId, bidId) {
    const selected = this.store.bids.get(bidId);
    if (!selected || selected.orderId !== orderId) throw new Error('Bid табылмады');

    for (const bid of this.store.bids.values()) {
      if (bid.orderId === orderId) bid.status = bid.id === bidId ? 'accepted' : 'rejected';
    }
    return selected;
  }

  list(orderId) {
    return Array.from(this.store.bids.values()).filter((b) => b.orderId === orderId);
  }
}
