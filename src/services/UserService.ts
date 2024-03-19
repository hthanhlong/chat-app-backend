import User from '../database/model/User';
import userRepository from '../repositories/userRepository';

class UserService {
  async getAllUsers() {
    const result = await userRepository.getAllUsers();
    return result.users;
  }

  async updateUserById(id: string, user: User) {
    const result = await userRepository.updateUserById(id, user);
    if (!result.user) return null;
    return result.user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const result = await userRepository.findUserByEmail(email);
    if (!result.user) return null;
    return result.user;
  }

  async findUserById(id: string) {
    const result = await userRepository.findUserById(id);
    if (!result.user) return null;
    return result.user;
  }

  async findUserByUsername(username: string) {
    const result = await userRepository.findUserByUsername(username);
    if (!result.user) return null;
    return result.user;
  }
}

export default new UserService();
