import { AsyncLocalStorage } from 'async_hooks'
import { CurrentUser, UserData, UserSession } from '../core/domain/user'

const asyncLocalStorage = new AsyncLocalStorage<UserSession>()

export const setSession = async <T>(session: UserSession, callback: () => Promise<T>): Promise<T> => {
  return await asyncLocalStorage.run(session, async () => {
    return await callback()
  })
}

export const getSession = (): UserSession | undefined => {
  return asyncLocalStorage.getStore()
}

export class CurrentSession implements CurrentUser {
  constructor(private readonly session: UserSession = getSession()!) {}

  get user(): UserData {
    return this.session.user
  }

  get(): UserSession {
    return this.session
  }
}
