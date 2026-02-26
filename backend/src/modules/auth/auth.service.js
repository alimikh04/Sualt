export class AuthService {
  constructor(store) {
    this.store = store;
  }

  requestOtp(phone) {
    const otp = '0000';
    this.store.otps.set(phone, { otp, expiresAt: Date.now() + 2 * 60_000 });
    return { phone, otpHint: 'MVP mock: 0000', expiresInSec: 120 };
  }

  verifyOtp(phone, otp, role) {
    const rec = this.store.otps.get(phone);
    if (!rec || rec.expiresAt < Date.now()) throw new Error('OTP мерзімі аяқталған');
    if (rec.otp !== otp) throw new Error('OTP қате');

    const userId = `u_${phone.replace(/\D/g, '')}`;
    const existing = this.store.users.get(userId);
    const roles = existing?.roles ?? [];
    const mergedRoles = Array.from(new Set([...roles, role]));

    const accessToken = Buffer.from(
      JSON.stringify({ userId, phone, role, roles: mergedRoles, locale: 'kk', timezone: 'Asia/Almaty' }),
    ).toString('base64url');
    const refreshToken = Buffer.from(JSON.stringify({ userId, phone, t: 'refresh' })).toString('base64url');

    this.store.users.set(userId, { id: userId, phone, roles: mergedRoles });
    return { accessToken, refreshToken, activeRole: role, roles: mergedRoles, userId };
  }

  parseAccessToken(token) {
    try {
      return JSON.parse(Buffer.from(token, 'base64url').toString('utf8'));
    } catch {
      throw new Error('Token жарамсыз');
    }
  }
}
