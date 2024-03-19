import User, { UserModel } from '../database/model/User';

class UserRepository {
  async getAllUsers(): Promise<{ users: User[] }> {
    const users = await UserModel.find();
    return { users: users.map((user) => ({ ...user.toObject() })) };
  }

  async createUser(user: User): Promise<{ user: User }> {
    const createdUser = await UserModel.create(user);
    return { user: { ...createdUser.toObject() } };
  }

  async updateUserById(id: string, user: User): Promise<{ user: User | null }> {
    const updatedUser = await UserModel.findOneAndUpdate({ _id: id }, user, {
      new: true,
    });
    if (!updatedUser) {
      return { user: null };
    }
    return { user: updatedUser };
  }

  async findUserByEmail(email: string): Promise<{ user: User | null }> {
    const user = await UserModel.find({ email });
    if (user.length === 0) {
      return { user: null };
    }
    return { user: { ...user[0].toObject() } };
  }

  async findUserById(id: string): Promise<{ user: User | null }> {
    const user = await UserModel.findById(id);
    if (!user) {
      return { user: null };
    }
    return { user: { ...user.toObject() } };
  }

  async findUserByUsername(username: string): Promise<{ user: User | null }> {
    const user = await UserModel.find({ username });
    if (user.length === 0) {
      return { user: null };
    }
    return { user: { ...user[0].toObject() } };
  }
}

export default new UserRepository();
