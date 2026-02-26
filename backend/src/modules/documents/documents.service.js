export class DocumentsService {
  constructor(store) {
    this.store = store;
  }

  createEttn(orderId) {
    const doc = {
      id: `ettn_${orderId}`,
      orderId,
      status: 'issued',
      fileUrl: `https://mock-s3.local/ettn-${orderId}.pdf`,
      signed: false,
    };
    this.store.documents.set(doc.id, doc);
    return doc;
  }
}
