import { AnySchema } from 'joi'
import { Response, NextFunction } from 'express'
import HttpException from '../utils/httpExceptions'
import logger from '../utils/logger'
import { IRequest } from '../types'

const _logger = logger('validatorInput')

const validatorInput =
  (schema: AnySchema) =>
  async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body)
      _logger(req).info('Validation passed')
      next()
    } catch (error: any) {
      _logger(req).error(error)
      next(HttpException.validationError(error.message as string))
    }
  }

export default validatorInput
