import { Router } from 'express'
import tasks from './tasks'
import auth from './auth'

const routes = Router()

routes.get('/', (_, res) => {
  return res.status(200).send()
})

routes.get('/health', (_, res) => {
  return res.status(200).send()
})

routes.use(auth)
routes.use(tasks)

export default routes
