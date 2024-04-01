import { createClient, RedisClientType } from 'redis'
import Logger from '../core/Logger'

class RedisService {
  private static client: RedisClientType | null = null

  public static async initialize(): Promise<void> {
    if (!this.client) {
      this.client = createClient({
        url: 'redis://54.219.186.74:6379'
      })
      this.client.on('connect', () => Logger.info('Connected to Redis'))
      this.client.on('error', (err) => Logger.error('Redis Client Error', err))
      try {
        await this.client.connect()
      } catch (error) {
        Logger.error('Error initializing Redis', error)
        this.client = null
      }
    }
  }

  public static getClient(): RedisClientType | null {
    return this.client
  }
}

RedisService.initialize()
export default RedisService
