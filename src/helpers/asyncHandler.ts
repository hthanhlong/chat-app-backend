import { Response, NextFunction } from 'express'
import { IRequest } from '../types'

const asyncHandler =
  (
    callback: (req: IRequest, res: Response, next: NextFunction) => Promise<any>
  ) =>
  async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      await callback(req, res, next)
    } catch (error) {
      next(error)
    }
  }

export default asyncHandler
