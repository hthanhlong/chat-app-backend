import { AnySchema } from 'joi'
import { Request, Response, NextFunction } from 'express'
import HttpException from '../../utils/httpExceptions'

const validatorInput =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body)
      next()
    } catch (error: any) {
      next(HttpException.validationError(error.message as string))
    }
  }

export default validatorInput
