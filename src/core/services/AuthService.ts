import { checkPassword, generateSalt, hashPassword } from '../../utils'
import { FriendShipService, JWTService, UserService } from '.'
import { signUpInput, JWT_PAYLOAD } from '../../types'
import { User } from '@prisma/client'
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

    const user: Omit<User, 'id' | 'uuid' | 'createdAt' | 'updatedAt'> = {
      nickName: nickname,
      name: username,
      email,
      hashedPassword,
      caption: caption || 'what is on your mind?',
      isVerified: true,
      isActive: true,
      salt: salt,
      profilePicUrl: '',
      phone: '',
      isDeleted: false
    }

    const result = await UserService.createUser(user as User)
    const myAI = await UserService.findUserByEmail('myai@gmail.com')

    if (myAI && result) {
      await FriendShipService.updateStatusFriend({
        senderId: myAI.id,
        receiverId: result.id,
        status: 'FRIEND'
      })
    }
    return result
  }

  async signIn({
    id,
    username,
    uuid
  }: {
    id: number
    username: string
    uuid: string
  }) {
    if (!username) return null
    const payload = {
      id: id,
      uuid: uuid,
      username: username
    } as JWT_PAYLOAD
    const { accessToken, refreshToken } = JWTService.generateToken(payload)
    const result = Object.assign(payload, { accessToken, refreshToken })
    return result
  }

  async refreshToken(refreshToken: JWT_PAYLOAD): Promise<string> {
    const { id, username, uuid } = refreshToken
    const accessToken = JWTService.signAccessToken({ id, username, uuid })
    return accessToken
  }
}

export default new AuthService()
