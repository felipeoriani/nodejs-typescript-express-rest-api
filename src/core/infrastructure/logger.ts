import { Logger } from 'pino'
import { AppLogger } from '../domain/logs'
import pino from 'pino-http'

export const logger = pino().logger

export class PinoLogger implements AppLogger {
  constructor(private readonly log: Logger = logger) {}

  info(message: string, metadata?: object): void {
    this.log.info(metadata, message)
  }

  error(message: string, metadata?: object | Error | unknown): void {
    this.log.error(metadata, message)
  }

  warn(message: string, metadata?: object | Error | unknown): void {
    this.log.warn(metadata, message)
  }
}
