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

export interface UserUseCases {
  authenticateUser(input: AuthenticateUserInput): Promise<User>
  getUserById(id: string): Promise<User | null>
}

export interface CurrentUser {
  readonly user: UserData
  get(): UserSession
}
