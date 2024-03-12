import User from '../database/model/User';
import { generateSalt, hashPassword } from '../utils';
import userRepository from '../repositories/userRepository';
class AuthService {
  async findUserByEmail(email: string) {
    const result = await userRepository.findUserByEmail(email);
    if (!result.user) return null;
    return 1;
  }

  async findUserById(id: string) {
    const result = await userRepository.findUserById(id);
    if (!result.user) return null;
    return 1;
  }

  async findUserByUsername(username: string) {
    const result = await userRepository.findUserByUsername(username);
    if (!result.user) return null;
    return 1;
  }

  async signup({ username, email, password }: signUpInput) {
    const now = new Date();
    const salt = await generateSalt();
    const hashedPassword = await hashPassword(password, salt);
    const user: User = {
      username,
      email,
      password: hashedPassword,
      verified: true,
      isActive: true,
      salt: salt,
      createdAt: now,
      updatedAt: now,
    };
    await userRepository.createUser(user);
  }
}

export default new AuthService();
