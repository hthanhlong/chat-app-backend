import { AnySchema } from 'joi'
import { Response, Request, NextFunction } from 'express'
import HttpException from '../exceptions/httpExceptions'

const validatorInput =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body)
      next()
    } catch (error: any) {
      next(HttpException.validationError(error.name as string))
    }
  }

export default validatorInput
