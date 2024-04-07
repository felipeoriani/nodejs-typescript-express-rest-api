import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/errors'
import { logger } from '../core/infrastructure/logger'

export const errorMiddleware = (error: Error, request: Request, response: Response, next: NextFunction) => {
  if (response.headersSent) {
    return next(error)
  }

  if (error instanceof AppError) {
    response.status(error.status).send({ error: error.message })
    return
  }

  logger.error(`An error ocurred while trying to execute ${request.method} - ${request.url}.`, error)
  response.status(500).send(error)
}
