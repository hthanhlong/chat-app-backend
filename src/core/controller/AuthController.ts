import { Response, Request } from 'express'
import HttpException from '../../exceptions/httpExceptions'
import { OAuth2Client, TokenPayload } from 'google-auth-library'
import envConfig from '../../config'
import { UserService, AuthService } from '../services'
import RedisService from '../services/RedisService'
import LoggerService from '../services/LoggerService'
import { User } from '@prisma/client'
import { JWT_PAYLOAD } from '../../types'

const client = new OAuth2Client(envConfig.GOOGLE_CLIENT_ID)

class AuthController {
  signUp = async (req: Request, res: Response) => {
    const { username, email } = req.body
    LoggerService.info({
      where: 'AuthController',
      message: `signUp: ${username} ${email}`
    })
    const isExistUsername = await UserService.findUserByUsername(username)
    if (isExistUsername) {
      res.status(400).json({
        isSuccess: false,
        errorCode: null,
        message: 'Username already exists',
        data: null
      })
    }

    const user = await UserService.findUserByEmail(email)
    if (user !== null) {
      res.status(400).json({
        isSuccess: false,
        errorCode: null,
        message: 'Email already exists',
        data: null
      })
    }

    await AuthService.signUp(req.body)

    LoggerService.info({
      where: 'AuthController',
      message: `signUp: ${username} ${email} successful`
    })

    res.status(201).json({
      isSuccess: true,
      errorCode: null,
      message: 'Signup successful',
      data: null
    })
  }

  signIn = async (req: Request, res: Response) => {
    const { username, password } = req.body
    LoggerService.info({
      where: 'AuthController',
      message: `signIn: ${username}`
    })
    const user = await UserService.findUserByUsername(username)
    if (user === null) {
      throw HttpException.badRequestError()
    }

    const { hashedPassword, salt } = user as User

    const isRightPassword = await AuthService.validatePassword(
      password,
      hashedPassword,
      salt
    )

    if (!isRightPassword) {
      throw HttpException.badRequestError()
    }

    const data = await AuthService.signIn({
      id: user.id,
      uuid: user.uuid,
      name: user.name,
      nickName: user.nickName
    })
    LoggerService.info({
      where: 'AuthController',
      message: `signIn: ${username} successful`
    })
    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Sign in successful',
      data: data
    })
  }

  refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.refreshToken as JWT_PAYLOAD
    const newAccessToken = await AuthService.refreshToken(refreshToken)
    LoggerService.info({
      where: 'AuthController',
      message: 'Refresh token successful'
    })
    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Refresh token successful',
      data: { accessToken: newAccessToken }
    })
  }

  googleSignIn = async (req: Request, res: Response) => {
    const { credential } = req.body
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: envConfig.GOOGLE_CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
    })
    const payload = ticket.getPayload()
    if (!payload) {
      throw HttpException.badRequestError()
    }
    const { email, name } = payload as TokenPayload
    let user = await UserService.findUserByEmail(email as string)

    if (!user) {
      const newUser = await AuthService.signUp({
        email: email as string,
        username: email as string,
        nickName: name as string,
        password: (envConfig.PASSWORD_KEY + email) as string
      })

      user = newUser
    }

    const data = await AuthService.signIn({
      id: user.id,
      uuid: user.uuid,
      name: user.name,
      nickName: user.nickName
    })
    LoggerService.info({
      where: 'AuthController',
      message: 'Google sign in successful'
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Google sign in successful',
      data: data
    })
  }

  signOut = async (req: Request, res: Response) => {
    const { id: userId } = req.decoded as JWT_PAYLOAD
    RedisService.deleteUser(userId)

    LoggerService.info({
      where: 'AuthController',
      message: 'Sign out successful'
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Sign out successful'
    })
  }
}

export default new AuthController()
