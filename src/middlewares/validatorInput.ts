import { AnySchema } from 'joi'
import { Response, NextFunction } from 'express'
import HttpException from '../exceptions/httpExceptions'
import { IRequest } from '../types'

const validatorInput =
  (schema: AnySchema) =>
  async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body)
      next()
    } catch (error: any) {
      next(HttpException.validationError(error.name as string))
    }
  }

export default validatorInput
