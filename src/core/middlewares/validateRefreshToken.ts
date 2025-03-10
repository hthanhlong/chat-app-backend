import { refreshTokenSchema } from './../../validation/schema'
import { NextFunction, Response } from 'express'
import HttpException from '../../utils/httpExceptions'
import JWTService from '../services/JWTService'
import { IRequest } from '../../types'

const validateRefreshToken = async (
  req: IRequest,
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
