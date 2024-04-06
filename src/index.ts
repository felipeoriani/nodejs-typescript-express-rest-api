import express from 'express'
import routes from './routes'
import { logger } from './core/infrastructure/logger'
import { createExpressLogger } from './middlewares/express-logger'
import { errorHandler } from './middlewares/express-error-handler'

const app = express()
const port = process.env.PORT || 3000

app.use(createExpressLogger())
app.use(express.json())
app.use(routes)
app.use(errorHandler)

app.listen(port, () => logger.info(`Task Service running at ${port}.`))
