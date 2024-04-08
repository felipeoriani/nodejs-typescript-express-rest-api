import { Logger, pino } from 'pino'
import { AppLogger, Metadata } from '../core/domain/logs.js'

const pinoLogger = pino()

export class PinoLogger implements AppLogger {
  constructor(private readonly logger: Logger = pinoLogger) {}

  debug(message: string, metadata?: object) {
    this.logger.debug(metadata, message)
  }

  info(message: string, metadata?: object) {
    this.logger.info(metadata, message)
  }

  warn(message: string, metadata?: Metadata) {
    this.logger.warn(metadata, message)
  }

  error(message: string, metadata?: Metadata) {
    this.logger.error(metadata, message)
  }

  fatal(message: string, metadata?: Metadata) {
    this.logger.fatal(metadata, message)
  }
}

export const logger: AppLogger = new PinoLogger()
