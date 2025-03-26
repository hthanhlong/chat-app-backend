import Redis from 'ioredis'
import envConfig from '../../config'
import LoggerService from './LoggerService'
import { User } from '@prisma/client'
class RedisService {
  private redisPub!: Redis
  private redisSub!: Redis

  CACHE_KEYS = {
    get_notifications_by_id: (id: number) => `get-notifications-by-id:${id}`,
    get_friend_list_by_id: (id: number) => `get-friend-list-by-id:${id}`,
    get_user_by_id: (id: number) => `get-user-by-id:${id}`,
    get_user_by_email: (email: string) => `get-user-by-email:${email}`
  }

  CHANNELS = {
    clients_connected: 'clients_connected'
  }

  initPub() {
    this.redisPub = new Redis({
      host: envConfig.REDIS_HOST,
      port: Number(envConfig.REDIS_PORT)
    })

    this.redisPub.on('connect', () => {
      LoggerService.info({
        where: 'RedisService',
        message: 'RedisPub connected successfully'
      })
    })

    this.redisPub.on('error', (err) => {
      LoggerService.error({
        where: 'RedisService',
        message: 'Redis error'
      })
      process.exit(1)
    })
  }

  initSub() {
    this.redisSub = new Redis({
      host: envConfig.REDIS_HOST,
      port: Number(envConfig.REDIS_PORT)
    })

    this.redisSub.on('connect', () => {
      LoggerService.info({
        where: 'RedisService',
        message: 'RedisSub connected successfully'
      })
    })

    this.redisSub.on('error', (err) => {
      LoggerService.error({
        where: 'RedisService',
        message: 'Redis error'
      })
      process.exit(1)
    })

    this.redisSub.on('message', (channel, message) => {
      if (channel === this.CHANNELS.clients_connected) {
        const data = JSON.parse(message)
        console.log(data)
      }
    })
  }

  set(key: string, value: any, ttl?: number) {
    if (ttl) {
      this.redisPub.set(key, JSON.stringify(value), 'EX', ttl)
    } else {
      this.redisPub.set(key, JSON.stringify(value))
    }
  }

  async get(key: string) {
    const result = await this.redisPub.get(key)
    if (result) {
      return JSON.parse(result)
    }
    return null
  }

  delete(key: string) {
    this.redisPub.del(key)
  }

  setUser(userId: number, user: User) {
    this.redisPub.set(userId.toString(), JSON.stringify(user), 'EX', 180000)
  }

  async getUser(userId: number) {
    const cachedUser = await this.redisPub.get(userId.toString())
    if (cachedUser) {
      return JSON.parse(cachedUser)
    }
    return null
  }

  deleteUser(userId: number) {
    this.redisPub.del(userId.toString())
  }

  disconnect() {
    this.redisPub.disconnect()
    this.redisSub.disconnect()
    LoggerService.info({
      where: 'RedisService',
      message: 'Redis disconnected successfully'
    })
  }

  subscribe(channel: string) {
    this.redisSub.subscribe(channel, (err) => {
      if (err) {
        LoggerService.error({
          where: 'RedisService',
          message: 'Redis subscribe error'
        })
      }
    })
  }

  unsubscribe(channel: string) {
    this.redisSub.unsubscribe(channel, (err) => {
      if (err) {
        LoggerService.error({
          where: 'RedisService',
          message: 'Redis unsubscribe error'
        })
      }
    })
  }

  publishClients(message: string) {
    this.redisPub.publish(this.CHANNELS.clients_connected, message, (err) => {
      if (err) {
        LoggerService.error({
          where: 'RedisService',
          message: 'Redis publish error'
        })
      }
    })
  }

  subOnMessage(callback: (channel: string, message: string) => void) {
    this.redisSub.on('message', callback)
  }
}

export default new RedisService()
