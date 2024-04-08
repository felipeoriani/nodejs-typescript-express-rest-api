import { AuthenticateUserInput, UserSession, UserUseCases } from '../core/domain/user.js'
import { UserService } from '../core/use-cases/user-use-cases.js'
import { config } from '../utils/config.js'
import { NextFunction, Request, Response, Router } from 'express'
import jwt from 'jsonwebtoken'
import { getSession } from '../utils/session.js'
import { UnauthorizedError } from '../utils/errors.js'
import { authenticationMiddleware } from '../middlewares/authentication.js'

const routes = Router()

routes.post('/api/v1/auth', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const model = req.body as AuthenticateUserInput

    const userService: UserUseCases = new UserService()
    const user = await userService.authenticateUser(model)

    const userAgent = req.headers['user-agent']
    const ipAddress = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string

    const payload: UserSession = {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        super: user.super,
      },
      ipAddress,
      userAgent,
    }

    const token = jwt.sign(payload, config.tokenSecret as jwt.Secret, {
      expiresIn: config.tokenExpiration,
    })

    res.status(200).send({ type: 'bearer', token })
  } catch (err) {
    next(err)
  }
})

routes.get('/api/v1/user', authenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = getSession()

    if (!session) {
      throw new UnauthorizedError('Authentication required.')
    }

    const model = { id: session.user.id, name: session.user.name }

    res.status(200).send(model)
  } catch (err) {
    next(err)
  }
})

export default routes
