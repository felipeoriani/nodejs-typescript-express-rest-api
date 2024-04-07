import { NotFoundError } from '../../utils/errors'
import { AuthenticateUserInput, User, UserRepository, UserUseCases } from '../domain/user'
import { UserPrismaRepository } from '../infrastructure/user-repository'

export class UserService implements UserUseCases {
  constructor(private readonly userRepository: UserRepository = new UserPrismaRepository()) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.get(id)

    if (!user) {
      throw new NotFoundError('There is no available user')
    }

    return user
  }

  async authenticateUser(input: AuthenticateUserInput): Promise<User> {
    const user = await this.userRepository.findUserByUsername(input.username)
    if (!user) {
      throw new NotFoundError('User not available for authentication.')
    }

    if (user.password !== input.password) {
      throw new NotFoundError('User credentials does not match or it is not available for authentication')
    }

    return user
  }
}
