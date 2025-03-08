import { Response } from 'express'
import { BadRequestError } from '../../utils/httpExceptions'
import { OAuth2Client, TokenPayload } from 'google-auth-library'
import envConfig from '../../config'
import { UserService, AuthService } from '../services'
import { JWT_PAYLOAD, IRequest } from '../../types'
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

    res.status(201).json({
      isSuccess: true,
      errorCode: null,
      message: 'Signup successful',
      data: null
    })
  }

  signIn = async (req: IRequest, res: Response) => {
    const user = await UserService.findUserByUsername(req.body.username)
    if (user === null) {
      throw new BadRequestError('Email or Password was not correctly')
    }

    const { password: hashedPassword, salt } = user

    const isRightPassword = await AuthService.validatePassword(
      req.body.password,
      hashedPassword,
      salt
    )

    if (!isRightPassword) {
      throw new BadRequestError('Email or Password was not correctly')
    }

    const data = await AuthService.signIn({
      // @ts-ignore
      id: user._id,
      username: user.username
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Sign in successful',
      data: data
    })
  }

  refreshToken = async (req: IRequest, res: Response) => {
    const decoded = req.decoded as JWT_PAYLOAD
    const data = await AuthService.refreshToken(decoded)
    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Refresh token successful',
      data: data
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
      throw new BadRequestError('Invalid Google token')
    }
    const { email, name } = payload as TokenPayload
    let user = await UserService.findUserByEmail(email as string)

    if (!user) {
      const { user: newUser } = await AuthService.signUp({
        email: email as string,
        username: email as string,
        nickname: name as string,
        password: (envConfig.PASSWORD_KEY + email) as string
      })

      user = newUser
    }

    const data = await AuthService.signIn({
      id: user._id,
      username: user.username
    })

    res.status(200).json({
      isSuccess: true,
      errorCode: null,
      message: 'Google sign in successful',
      data: data
    })
  }
}

export default new AuthController()
