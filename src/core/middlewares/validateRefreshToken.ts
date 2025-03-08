import { NextFunction, Response } from 'express'
import envConfig from '../../config'
import { RefreshTokenExpired } from '../../utils/httpExceptions'
import { BadTokenError } from '../../utils/httpExceptions'
import JWTService from '../services/JWTService'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { IRequest } from '../../types'

const validateRefreshToken = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  {
    try {
      const k = envConfig.JWT_SECRET_REFRESH
      if (!k) return console.log('k is not defined')
      const token = req.body.refreshToken
      if (!token) throw new BadTokenError()
      const decoded = JWTService.verifyRefreshToken(token)
      req.decoded = decoded
      next()
    } catch (error: Error | any) {
      if (error instanceof JsonWebTokenError) {
        throw new BadTokenError()
      } else if (error instanceof TokenExpiredError) {
        throw new RefreshTokenExpired()
      }
    }
  }
}

export default validateRefreshToken
