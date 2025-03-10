import { NextFunction, Request, Response } from 'express'
import HttpException from '../../utils/httpExceptions'

const handleNotFoundRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(HttpException.notFoundError())
}

export default handleNotFoundRoute
