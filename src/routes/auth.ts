import { AuthenticateUserInput, UserSession, UserUseCases } from '../core/domain/user'
import { UserService } from '../core/use-cases/user-use-cases'
import { config } from '../utils/config'
import { NextFunction, Request, Response, Router } from 'express'
import jwt from 'jsonwebtoken'

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

export default routes
