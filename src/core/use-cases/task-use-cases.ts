import { ForbiddenError, NotFoundError, UnprocessableEntityError } from '../../utils/errors.js'
import { CurrentSession } from '../../utils/session.js'
import { Task, TaskCommand, TaskRepository, TaskStatus, TaskUseCases } from '../domain/task.js'
import { CurrentUser } from '../domain/user.js'
import { TaskPrismaRepository } from '../infrastructure/task-repository.js'

export class TaskService implements TaskUseCases {
  constructor(
    private readonly taskRepository: TaskRepository = new TaskPrismaRepository(),
    private readonly session: CurrentUser = new CurrentSession()
  ) {}

  /**
   * User Id used on the repository.
   * In case the user in the session is a super user, return undefined to ignore the filter by id.
   */
  private get userId(): string | undefined {
    return this.session.user.super ? undefined : this.session.user.id
  }

  async getTask(id: string): Promise<Task> {
    const task = await this.taskRepository.get(id)

    if (!task) {
      throw new NotFoundError(`There is no Task available for id ${id}.`)
    }

    if (this.userId && task.userId !== this.userId) {
      throw new ForbiddenError('You do not have permission to see this task.')
    }

    return task
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepository.getAll(this.userId)
  }

  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    return await this.taskRepository.getByStatus(status, this.userId)
  }

  async addNewTask(command: TaskCommand): Promise<Task> {
    const task: Omit<Task, 'id'> = {
      createdAt: new Date(),
      status: TaskStatus.Todo,
      userId: this.session.user.id,
      ...command,
    }

    const newTask = await this.taskRepository.create(task)

    return newTask
  }

  async updateExistingTask(id: string, command: TaskCommand): Promise<Task> {
    const currentTask = await this.taskRepository.get(id)
    if (!currentTask) {
      throw new NotFoundError(`There is no Task available for id ${id}.`)
    }

    if (this.userId && currentTask.userId !== this.userId) {
      throw new ForbiddenError('You do not have permission to change this task.')
    }

    if (currentTask.status === TaskStatus.Archived) {
      throw new UnprocessableEntityError("It is not possible to change the information on a Task on 'Archived' status.")
    }

    currentTask.title = command.title
    currentTask.description = command.description
    const updatedTask = await this.taskRepository.update(id, currentTask)

    if (!updatedTask) {
      throw new UnprocessableEntityError(`An error ocurred while trying to update the Task with id ${id}.`)
    }

    return updatedTask
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const currentTask = await this.taskRepository.get(id)
    if (!currentTask) {
      throw new NotFoundError(`There is no Task available for id ${id}.`)
    }

    if (this.userId && currentTask.userId !== this.userId) {
      throw new ForbiddenError('You do not have permission to change this task.')
    }

    if (currentTask.status === TaskStatus.Archived) {
      throw new UnprocessableEntityError(`It is not possible to move the Task from 'Archived' status.`)
    }

    currentTask.status = status
    const updatedTask = await this.taskRepository.update(id, currentTask)

    if (!updatedTask) {
      throw new UnprocessableEntityError(`An error ocurred while trying to update the Task with id ${currentTask.id}.`)
    }

    return updatedTask
  }

  async deleteTask(id: string): Promise<boolean> {
    const currentTask = await this.taskRepository.get(id)
    if (!currentTask) {
      throw new NotFoundError(`There is no Task available for id ${id}.`)
    }
    return await this.taskRepository.delete(id)
  }
}
