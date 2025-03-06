import jwt from 'jsonwebtoken'
import { checkPassword, generateSalt, hashPassword } from './../utils'
import User from '../database/model/User'
import UserRepository from '../repositories/UserRepository'
import { generateToken } from '../core/JWT'
import { ACCESS_TOKEN_TIME, JWT_SECRET_ACCESS } from '../config'
import FriendService from './FriendService'
import { ObjectId } from 'mongoose'

class AuthService {
  async ValidatePassword(
    password: string,
    hashedPassword: string,
    salt: string
  ) {
    return checkPassword(password, hashedPassword, salt)
  }

  async signup({ nickname, username, email, password, caption }: signUpInput) {
    const salt = await generateSalt()
    const hashedPassword = await hashPassword(password, salt)
    const user: User = {
      nickname,
      username,
      email,
      caption,
      password: hashedPassword,
      verified: true,
      isActive: true,
      salt: salt
    }
    const result = await UserRepository.createUser(user)
    const myAI = await UserRepository.findUserByEmail('MyAI@gmail.com')
    if (myAI && result) {
      await FriendService.updateStatusFriend({
        // @ts-ignore
        senderId: myAI.user._id.toString(),
        // @ts-ignore
        receiverId: result.user._id.toString(),
        status: 'FRIEND'
      })
    }
    return result
  }

  async login({ id, username }: { id: ObjectId; username: string }) {
    if (!username) return null
    const payload = {
      //@ts-ignore
      id: id.toString(),
      username: username
    } as JWT_PAYLOAD
    const { accessToken, refreshToken } = generateToken(payload)
    const result = Object.assign(payload, { accessToken, refreshToken })
    return result
  }

  async refreshToken(decoded: { id: string; username: string }) {
    const { id, username } = decoded
    const accessToken = jwt.sign({ id, username }, JWT_SECRET_ACCESS, {
      expiresIn: ACCESS_TOKEN_TIME
    })
    return { accessToken }
  }
}

export default new AuthService()
