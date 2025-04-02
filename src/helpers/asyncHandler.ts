import { Response, Request, NextFunction } from 'express'

const asyncHandler =
  (
    callback: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await callback(req, res, next)
    } catch (error) {
      next(error)
    }
  }

export default asyncHandler
