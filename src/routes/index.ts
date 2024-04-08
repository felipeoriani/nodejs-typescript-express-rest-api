import { Router } from 'express'
import tasks from './tasks.js'
import auth from './auth.js'

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
