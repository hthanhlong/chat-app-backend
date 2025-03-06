import { Request, Response } from 'express'
import { BadRequestError } from '../../utils/httpExceptions'
import { OAuth2Client, TokenPayload } from 'google-auth-library'
import { GOOGLE_CLIENT_ID, PASSWORD_KEY } from '../../config'
import { UserService, AuthService } from '../services'
const client = new OAuth2Client(GOOGLE_CLIENT_ID)

export const signupController = async (req: Request, res: Response) => {
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

  await AuthService.signup(req.body)

  res.status(201).json({
    isSuccess: true,
    errorCode: null,
    message: 'Signup successful',
    data: null
  })
}

export const loginController = async (req: Request, res: Response) => {
  const user = await UserService.findUserByUsername(req.body.username)
  if (user === null) {
    throw new BadRequestError('Email or Password was not correctly')
  }

  const { password: hashedPassword, salt } = user

  const isRightPassword = await AuthService.ValidatePassword(
    req.body.password,
    hashedPassword,
    salt
  )

  if (!isRightPassword) {
    throw new BadRequestError('Email or Password was not correctly')
  }

  const data = await AuthService.login({
    // @ts-ignore
    id: user._id,
    username: user.username
  })

  res.status(200).json({
    isSuccess: true,
    errorCode: null,
    message: 'login successful',
    data: data
  })
}

export const refreshTokenController = async (req: Request, res: Response) => {
  const decoded = req.decoded
  const data = await AuthService.refreshToken(decoded)
  res.status(200).json({
    isSuccess: true,
    errorCode: null,
    message: 'refresh token successful',
    data: data
  })
}

export const googleLoginController = async (req: Request, res: Response) => {
  const { credential } = req.body
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: GOOGLE_CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
  })
  const payload = ticket.getPayload()
  if (!payload) {
    throw new BadRequestError('Invalid Google token')
  }
  const { email, name } = payload as TokenPayload
  let user = await UserService.findUserByEmail(email as string)

  if (!user) {
    const { user: newUser } = await AuthService.signup({
      email: email as string,
      username: email as string,
      nickname: name as string,
      password: (PASSWORD_KEY + email) as string
    })

    user = newUser
  }

  const data = await AuthService.login({
    // @ts-ignore
    id: user._id,
    // @ts-ignore
    username: user.username
  })

  res.status(200).json({
    isSuccess: true,
    errorCode: null,
    message: 'login successful',
    data: data
  })
}
