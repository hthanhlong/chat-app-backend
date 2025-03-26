import { PrismaClient } from '@prisma/client'
import LoggerService from '../core/services/LoggerService'
import UserService from '../core/services/UserService'
import AuthService from '../core/services/AuthService'

const prisma = new PrismaClient()

async function checkDatabaseConnection() {
  try {
    await prisma.$connect()
    LoggerService.info({
      where: 'Database',
      message: 'Prisma connected successfully'
    })
    await createMyAIAccount()
  } catch (error) {
    LoggerService.error({
      where: 'Database',
      message: 'Prisma connection error'
    })
    process.exit(1) // Dừng ứng dụng nếu không kết nối được
  }
}

const createMyAIAccount = async () => {
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

export default checkDatabaseConnection
