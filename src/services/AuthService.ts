import { checkPassword, generateSalt, hashPassword } from './../utils';
import User from '../database/model/User';
import userRepository from '../repositories/userRepository';
import { generateToken } from '../core/JWT';
class AuthService {
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

  async ValidatePassword(
    password: string,
    hashedPassword: string,
    salt: string,
  ) {
    return checkPassword(password, hashedPassword, salt);
  }

  async signup({ username, email, password }: signUpInput) {
    const salt = await generateSalt();
    const hashedPassword = await hashPassword(password, salt);
    const user: User = {
      username,
      email,
      password: hashedPassword,
      verified: true,
      isActive: true,
      salt: salt,
    };
    await userRepository.createUser(user);
  }

  async login(user: User) {
    if (!user) return null;
    const payload = {
      //@ts-ignore
      id: user._id.toString(),
      username: user.username,
    };
    const { accessToken, refreshToken } = generateToken(payload);
    const result = Object.assign(payload, { accessToken, refreshToken });
    return result;
  }
}

export default new AuthService();
