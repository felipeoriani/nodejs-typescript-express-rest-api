export type User = {
  id: string
  name: string
  username: string
  password: string
  email: string
  createdAt: Date
  super: boolean
}

export interface UserRepository {
  get(id: string): Promise<User | null>
  findUserByUsername(username: string): Promise<User | null>
}

export type AuthenticateUserInput = {
  username: string
  password: string
}

export type UserData = {
  id: string
  name: string
  username: string
  super: boolean
}

export type UserSession = {
  user: UserData
  userAgent?: string
  ipAddress?: string
}

/**
 * The `UserUseCases` represents the user-cases for `User` entity.
 * It holds all the operations around the users including the get user details and part of the authentication process.
 */
export interface UserUseCases {
  /**
   * Get a User by a given id.
   * @param id User id.
   * @returns Async result containing a User instance. This operation can also throw an error when the user does not exists.
   */
  getUserById(id: string): Promise<User | null>

  /**
   * Validate a user input model for authentication process.
   * @param input User authentication model.
   * @returns Async result containing the user when the operation succeed. This operation can also throw an error when the user does not exists or the credentials does not matches.
   */
  authenticateUser(input: AuthenticateUserInput): Promise<User>
}

export interface CurrentUser {
  readonly user: UserData
  get(): UserSession
}
