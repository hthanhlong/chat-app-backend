import { Response, NextFunction } from 'express'
import { IRequest } from '../types'
import { v4 as uuidv4 } from 'uuid'

export const logTraceId = (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const traceId = uuidv4()
  req.traceId = traceId
  next()
}

export default logTraceId
