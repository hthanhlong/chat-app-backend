import Redis from 'ioredis'
import envConfig from '../../config'
import LoggerService from './LoggerService'
import { User } from '@prisma/client'
class RedisService {
  private redis!: Redis

  CACHE_KEYS = {
    get_notifications_by_id: (id: number) => `get-notifications-by-id:${id}`,
    get_friend_list_by_id: (id: number) => `get-friend-list-by-id:${id}`,
    get_user_by_id: (id: number) => `get-user-by-id:${id}`,
    get_user_by_email: (email: string) => `get-user-by-email:${email}`,
    get_id_by_uuid: (uuid: string) => `user:${uuid}`
  }

  CHANNELS = {
    clients_connected: 'clients_connected'
  }

  init() {
    this.redis = new Redis({
      host: envConfig.REDIS_HOST,
      port: Number(envConfig.REDIS_PORT)
    })
  }

  set(key: string, value: any, ttl?: number) {
    if (ttl) {
      this.redis.set(key, JSON.stringify(value), 'EX', ttl)
    } else {
      this.redis.set(key, JSON.stringify(value))
    }
  }

  async get(key: string) {
    const result = await this.redis.get(key)
    if (result) {
      return JSON.parse(result)
    }
    return null
  }

  delete(key: string) {
    this.redis.del(key)
  }

  setUser(userId: number, user: User) {
    this.redis.set(userId.toString(), JSON.stringify(user), 'EX', 180000)
  }

  async getUser(userId: number) {
    const cachedUser = await this.redis.get(userId.toString())
    if (cachedUser) {
      return JSON.parse(cachedUser)
    }
    return null
  }

  deleteUser(userId: number) {
    this.redis.del(userId.toString())
  }

  disconnect() {
    this.redis.disconnect()
    LoggerService.info({
      where: 'RedisService',
      message: 'Redis disconnected successfully'
    })
  }

  subscribe(channel: string) {
    this.redis.subscribe(channel, (err) => {
      if (err) {
        LoggerService.error({
          where: 'RedisService',
          message: 'Redis subscribe error'
        })
      }
    })
  }

  unsubscribe(channel: string) {
    this.redis.unsubscribe(channel, (err) => {
      if (err) {
        LoggerService.error({
          where: 'RedisService',
          message: 'Redis unsubscribe error'
        })
      }
    })
  }

  publishClients(message: string) {
    this.redis.publish(this.CHANNELS.clients_connected, message, (err) => {
      if (err) {
        LoggerService.error({
          where: 'RedisService',
          message: 'Redis publish error'
        })
      }
    })
  }

  subOnMessage(callback: (channel: string, message: string) => void) {
    this.redis.on('message', callback)
  }

  async getIdByUUID(uuid: string): Promise<number | null> {
    const result = await this.redis.get(this.CACHE_KEYS.get_id_by_uuid(uuid))
    if (result) {
      return parseInt(result)
    }
    return null
  }

  setIdByUUID(uuid: string, id: number) {
    const randomTime = Math.floor(Math.random() * 1000)
    this.redis.set(
      this.CACHE_KEYS.get_id_by_uuid(uuid),
      id.toString(),
      'EX',
      randomTime + 180000 // 3 minutes
    )
  }

  deleteIdByUUID(uuid: string) {
    this.redis.del(this.CACHE_KEYS.get_id_by_uuid(uuid))
  }
}

export default new RedisService()
