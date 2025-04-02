import { Request, Response, NextFunction } from 'express'
import HttpException from '../exceptions/httpExceptions'
import LoggerService from '../core/services/LoggerService'
const errorHandler = (
  error: HttpException | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  LoggerService.error({
    where: 'errorHandler',
    message: error.message
  })
  const errorType = (error as HttpException)?.type
  // @ts-ignore
  if (errorType && HttpException.ERROR_TYPES[errorType]) {
    // @ts-ignore
    res.status(error.statusCode).json({
      isSuccess: false,
      errorCode: errorType,
      message: error.message,
      data: null
    })
  } else {
    res.status(500).json({
      isSuccess: false,
      errorCode: 'InternalServerError',
      message: 'Internal server error',
      data: null
    })
  }

  return next(error)
}

export default errorHandler
