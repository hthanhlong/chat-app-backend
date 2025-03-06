import { Notification } from '../../database/model'
import { WsService } from '../services'

class NotificationRepository {
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
    const notification = {
      senderId,
      receiverId,
      type: type,
      content: content,
      status: status
    }
    await Notification.create(notification)

    WsService.sendDataToClientById(receiverId, {
      type: 'HAS_NEW_NOTIFICATION',
      payload: notification
    })
  }

  async updateNotification({
    id,
    status
  }: {
    id: string
    status: 'READ' | 'UNREAD'
  }) {
    await Notification.findByIdAndUpdate(id, { status })
  }

  async getAllNotificationsById(id: string) {
    const allNotifications = await Notification.find({
      receiverId: id
    })
      .sort({ createdAt: -1 })
      .limit(50)
    return allNotifications
  }
}

export default new NotificationRepository()
