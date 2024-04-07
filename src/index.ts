import express from 'express'
import routes from './routes'
import { logger } from './core/infrastructure/logger'
import { loggerMiddleware, errorMiddleware } from './middlewares'
import { config } from './utils/config'

const port = config.port
const app = express()

app.use(loggerMiddleware())
app.use(express.json())
app.use(routes)
app.use(errorMiddleware)

app.listen(port, () => {
  logger.info(`The Task Service has started running at ${config.host}:${port} in ${config.nodeEnv} mode.`)
})
