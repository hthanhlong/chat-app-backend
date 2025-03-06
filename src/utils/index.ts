import bcrypt from 'bcrypt'
import { NextFunction, Response, Request } from 'express'
import { NotFoundError } from './httpExceptions'
import jwt from 'jsonwebtoken'
import {
  ACCESS_TOKEN_TIME,
  JWT_SECRET_ACCESS,
  JWT_SECRET_REFRESH,
  REFRESH_TOKEN_TIME
} from '../config'
import {
  AccessTokenExpired,
  BadTokenError,
  RefreshTokenExpired
} from './httpExceptions'
import logger from './logger'

const _logger = logger('utils')

export const generateSalt = async (length: number = 6) => {
  const salt = await bcrypt.genSalt(length)
  return salt
}

export const hashPassword = async (
  password: string,
  salt: string
): Promise<string> => {
  try {
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  } catch (error) {
    throw error
  }
}

export const checkPassword = async (
  password: string,
  hashedPassword: string,
  salt: string
): Promise<boolean> => {
  const hash = await hashPassword(password, salt)
  if (hash === hashedPassword) {
    return true
  }
  return false
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const handleNotFoundRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new NotFoundError())
}

export const generateToken = (payload: any) => {
  const accessToken = jwt.sign(payload, JWT_SECRET_ACCESS, {
    expiresIn: ACCESS_TOKEN_TIME
  })
  const refreshToken = jwt.sign(payload, JWT_SECRET_REFRESH, {
    expiresIn: REFRESH_TOKEN_TIME
  })
  return { accessToken, refreshToken }
}

export const validateAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const k = JWT_SECRET_ACCESS
    if (!k) return null
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return null
    const decoded = jwt.verify(token, k)
    req.decoded = decoded as JWT_PAYLOAD
  } catch (error: Error | any) {
    if (error.message === 'Token is not valid') {
      next(new BadTokenError())
    }
    if (error.message === 'jwt expired') {
      next(new AccessTokenExpired())
    }
  }
}

export const validateRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  {
    try {
      const k = JWT_SECRET_REFRESH
      if (!k) return console.log('k is not defined')
      const token = req.body.refreshToken
      if (!token) throw new BadTokenError()
      const decoded = jwt.verify(token, k)
      req.decoded = decoded
      next()
    } catch (error: Error | any) {
      if (error.message === 'Token is not valid') {
        next(new BadTokenError())
      }
      if (error.message === 'jwt expired') {
        next(new RefreshTokenExpired())
      }
    }
  }
}

//middleware to validate token
export const validateTokenWS = (
  type: string = 'ACCESS',
  accessToken: string
): JWT_PAYLOAD | null => {
  try {
    const k = type === 'ACCESS' ? JWT_SECRET_ACCESS : JWT_SECRET_REFRESH
    const token = accessToken
    if (!token) return null
    const decoded = jwt.verify(token, k)
    return decoded as JWT_PAYLOAD
  } catch (error: Error | any) {
    return null
  }
}

export const dataSelectedByKeys = (
  data: any,
  options = ['email', 'username']
) => {
  if (!data) return null
  if (Array.isArray(data)) {
    return data.map((item) => {
      const newItem: { [key: string]: any } = {} // Add type annotation
      options.forEach((key) => {
        newItem[key] = item[key]
      })
      return newItem
    })
  }
  const newItem: { [key: string]: any } = {} // Add type annotation
  options.forEach((key) => {
    newItem[key] = data[key]
  })
  return newItem
}

export function findIpAddress(req: Request) {
  try {
    if (req.headers['x-forwarded-for']) {
      return req.headers['x-forwarded-for'].toString().split(',')[0]
    } else if (req.connection && req.connection.remoteAddress) {
      return req.connection.remoteAddress
    }
    return req.ip
  } catch (e) {
    _logger.error(e)
    return undefined
  }
}
