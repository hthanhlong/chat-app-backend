import { dataSelectedByKeys } from '../../utils'
import { UserRepository } from '../repositories'

class UserService {
  async getAllUsers(id: string) {
    const result = await UserRepository.getAllUsers(id)
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
    const result = await UserRepository.updateUserById(id, newDataOfUser)
    if (!result.user) return null
    return result.user
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const result = await UserRepository.findUserByEmail(email)
    if (!result.user) return null
    return result.user
  }

  async findUserById(id: string) {
    const result = await UserRepository.findUserById(id)
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
    const result = await UserRepository.findUserByUsername(username)
    if (!result.user) return null
    return result.user
  }
}

export default new UserService()
