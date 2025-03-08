import { Response, NextFunction } from 'express'
import { IRequest } from '../../types'

const errorHandler = (
  err: Error,
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack)
  res.status(500).json({
    message: err.message,
    stack: err.stack
  })
  return next(err)
}

export default errorHandler
