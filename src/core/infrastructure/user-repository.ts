import { User, UserRepository } from '../domain/user'
import { User as UserDb } from '@prisma/client'
import { getDbClient } from './db/prisma'

export class UserPrismaRepository implements UserRepository {
  constructor(private readonly prismaClient = getDbClient()) {}

  async get(id: string): Promise<User | null> {
    return await this.prismaClient.user.findUnique({
      where: {
        id,
      },
    })
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const userDb = await this.prismaClient.user.findFirst({
      where: {
        username,
      },
    })

    if (!userDb) return null

    return this.Map(userDb)
  }

  private Map(user: UserDb): User {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      super: user.super,
      username: user.username,
      password: user.password,
      createdAt: user.createdAt,
    }
  }
}
