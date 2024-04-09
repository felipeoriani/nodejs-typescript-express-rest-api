import { Router } from 'express'
import tasks from './tasks.js'
import auth from './auth.js'
import { config } from '../utils/config.js'

const routes = Router()

routes.get('/', (_, res) => {
  return res.status(200).send()
})

routes.get('/health', (_, res) => {
  return res.status(200).send({
    success: true,
    hostname: config.host,
    environment: config.nodeEnv,
  })
})

routes.use(auth)
routes.use(tasks)

export default routes
