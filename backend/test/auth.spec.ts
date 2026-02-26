import { describe, expect, it } from 'vitest';
import { AuthService } from '../src/modules/auth/auth.service';

describe('AuthService', () => {
  it('OTP 0000 арқылы login жасайды', () => {
    const service = new AuthService();
    const tokens = service.verifyOtp('+77015550000', '0000', 'shipper');
    expect(tokens.activeRole).toBe('shipper');
    expect(tokens.accessToken).toContain('access-');
  });
});
