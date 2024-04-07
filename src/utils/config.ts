import os from 'os'

const getEnvironmentVariable = <T>(name: string): T | undefined => {
  if (process.env[name]) {
    return process.env[name] as T
  }
  return
}

export enum NodeEnv {
  Development = 'development',
  Test = 'test',
  Production = 'production',
}

const nodeEnv = getEnvironmentVariable<NodeEnv>('NODE_ENV')

export const config = {
  nodeEnv,
  isDevelopment: nodeEnv === NodeEnv.Development,
  isProduction: nodeEnv === NodeEnv.Production,
  isTest: nodeEnv === NodeEnv.Test,
  host: os.hostname(),
  port: getEnvironmentVariable<number>('PORT') || 3000,
  salt: getEnvironmentVariable<string>('SALT'),
  tokenSecret: getEnvironmentVariable<string>('JWT'),
  tokenExpiration: '1d',
}
