import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import { BadRequestError } from '../utils/httpExceptions'

export enum ValidationSource {
  BODY = 'body',
  HEADER = 'headers',
  QUERY = 'query',
  PARAM = 'params'
}

const validator =
  (schema: Joi.AnySchema, source: ValidationSource = ValidationSource.BODY) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req[source])
      if (!error) return next()
      const { details } = error
      const message = details
        .map((i) => i.message.replace(/['"]+/g, ''))
        .join(',')
      next(new BadRequestError(message))
    } catch (error) {
      next(error)
    }
  }

export default validator
