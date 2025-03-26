import { dataSelectedByKeys } from '../../utils'
import { UserRepository } from '../repositories'
import RedisService from './RedisService'
import { User } from '@prisma/client/default'

class UserService {
  async createUser(user: User) {
    const result = await UserRepository.createUser(user)
    return result
  }

  async getAllUsers(id: number) {
    const users = await UserRepository.getAllUsers(id)
    const response = dataSelectedByKeys(users, [
      '_id',
      'username',
      'email',
      'nickname',
      'caption'
    ])
    return response
  }

  async updateUserById(id: number, newDataOfUser: User) {
    const cacheKey = RedisService.CACHE_KEYS.get_user_by_id(id)
    RedisService.delete(cacheKey)
    const result = await UserRepository.updateUserById(id, newDataOfUser)
    if (result) {
      RedisService.setUser(id, result as User)
    }
    return result
  }

  async findUserByEmail(email: string) {
    const result = await UserRepository.findUserByEmail(email)
    return result
  }

  async findUserById(id: number) {
    const cacheKey = RedisService.CACHE_KEYS.get_user_by_id(id)
    const cachedUser = await RedisService.get(cacheKey)
    if (cachedUser) return cachedUser
    const result = await UserRepository.findUserById(id)
    if (result) RedisService.setUser(id, result as User)
    return result
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const user = await UserRepository.findUserByUsername(username)
    return user
  }
}

export default new UserService()
