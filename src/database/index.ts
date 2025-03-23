import mongoose from 'mongoose'
import envConfig from '../config'
import { UserService, AuthService } from '../core/services'
import LoggerService from '../core/services/LoggerService'

class Database {
  init = async () => {
    try {
      await mongoose.connect(envConfig.MONGO_URL)
      LoggerService.info({
        where: 'Database',
        message: 'MongoDB connected successfully'
      })
      await this.createMyAIAccount()
    } catch (error: any) {
      LoggerService.error({
        where: 'Database',
        message: `MongoDB connection error: ${error.message}`
      })
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
    LoggerService.info({
      where: 'Database',
      message: 'MongoDB disconnected successfully'
    })
  }
}

export default new Database()
