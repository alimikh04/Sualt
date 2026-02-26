export class PaymentsService {
  constructor(store) {
    this.store = store;
  }

  hold(orderId, grossAmount, feePct = 0.08, minFee = 500) {
    const platformFee = Math.max(minFee, grossAmount * feePct);
    const hold = {
      orderId,
      grossAmount,
      platformFee,
      carrierReceivable: grossAmount - platformFee,
      status: 'held',
      createdAt: new Date().toISOString(),
    };
    this.store.escrow.set(orderId, hold);
    return hold;
  }

  get(orderId) {
    return this.store.escrow.get(orderId);
  }

  release(orderId) {
    const hold = this.mustGet(orderId);
    if (hold.status === 'dispute') throw new Error('Dispute кезінде release жоқ');
    hold.status = 'released';
    hold.releasedAt = new Date().toISOString();
    return hold;
  }

  webhook({ event, orderId }) {
    const hold = this.mustGet(orderId);
    hold.providerEvent = event;
    hold.updatedAt = new Date().toISOString();
    return hold;
  }

  mustGet(orderId) {
    const hold = this.get(orderId);
    if (!hold) throw new Error('Escrow табылмады');
    return hold;
  }
}
