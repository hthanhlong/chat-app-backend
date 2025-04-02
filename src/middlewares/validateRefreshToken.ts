import { NextFunction, Response, Request } from 'express'
import HttpException from '../exceptions/httpExceptions'
import JWTService from '../core/services/JWTService'

const validateRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.body.refreshToken
  if (!token) throw HttpException.badTokenError()
  const refreshToken = JWTService.verifyRefreshToken(token)
  req.refreshToken = refreshToken
  next()
}

export default validateRefreshToken
