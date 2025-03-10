import JWTService from '../services/JWTService'
import { NextFunction, Response } from 'express'
import { IRequest, JWT_PAYLOAD } from '../../types'
import HttpException from '../../utils/httpExceptions'

const validateAccessToken = async (
  req: IRequest,
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
