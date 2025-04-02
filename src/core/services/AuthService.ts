import { checkPassword, generateSalt, hashPassword } from '../../utils'
import { FriendShipService, JWTService, UserService } from '.'
import { User } from '@prisma/client'
class AuthService {
  async validatePassword(
    password: string,
    hashedPassword: string,
    salt: string
  ) {
    return checkPassword(password, hashedPassword, salt)
  }

  async signUp({ nickName, username, email, password, caption }: signUpInput) {
    const salt = await generateSalt()
    const hashedPassword = await hashPassword(password, salt)

    const user: Omit<User, 'id' | 'uuid' | 'createdAt' | 'updatedAt'> = {
      nickName: nickName,
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
        senderUuid: myAI.uuid,
        senderNickName: myAI.nickName,
        receiverUuid: result.uuid,
        status: 'FRIEND'
      })
    }
    return result
  }

  async signIn({
    id,
    name,
    uuid,
    nickName
  }: {
    id: number
    name: string
    uuid: string
    nickName: string
  }) {
    if (!name) return null
    const payload = {
      id: id,
      uuid: uuid,
      name: name,
      nickName: nickName
    } as JWT_PAYLOAD
    const { accessToken, refreshToken } = JWTService.generateToken(payload)
    const result = Object.assign(payload, { accessToken, refreshToken })
    return result
  }

  async refreshToken(refreshToken: JWT_PAYLOAD): Promise<string> {
    const { id, name, uuid, nickName } = refreshToken
    const accessToken = JWTService.signAccessToken({ id, name, uuid, nickName })
    return accessToken
  }
}

export default new AuthService()
