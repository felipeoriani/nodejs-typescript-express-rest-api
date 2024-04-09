import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { UserSession } from '../core/domain/user.js'
import { config } from '../utils/config.js'
import { AppError, UnauthorizedError } from '../utils/errors.js'
import { setSession } from '../utils/session.js'

async function validate(token: string): Promise<UserSession | jwt.VerifyErrors | null> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.tokenSecret as jwt.Secret, (error, decoded) => {
      if (error) {
        reject(error)
        return
      }
      resolve(decoded as UserSession | jwt.VerifyErrors | null)
    })
  })
}

export const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization

    if (!authorizationHeader) {
      throw new UnauthorizedError('An authentication header is required and was not found.')
    }

    const tokenParts = authorizationHeader.split(' ')
    if (tokenParts.length !== 2) {
      throw new UnauthorizedError('An authentication request header must provide a scheme and a token.')
    }

    const scheme = tokenParts[0]
    const token = tokenParts[1]

    if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedError('An authentication requires a bearer token.')
    }

    const session = (await validate(token)) as UserSession

    setSession(session, () => {
      next()
      return Promise.resolve()
    })
  } catch (err) {
    const error = err as unknown as Error

    if (error instanceof AppError) {
      next(error)
    } else {
      next(new UnauthorizedError(`An error occurred while trying to authenticate the user: ${error.message}.`))
    }
  }
}
