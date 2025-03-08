import JWTService from '../services/JWTService'
import { NextFunction, Response } from 'express'
import { IRequest, JWT_PAYLOAD } from '../../types'

const validateAccessToken = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return null
    const decoded = JWTService.verifyAccessToken(token)
    req.decoded = decoded as JWT_PAYLOAD
    next()
  } catch (error: unknown) {
    next(error)
  }
}

export default validateAccessToken
