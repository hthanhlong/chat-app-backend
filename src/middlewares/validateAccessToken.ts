import JWTService from '../core/services/JWTService'
import { NextFunction, Response, Request } from 'express'
import HttpException from '../exceptions/httpExceptions'

const validateAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) throw HttpException.badTokenError()
  const decoded = JWTService.verifyAccessToken(token)
  req.decoded = decoded as JWT_PAYLOAD
  next()
}

export default validateAccessToken
