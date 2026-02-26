export class AdminService {
  constructor(store) {
    this.store = store;
  }

  verifyKyc(userId) {
    const state = { userId, status: 'verified', at: new Date().toISOString() };
    this.store.kyc.set(userId, state);
    return state;
  }
}
