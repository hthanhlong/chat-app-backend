import { NotificationRepository } from '../repositories'
import RedisService from './RedisService'
import WsService from './WsService'
import Utils from './UtilsService'
class NotificationService {
  async createNotification({
    senderId,
    receiverUuid,
    type,
    content,
    status
  }: {
    senderId: number
    receiverUuid: string
    type: 'FRIEND' | 'MESSAGE' | 'POST'
    content: string
    status: 'READ' | 'UNREAD'
  }) {
    const receiverId = await Utils.getUserIdFromUserUuid(receiverUuid)
    if (!receiverId) return false

    await NotificationRepository.createNotification({
      senderId,
      receiverId,
      type,
      content,
      status
    })

    WsService.sendDataToClientById(receiverUuid, {
      type: 'HAS_NEW_NOTIFICATION',
      payload: null
    })

    return true
  }

  async updateNotification({
    id,
    status
  }: {
    id: number
    status: 'READ' | 'UNREAD'
  }) {
    const cacheKey = RedisService.CACHE_KEYS.get_notifications_by_id(id)
    RedisService.delete(cacheKey)
    return await NotificationRepository.updateNotification({ id, status })
  }

  async getAllNotificationsById(id: number) {
    const cacheKey = RedisService.CACHE_KEYS.get_notifications_by_id(id)
    const cachedNotifications = await RedisService.get(cacheKey)
    if (cachedNotifications) return cachedNotifications
    const notifications =
      await NotificationRepository.getAllNotificationsById(id)
    RedisService.set(cacheKey, notifications, 180000)
    return notifications
  }
}

export default new NotificationService()
