import { PrismaClient } from '@prisma/client'
import { config } from '../../../utils/config.js'

const prisma = new PrismaClient({
  log: config.isDevelopment ? ['query', 'info', 'warn', 'error'] : [],
})

export const getDbClient = (): PrismaClient => {
  return prisma
}
