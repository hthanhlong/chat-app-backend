import { dataSelectedByKeys } from '../database/utils'
import User from '../database/model/User'
import userRepository from '../repositories/UserRepository'

class UserService {
  async getAllUsers(id: string) {
    const result = await userRepository.getAllUsers(id)
    const response = dataSelectedByKeys(result.users, [
      '_id',
      'username',
      'email',
      'nickname',
      'caption'
    ])
    return response
  }

  async updateUserById(id: string, newDataOfUser: User) {
    const result = await userRepository.updateUserById(id, newDataOfUser)
    if (!result.user) return null
    return result.user
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const result = await userRepository.findUserByEmail(email)
    if (!result.user) return null
    return result.user
  }

  async findUserById(id: string) {
    const result = await userRepository.findUserById(id)
    if (!result.user) return null
    const response = dataSelectedByKeys(result.user, [
      '_id',
      'username',
      'email',
      'nickname',
      'caption'
    ])
    return response
  }

  async findUserByUsername(username: string) {
    const result = await userRepository.findUserByUsername(username)
    if (!result.user) return null
    return result.user
  }
}

export default new UserService()
