import { Task as TaskDb } from '@prisma/client'
import { Task, TaskStatus, TaskRepository } from '../domain/task.js'
import { getDbClient } from './db/prisma.js'

export class TaskPrismaRepository implements TaskRepository {
  constructor(private readonly prismaClient = getDbClient()) {}

  async get(id: string): Promise<Task | null> {
    const task = await this.prismaClient.task.findFirst({
      where: {
        id,
      },
    })

    if (!task) {
      return null
    }

    return this.MapToDomainModel(task)
  }

  async getAll(userId?: string): Promise<Task[]> {
    const tasks = await this.prismaClient.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return tasks.map(this.MapToDomainModel)
  }

  async getByStatus(status: TaskStatus, userId?: string | undefined): Promise<Task[]> {
    const tasks = await this.prismaClient.task.findMany({
      where: { status, userId },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return tasks.map(this.MapToDomainModel)
  }

  async create(task: Omit<Task, 'id'>): Promise<Task> {
    const taskDb = await this.prismaClient.task.create({
      data: {
        title: task.title,
        description: task.description,
        status: task.status,
        userId: task.userId,
      },
    })

    return this.MapToDomainModel(taskDb)
  }

  async update(id: string, task: Task): Promise<Task | null> {
    const taskDb = await this.prismaClient.task.update({
      where: {
        id,
        userId: task.userId,
      },
      data: {
        title: task.title,
        description: task.description,
        status: task.status,
      },
    })

    return this.MapToDomainModel(taskDb)
  }

  async delete(id: string): Promise<boolean> {
    await this.prismaClient.task.delete({
      where: {
        id,
      },
    })
    return true
  }

  private MapToDomainModel(task: TaskDb): Task {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      createdAt: task.createdAt,
      userId: task.userId,
      status: <TaskStatus>task.status,
    }
  }
}
