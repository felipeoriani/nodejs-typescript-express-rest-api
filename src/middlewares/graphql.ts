import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'
import { resolvers } from '../graphql/resolvers.js'
import { typeDefs } from '../graphql/schema.js'
import { authenticationMiddleware } from './authentication.js'

export const graphqlMiddleware = async (app: Express) => {
  const path = '/v1/graphql'
  const apolloServer = new ApolloServer({ resolvers, typeDefs })

  await apolloServer.start()

  // set authentication on the graphql endpoint
  app.use(path, authenticationMiddleware)

  // apply the apollo middleware to handle the requests
  apolloServer.applyMiddleware({ path, app })
}
