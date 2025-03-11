import Redis from 'ioredis'
import envConfig from '../config'
import logger from '../utils/logger'
import { IUser } from '../database/model/User'

const _logger = logger('RedisService')

class RedisService {
  private redis!: Redis

  init() {
    this.redis = new Redis({
      host: envConfig.REDIS_HOST,
      port: Number(envConfig.REDIS_PORT)
    })
    this.redis.on('connect', () => {
      _logger.info('Redis connected successfully')
    })
    this.redis.on('error', (err) => {
      _logger.error('Redis error', err)
    })
    return this.redis
  }

  setUser(userId: string, user: IUser) {
    this.redis.set(userId, JSON.stringify(user), 'EX', 180000)
  }

  async getUser(userId: string) {
    const cachedUser = await this.redis.get(userId)
    if (cachedUser) {
      return JSON.parse(cachedUser)
    }
    return null
  }

  deleteUser(userId: string) {
    this.redis.del(userId)
  }

  disconnect() {
    this.redis.disconnect()
    _logger.info('Redis disconnected successfully')
  }
}

export default new RedisService()
