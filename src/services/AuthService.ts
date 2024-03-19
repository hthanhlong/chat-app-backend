import { checkPassword, generateSalt, hashPassword } from './../utils';
import User from '../database/model/User';
import userRepository from '../repositories/userRepository';
import { generateToken } from '../core/JWT';
class AuthService {
  async ValidatePassword(
    password: string,
    hashedPassword: string,
    salt: string,
  ) {
    return checkPassword(password, hashedPassword, salt);
  }

  async signup({ nickname, username, email, password, caption }: signUpInput) {
    const salt = await generateSalt();
    const hashedPassword = await hashPassword(password, salt);
    const user: User = {
      nickname,
      username,
      email,
      caption,
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
