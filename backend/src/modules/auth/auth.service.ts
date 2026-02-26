export type UserRole = 'shipper' | 'driver' | 'carrier_admin' | 'corporate_operator' | 'support' | 'admin';

export class AuthService {
  requestOtp(phone: string) {
    return { phone, otp: '0000', expiresInSec: 120 };
  }

  verifyOtp(phone: string, otp: string, role: UserRole) {
    if (otp !== '0000') throw new Error('OTP қате');
    return {
      accessToken: `access-${phone}-${role}`,
      refreshToken: `refresh-${phone}`,
      activeRole: role,
    };
  }
}
