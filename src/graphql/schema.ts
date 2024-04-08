import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  type Task {
    id: String!
    title: String!
    description: String!
    status: TaskStatus!
    createdAt: String
    userId: String!
  }

  enum TaskStatus {
    todo
    inProgress
    done
    archived
  }

  type Query {
    tasks: [Task]!
  }
`
