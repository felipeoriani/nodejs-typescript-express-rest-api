import { pinoHttp } from 'pino-http'
import { logger } from '../core/infrastructure/logger'

export const loggerMiddleware = () => {
  return pinoHttp(logger)
}
