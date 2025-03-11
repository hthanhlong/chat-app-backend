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

  getUser(userId: string) {
    return this.redis.get(userId)
  }

  disconnect() {
    this.redis.disconnect()
  }
}

export default new RedisService()
