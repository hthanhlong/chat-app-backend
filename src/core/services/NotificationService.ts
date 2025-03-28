import { NotificationRepository } from '../repositories'
import RedisService from './RedisService'
import WsService from './WsService'
import Utils from './UtilsService'
class NotificationService {
  async createNotification({
    userUuid,
    type,
    content,
    status
  }: {
    userUuid: string
    type: 'FRIEND' | 'MESSAGE' | 'POST'
    content: string
    status: 'READ' | 'UNREAD'
  }) {
    const userId = await Utils.getUserIdFromUserUuid(userUuid)
    if (!userId) return false

    await NotificationRepository.createNotification({
      userId,
      type,
      content,
      status
    })
    // delete cache
    const cacheKey = RedisService.CACHE_KEYS.get_notifications_by_id(userId)
    RedisService.delete(cacheKey)
    // send to client
    WsService.sendDataToClientById(userUuid, {
      type: 'HAS_NEW_NOTIFICATION',
      payload: null
    })

    return true
  }

  async updateNotification({
    userId,
    notificationUuid,
    status
  }: {
    userId: number
    notificationUuid: string
    status: 'READ' | 'UNREAD'
  }) {
    const notification = await NotificationRepository.updateNotification({
      notificationUuid,
      status
    })
    // delete cache
    const cacheKey = RedisService.CACHE_KEYS.get_notifications_by_id(userId)
    RedisService.delete(cacheKey)
    return notification
  }

  async getAllNotificationsById(id: number) {
    const cacheKey = RedisService.CACHE_KEYS.get_notifications_by_id(id)
    const cachedNotifications = await RedisService.get(cacheKey)
    if (Array.isArray(cachedNotifications) && cachedNotifications.length > 0)
      return cachedNotifications
    const notifications =
      await NotificationRepository.getAllNotificationsById(id)
    RedisService.set(cacheKey, notifications, 180000)
    return notifications
  }
}

export default new NotificationService()
