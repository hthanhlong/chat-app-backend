import { ObjectId } from 'mongoose'
import { checkPassword, generateSalt, hashPassword } from '../../utils'
import { UserRepository } from '../repositories'
import { FriendService, JWTService } from '.'
import { signUpInput, User, JWT_PAYLOAD } from '../../types'

class AuthService {
  async validatePassword(
    password: string,
    hashedPassword: string,
    salt: string
  ) {
    return checkPassword(password, hashedPassword, salt)
  }

  async signUp({ nickname, username, email, password, caption }: signUpInput) {
    const salt = await generateSalt()
    const hashedPassword = await hashPassword(password, salt)

    const user: Omit<User, '_id'> = {
      nickname,
      username,
      email,
      password: hashedPassword,
      caption,
      verified: true,
      isActive: true,
      salt: salt
    }
    const result = await UserRepository.createUser(user)
    const myAI = await UserRepository.findUserByEmail('MyAI@gmail.com')
    if (myAI && result) {
      await FriendService.updateStatusFriend({
        senderId: myAI.user._id.toString(),
        receiverId: result.user._id.toString(),
        status: 'FRIEND'
      })
    }
    return result
  }

  async signIn({ id, username }: { id: ObjectId; username: string }) {
    if (!username) return null
    const payload = {
      id: id.toString(),
      username: username
    } as JWT_PAYLOAD
    const { accessToken, refreshToken } = JWTService.generateToken(payload)
    const result = Object.assign(payload, { accessToken, refreshToken })
    return result
  }

  async refreshToken(decoded: { id: string; username: string }) {
    const { id, username } = decoded
    const accessToken = JWTService.signAccessToken({ id, username })
    return { accessToken }
  }
}

export default new AuthService()
