import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/errors'
import { logger } from '../core/infrastructure/logger'

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof AppError) {
    res.status(err.status).send({ error: err.message })
  } else {
    logger.error(`An error ocurred while trying to execute ${req.method} - ${req.url}.`, err)
    res.status(500).send()
  }
}
