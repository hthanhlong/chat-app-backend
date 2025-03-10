import UserModel, { IUser } from '../../database/model/User'
class UserRepository {
  async getAllUsers(id: string) {
    const users = await UserModel.find({
      _id: { $not: { $eq: id } }
    }).limit(20)
    return users
  }

  async createUser(user: IUser) {
    const createdUser = await UserModel.create(user)
    return createdUser
  }

  async updateUserById(id: string, user: IUser) {
    const updatedUser = await UserModel.findOneAndUpdate({ _id: id }, user, {
      new: true
    })
    return updatedUser
  }

  async findUserByEmail(email: string) {
    const user = await UserModel.findOne({ email })
    return user
  }

  async findUserById(id: string) {
    const user = await UserModel.findById(id)
    return user
  }

  async findUserByUsername(username: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ username })
    return user as IUser | null
  }
}

export default new UserRepository()
