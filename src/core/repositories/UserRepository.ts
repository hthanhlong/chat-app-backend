import { User } from '../../database/model'

class UserRepository {
  async getAllUsers(id: string): Promise<{ users: User[] }> {
    const users = await User.find({
      _id: { $not: { $eq: id } }
    }).limit(20)
    return { users: users.map((user) => ({ ...user.toObject() })) }
  }

  async createUser(user: User): Promise<{ user: User }> {
    const createdUser = await User.create(user)
    return { user: { ...createdUser.toObject() } }
  }

  async updateUserById(id: string, user: User): Promise<{ user: User | null }> {
    const updatedUser = await User.findOneAndUpdate({ _id: id }, user, {
      new: true
    })
    if (!updatedUser) {
      return { user: null }
    }
    return { user: updatedUser }
  }

  async findUserByEmail(email: string): Promise<{ user: User | null }> {
    const user = await User.find({ email })
    if (user.length === 0) {
      return { user: null }
    }
    return { user: { ...user[0].toObject() } }
  }

  async findUserById(id: string): Promise<{ user: User | null }> {
    const user = await User.findById(id)
    if (!user) {
      return { user: null }
    }
    return { user: { ...user.toObject() } }
  }

  async findUserByUsername(username: string): Promise<{ user: User | null }> {
    const user = await User.find({ username })
    if (user.length === 0) {
      return { user: null }
    }
    return { user: { ...user[0].toObject() } }
  }
}

export default new UserRepository()
