import { pinoHttp } from 'pino-http'

export const loggerMiddleware = () => {
  return pinoHttp()
}
