export class NotificationsService {
  sendPush(userId, message) {
    return { channel: 'push', userId, message, sent: true, at: new Date().toISOString() };
  }
}
