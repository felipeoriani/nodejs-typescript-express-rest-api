import { NotFoundError } from '../../utils/errors.js'
import { AuthenticateUserInput, User, UserRepository, UserUseCases } from '../domain/user.js'
import { UserPrismaRepository } from '../infrastructure/user-repository.js'

/**
 * The `UserSevice` represents the use case implementations for the `User` entity.
 * It holds all the operations around the users including the get user details and part of the authentication process.
 * This service depends on a user repository to handle users.
 */
export class UserService implements UserUseCases {
  /**
   * Instance a new `UserService` used to handle users.
   * @param userRepository Abstract user repository implementation to handle user data.
   */
  constructor(private readonly userRepository: UserRepository = new UserPrismaRepository()) {}

  /**
   * Get a User by a given id.
   * @param id User id.
   * @returns Async result containing a User instance. This operation can also throw an error when the user does not exists.
   */
  public async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.get(id)

    if (!user) {
      throw new NotFoundError('There is no available user')
    }

    return user
  }

  /**
   * Validate a user input model for authentication process.
   * @param input User authentication model.
   * @returns Async result containing the user when the operation succeed. This operation can also throw an error when the user does not exists or the credentials does not matches.
   */
  public async authenticateUser(input: AuthenticateUserInput): Promise<User> {
    const user = await this.userRepository.findUserByUsername(input.username)

    // When the user does not exists.
    if (!user) {
      throw new NotFoundError('User credentials does not match or it is not available for authentication')
    }

    const password = await this.encryptPassword(input.password)

    // When the user exists but the password does not match.
    if (user.password !== password) {
      throw new NotFoundError('User credentials does not match or it is not available for authentication')
    }

    return user
  }

  /**
   * Encrypt a hash string to be used as a password
   * @param password String to be encrypted.
   * @returns An encrypt string using a hash strategy.
   */
  private async encryptPassword(password: string): Promise<string> {
    // TODO: implement crypto here for password ... in progress
    return password
  }
}
