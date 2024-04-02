import NotificationRepository from '../repositories/NotificationRepository'

class NotificationService {
  async createNotification({
    senderId,
    receiverId,
    type,
    content,
    status
  }: {
    senderId: string
    receiverId: string
    type: 'FRIEND' | 'MESSAGE' | 'POST'
    content: string
    status: 'READ' | 'UNREAD'
  }) {
    return await NotificationRepository.createNotification({
      senderId,
      receiverId,
      type,
      content,
      status
    })
  }

  async updateNotification({
    id,
    status
  }: {
    id: string
    status: 'READ' | 'UNREAD'
  }) {
    return await NotificationRepository.updateNotification({ id, status })
  }

  async getAllNotificationsById(id: string) {
    return await NotificationRepository.getAllNotificationsById(id)
  }
}

export default new NotificationService()
