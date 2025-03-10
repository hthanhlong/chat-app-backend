import { dataSelectedByKeys } from '../../utils'
import { UserRepository } from '../repositories'
import { IUser } from '../../database/model/User'

class UserService {
  async createUser(user: IUser) {
    const result = await UserRepository.createUser(user)
    return result
  }

  async getAllUsers(id: string) {
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

  async updateUserById(id: string, newDataOfUser: IUser) {
    const result = await UserRepository.updateUserById(id, newDataOfUser)
    return result
  }

  async findUserByEmail(email: string) {
    const result = await UserRepository.findUserByEmail(email)
    return result
  }

  async findUserById(id: string) {
    const result = await UserRepository.findUserById(id)
    return result
  }

  async findUserByUsername(username: string): Promise<IUser | null> {
    const user = await UserRepository.findUserByUsername(username)
    return user
  }
}

export default new UserService()
