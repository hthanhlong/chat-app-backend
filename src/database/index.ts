import mongoose from 'mongoose'
import envConfig from '../config'
import logger from '../utils/logger'
import { UserService, AuthService } from '../core/services'

const _logger = logger('database')

class Database {
  init = async () => {
    try {
      await mongoose.connect(envConfig.MONGO_URL)
      _logger(null).info('MongoDB connected successfully')
      await this.createMyAIAccount()
    } catch (error) {
      _logger(null).error('MongoDB connection error:', error)
      process.exit(1)
    }
  }

  // seed
  createMyAIAccount = async () => {
    const user = await UserService.findUserByEmail('myai@gmail.com')
    if (user) return
    await AuthService.signUp({
      nickname: `I'm AI`,
      username: 'MyAI',
      email: 'myai@gmail.com',
      password: 'pjUl0Y+Ne62tvXvn',
      caption: 'I will help you'
    })
  }

  close = async () => {
    await mongoose.connection.close()
    _logger(null).info('MongoDB disconnected successfully')
  }
}

export default new Database()
