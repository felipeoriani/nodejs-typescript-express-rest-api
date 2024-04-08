import express from 'express'
import { errorMiddleware, loggerMiddleware } from './middlewares/index.js'
import routes from './routes/index.js'
import { config } from './utils/config.js'
import { graphqlMiddleware } from './middlewares/graphql.js'

const port = config.port
const app = express()

await graphqlMiddleware(app)

app.use(loggerMiddleware())
app.use(express.json())
app.use(routes)
app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`The Task Service has started running at ${config.host}:${port} in ${config.nodeEnv} mode.`)
})
