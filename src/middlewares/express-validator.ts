import joi from 'joi'
import { NextFunction, Request, Response } from 'express'
import { BadRequestError } from '../utils/errors'

export const validatorMiddleware = <T>(validator: joi.Schema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = validator.validate(req.body)
    if (result.error) {
      const errors = result.error.details.map((x) => x.message)
      const badRequest = new BadRequestError(errors[0])
      next(badRequest)
      return
    }
    next()
  }
}
