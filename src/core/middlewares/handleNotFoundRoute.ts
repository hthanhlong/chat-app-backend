import { NextFunction, Request, Response } from 'express'
import { NotFoundError } from '../../utils/httpExceptions'

const handleNotFoundRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new NotFoundError())
}

export default handleNotFoundRoute
