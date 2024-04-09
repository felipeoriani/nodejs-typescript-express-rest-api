import { gql } from 'apollo-server-express'

export const typeDefs = gql`
  scalar DateTime

  type Task {
    id: ID!
    title: String!
    description: String!
    status: TaskStatus!
    createdAt: DateTime!
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
    task(id: ID!): Task
    tasksByStatus(status: TaskStatus!): [Task]!
  }
`
