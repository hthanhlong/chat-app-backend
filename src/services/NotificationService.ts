import NotificationRepository from '../repositories/NotificationRepository';

class NotificationService {
  createNotification({
    senderId,
    receiverId,
  }: {
    senderId: string;
    receiverId: string;
  }) {
    return NotificationRepository.createNotification({
      senderId,
      receiverId,
    });
  }

  updateNotification({
    id,
    status,
  }: {
    id: string;
    status: 'READ' | 'UNREAD';
  }) {
    return NotificationRepository.updateNotification({ id, status });
  }

  getAllNotificationsById(id: string) {
    return NotificationRepository.getAllNotificationsById(id);
  }
}

export default new NotificationService();
