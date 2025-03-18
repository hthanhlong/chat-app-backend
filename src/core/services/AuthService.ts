import { checkPassword, generateSalt, hashPassword } from '../../utils'
import { FriendService, JWTService, UserService } from '.'
import { signUpInput, JWT_PAYLOAD } from '../../types'
import { IUser } from '../../database/model/User'

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

    const user = {
      nickname,
      username,
      email,
      password: hashedPassword,
      caption: caption || '',
      verified: true,
      isActive: true,
      salt: salt,
      profilePicUrl: ''
    }

    const result = await UserService.createUser(user as IUser)
    const myAI = await UserService.findUserByEmail('myai@gmail.com')

    if (myAI && result) {
      await FriendService.updateStatusFriend({
        senderId: myAI._id.toString(),
        receiverId: result._id.toString(),
        status: 'FRIEND'
      })
    }
    return result
  }

  async signIn({ id, username }: { id: string; username: string }) {
    if (!username) return null
    const payload = {
      userId: id,
      username: username
    } as JWT_PAYLOAD
    const { accessToken, refreshToken } = JWTService.generateToken(payload)
    const result = Object.assign(payload, { accessToken, refreshToken })
    return result
  }

  async refreshToken(refreshToken: JWT_PAYLOAD): Promise<string> {
    const { userId, username } = refreshToken
    const accessToken = JWTService.signAccessToken({ userId, username })
    return accessToken
  }
}

export default new AuthService()
