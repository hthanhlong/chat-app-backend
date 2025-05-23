import { dataSelectedByKeys } from '../../utils'
import { UserRepository } from '../repositories'
import { User } from '@prisma/client/default'
import Utils from './UtilsService'
import { AwsService, RedisService } from '.'

class UserService {
  async createUser(user: User) {
    const result = await UserRepository.createUser(user)
    return result
  }

  async getAllUsers(id: number) {
    const users = await UserRepository.getAllUsers(id)
    const response = dataSelectedByKeys(users, [
      'id',
      'uuid',
      'name',
      'email',
      'nickName',
      'caption'
    ])
    return response
  }

  async updateUserById(
    id: number,
    data: {
      file: Express.Multer.File
      caption: string
      nickName: string
    }
  ) {
    const cacheKey = RedisService.CACHE_KEYS.get_user_by_id(id)
    RedisService.delete(cacheKey)
    const file = data.file
    const newData: {
      profilePicUrl?: string
      caption: string
      nickName: string
    } = {
      caption: data.caption,
      nickName: data.nickName
    }
    if (file) {
      const profilePicUrl = await AwsService.uploadFile(file)
      newData.profilePicUrl = profilePicUrl
    }
    const result = await UserRepository.updateUserById(id, newData)
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
    if (!id) return null
    const cacheKey = RedisService.CACHE_KEYS.get_user_by_id(id)
    const cachedUser = await RedisService.get(cacheKey)
    if (cachedUser) return cachedUser
    const result = await UserRepository.findUserById(id)
    if (result) RedisService.setUser(id, result as User)
    return result
  }

  async findUserByUuid(uuid: string) {
    const id = await Utils.getUserIdFromUserUuid(uuid)
    if (!id) return null
    return await this.findUserById(id)
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const user = await UserRepository.findUserByUsername(username)
    return user
  }
}

export default new UserService()
