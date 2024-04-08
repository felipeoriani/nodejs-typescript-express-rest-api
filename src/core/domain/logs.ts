export type Metadata = object | Error | unknown

export interface AppLogger {
  debug(message: string, metadata?: object): void
  info(message: string, metadata?: object): void
  warn(message: string, metadata?: Metadata): void
  error(message: string, metadata?: Metadata): void
  fatal(message: string, metadata?: Metadata): void
}
