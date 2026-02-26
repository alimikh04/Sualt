export class DocumentsService {
  generateEttnPdf(orderId: string) {
    return {
      orderId,
      status: 'issued',
      fileUrl: `s3://mock-bucket/ettn-${orderId}.pdf`,
      signed: false,
    };
  }

  mockSign(orderId: string) {
    return { orderId, status: 'signed', signedAt: new Date().toISOString() };
  }
}
