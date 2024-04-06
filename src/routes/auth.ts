import { Request, Response, Router } from 'express'

const routes = Router()

routes.post('/api/v1/auth', async (req: Request, res: Response) => {
  res.status(201).send()
})

export default routes
