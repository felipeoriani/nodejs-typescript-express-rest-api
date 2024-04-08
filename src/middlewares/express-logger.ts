import { pinoHttp } from 'pino-http'
import { logger } from '../utils/logger.js'

export const loggerMiddleware = () => {
  return pinoHttp(logger)
}
