import { createClient } from 'redis'
import Logger from '../core/Logger'

const initRedis = async () => {
  try {
    const client = await createClient({
      url: 'redis://54.219.186.74:6379'
    })
      .on('connect', () => Logger.info('Connected to Redis'))
      .on('error', (err) => console.log('Redis Client Error', err))
      .connect()
    return client
  } catch (error) {
    Logger.error('Error initializing Redis', error)
  }
}

const redisClient = initRedis()
export default redisClient
