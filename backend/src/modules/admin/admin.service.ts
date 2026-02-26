export class AdminService {
  verifyKyc(userId: string) {
    return { userId, kycStatus: 'verified' };
  }

  setFuelPrice(stationId: string, priceKzt: number) {
    return { stationId, priceKzt, updatedAt: new Date().toISOString() };
  }
}
