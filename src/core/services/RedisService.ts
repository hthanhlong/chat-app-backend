import Redis from 'ioredis'
import envConfig from '../../config'
import logger from '../../utils/logger'
import { IUser } from '../../database/model/User'

const _logger = logger('RedisService')

class RedisService {
  private redisPub!: Redis
  private redisSub!: Redis

  CACHE_KEYS = {
    get_notifications_by_id: (id: string) => `get-notifications-by-id:${id}`,
    get_friend_list_by_id: (id: string) => `get-friend-list-by-id:${id}`,
    get_user_by_id: (id: string) => `get-user-by-id:${id}`,
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
      _logger(null).info('RedisPub connected successfully')
    })

    this.redisPub.on('error', (err) => {
      _logger(null).error('Redis error', err)
      process.exit(1)
    })
  }

  initSub() {
    this.redisSub = new Redis({
      host: envConfig.REDIS_HOST,
      port: Number(envConfig.REDIS_PORT)
    })

    this.redisSub.on('connect', () => {
      _logger(null).info('RedisSub connected successfully')
    })

    this.redisSub.on('error', (err) => {
      _logger(null).error('Redis error', err)
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

  setUser(userId: string, user: IUser) {
    this.redisPub.set(userId, JSON.stringify(user), 'EX', 180000)
  }

  async getUser(userId: string) {
    const cachedUser = await this.redisPub.get(userId)
    if (cachedUser) {
      return JSON.parse(cachedUser)
    }
    return null
  }

  deleteUser(userId: string) {
    this.redisPub.del(userId)
  }

  disconnect() {
    this.redisPub.disconnect()
    this.redisSub.disconnect()
    _logger(null).info('Redis disconnected successfully')
  }

  subscribe(channel: string) {
    this.redisSub.subscribe(channel, (err) => {
      if (err) {
        _logger(null).error('Redis subscribe error', err)
      }
    })
  }

  unsubscribe(channel: string) {
    this.redisSub.unsubscribe(channel, (err) => {
      if (err) {
        _logger(null).error('Redis unsubscribe error', err)
      }
    })
  }

  publishClients(message: string) {
    this.redisPub.publish(this.CHANNELS.clients_connected, message, (err) => {
      if (err) {
        _logger(null).error('Redis publish error', err)
      }
    })
  }

  subOnMessage(callback: (channel: string, message: string) => void) {
    this.redisSub.on('message', callback)
  }
}

export default new RedisService()
