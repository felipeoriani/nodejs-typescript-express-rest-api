import { PrismaClient } from '@prisma/client'
import { config } from '../../../utils/config'

const prisma = new PrismaClient({
  log: config.isDevelopment ? ['query', 'info', 'warn', 'error'] : [],
})

export const getDbClient = (): PrismaClient => {
  return prisma
}
