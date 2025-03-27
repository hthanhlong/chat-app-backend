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

    WsService.sendDataToClientById(userUuid, {
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
    if (cachedNotifications.length > 0) return cachedNotifications
    const notifications =
      await NotificationRepository.getAllNotificationsById(id)
    RedisService.set(cacheKey, notifications, 180000)
    return notifications
  }
}

export default new NotificationService()
