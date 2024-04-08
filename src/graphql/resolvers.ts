import { getDbClient } from '../core/infrastructure/db/prisma.js'
import { UnauthorizedError } from '../utils/errors.js'
import { getSession } from '../utils/session.js'

export const resolvers = {
  Query: {
    tasks: () => {
      const session = getSession()!

      if (!session) {
        throw new UnauthorizedError('Authentication required')
      }

      if (session.user.super) {
        return getDbClient().task.findMany()
      }

      return getDbClient().task.findMany({
        where: {
          userId: session.user.id,
        },
      })
    },
  },
}
