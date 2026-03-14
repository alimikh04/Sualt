export class AuditService {
  constructor(store) {
    this.store = store;
  }

  log({ actorUserId = 'system', actorRole = 'system', action, entity, entityId, meta = {} }) {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      at: new Date().toISOString(),
      actorUserId,
      actorRole,
      action,
      entity,
      entityId,
      meta,
    };
    this.store.auditLogs.push(entry);
    return entry;
  }

  list(limit = 100) {
    return this.store.auditLogs.slice(-limit).reverse();
  }
}
