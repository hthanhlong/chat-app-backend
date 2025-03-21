import { Response } from 'express'
import HttpException from '../../utils/httpExceptions'
import { OAuth2Client, TokenPayload } from 'google-auth-library'
import envConfig from '../../config'
import { UserService, AuthService } from '../services'
import { JWT_PAYLOAD, IRequest } from '../../types'
import { IUser } from '../../database/model/User'
import RedisService from '../../redis/RedisService'
import logger from '../../utils/logger'

const _logger = logger('AuthController')

const client = new OAuth2Client(envConfig.GOOGLE_CLIENT_ID)

class AuthController {
  signUp = async (req: IRequest, res: Response) => {
    const { username, email } = req.body

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

    _logger(req).info('Signup successful')

    res.status(201).json({
      isSuccess: true,
      errorCode: null,
      message: 'Signup successful',
      data: null
    })
  }

  signIn = async (req: IRequest, res: Response) => {
    const { username, password } = req.body

    const user = await UserService.findUserByUsername(username)
    if (user === null) {
      throw HttpException.badRequestError()
    }

    const { password: hashedPassword, salt } = user as IUser

    const isRightPassword = await AuthService.validatePassword(
      password,
      hashedPassword,
      salt
    )

    if (!isRightPassword) {
      throw HttpException.badRequestError()
    }

    const data = await AuthService.signIn({
      id: user._id.toString(),
      username: user.username
    })
    _logger(req).info('Sign in successful')
    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Sign in successful',
      data: data
    })
  }

  refreshToken = async (req: IRequest, res: Response) => {
    const refreshToken = req.refreshToken as JWT_PAYLOAD
    const newAccessToken = await AuthService.refreshToken(refreshToken)
    _logger(req).info('Refresh token successful')
    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Refresh token successful',
      data: { accessToken: newAccessToken }
    })
  }

  googleSignIn = async (req: IRequest, res: Response) => {
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
        nickname: name as string,
        password: (envConfig.PASSWORD_KEY + email) as string
      })

      user = newUser
    }

    const data = await AuthService.signIn({
      id: user._id.toString(),
      username: user.username
    })
    _logger(req).info('Google sign in successful')

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Google sign in successful',
      data: data
    })
  }

  signOut = async (req: IRequest, res: Response) => {
    const { userId } = req.decoded
    RedisService.deleteUser(userId)

    _logger(req).info('Sign out successful')

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Sign out successful'
    })
  }
}

export default new AuthController()
