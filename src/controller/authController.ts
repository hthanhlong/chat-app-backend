import { Request, Response } from 'express'
import AuthService from '../services/AuthService'
import UserService from '../services/UserService'
import { BadRequestError } from '../core/ApiError'

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

  const data = await AuthService.login(user)

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
