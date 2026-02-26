export class NotificationsService {
  push(userId: string, message: string) {
    return { channel: 'push', userId, message, sent: true };
  }
}
