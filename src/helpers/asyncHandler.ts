import { Response, NextFunction } from 'express'
import { IRequest } from '../types'

const asyncHandler =
  (
    callback: (req: IRequest, res: Response, next: NextFunction) => Promise<any>
  ) =>
  (req: IRequest, res: Response, next: NextFunction) => {
    try {
      callback(req, res, next).catch(next)
    } catch (error) {
      next(error)
    }
  }

export default asyncHandler
