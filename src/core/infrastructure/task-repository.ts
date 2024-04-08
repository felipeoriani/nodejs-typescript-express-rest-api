import { Task as TaskDb } from '@prisma/client'
import { Task, TaskStatus, TaskRepository } from '../domain/task.js'
import { getDbClient } from './db/prisma.js'
import { CurrentUser } from '../domain/user.js'
import { CurrentSession } from '../../utils/session.js'

export class TaskPrismaRepository implements TaskRepository {
  constructor(
    private readonly prismaClient = getDbClient(),
    private readonly session: CurrentUser = new CurrentSession()
  ) {}

  async get(id: string): Promise<Task | null> {
    const where: { id: string; userId?: string } = { id }

    if (!this.session.user.super) {
      where.userId = this.session.user.id
    }

    const task = await this.prismaClient.task.findFirst({
      where,
    })

    if (!task) {
      return null
    }

    return this.MapToDomainModel(task)
  }

  async getAll(): Promise<Task[]> {
    const where: { userId?: string } = {}

    if (!this.session.user.super) {
      where.userId = this.session.user.id
    }

    const tasks = await this.prismaClient.task.findMany({
      where,
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
        userId: this.session.user.id,
      },
    })

    return this.MapToDomainModel(taskDb)
  }

  async update(id: string, task: Task): Promise<Task | null> {
    const taskDb = await this.prismaClient.task.update({
      where: {
        id,
        userId: this.session.user.id,
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
        userId: this.session.user.id,
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
