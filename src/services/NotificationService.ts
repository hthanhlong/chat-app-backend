import NotificationRepository from '../repositories/NotificationRepository';

class NotificationService {
  async createNotification({
    senderId,
    receiverId,
  }: {
    senderId: string;
    receiverId: string;
  }) {
    return await NotificationRepository.createNotification({
      senderId,
      receiverId,
    });
  }

  async updateNotification({
    id,
    status,
  }: {
    id: string;
    status: 'READ' | 'UNREAD';
  }) {
    return await NotificationRepository.updateNotification({ id, status });
  }

  async getAllNotificationsById(id: string) {
    return await NotificationRepository.getAllNotificationsById(id);
  }
}

export default new NotificationService();
