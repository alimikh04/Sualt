import { describe, expect, it } from 'vitest';
import { PaymentsService } from '../src/modules/payments/payments.service';

describe('Escrow release', () => {
  it('delivered кезінде release жасайды', () => {
    const service = new PaymentsService();
    service.hold('o1', 10000, 0.1, 500);
    const released = service.release('o1');
    expect(released.status).toBe('released');
    expect(released.platformFee).toBe(1000);
  });
});
