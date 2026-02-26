export interface EscrowHold {
  orderId: string;
  grossAmount: number;
  platformFee: number;
  carrierReceivable: number;
  status: 'held' | 'released' | 'dispute';
}

export class PaymentsService {
  private escrow = new Map<string, EscrowHold>();

  hold(orderId: string, grossAmount: number, feePct = 0.08, minFee = 500): EscrowHold {
    const platformFee = Math.max(minFee, grossAmount * feePct);
    const hold: EscrowHold = {
      orderId,
      grossAmount,
      platformFee,
      carrierReceivable: grossAmount - platformFee,
      status: 'held',
    };
    this.escrow.set(orderId, hold);
    return hold;
  }

  release(orderId: string): EscrowHold {
    const hold = this.mustGet(orderId);
    if (hold.status === 'dispute') throw new Error('Dispute кезінде release жоқ');
    hold.status = 'released';
    return hold;
  }

  markDispute(orderId: string): EscrowHold {
    const hold = this.mustGet(orderId);
    hold.status = 'dispute';
    return hold;
  }

  get(orderId: string): EscrowHold | undefined {
    return this.escrow.get(orderId);
  }

  private mustGet(orderId: string): EscrowHold {
    const hold = this.get(orderId);
    if (!hold) throw new Error('Escrow табылмады');
    return hold;
  }
}
