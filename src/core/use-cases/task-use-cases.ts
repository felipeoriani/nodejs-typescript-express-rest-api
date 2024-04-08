import { TaskCommand, Task, TaskRepository, TaskStatus, TaskUseCases } from '../domain/task.js'
import { TaskPrismaRepository } from '../infrastructure/task-repository.js'
import { NotFoundError, UnprocessableEntityError } from '../../utils/errors.js'

export class TaskService implements TaskUseCases {
  constructor(private readonly taskRepository: TaskRepository = new TaskPrismaRepository()) {}

  async getTask(id: string): Promise<Task> {
    const task = await this.taskRepository.get(id)
    if (!task) {
      throw new NotFoundError(`There is no Task available for id ${id}.`)
    }
    return task
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepository.getAll()
  }

  async addNewTask(command: TaskCommand): Promise<Task> {
    const task: Omit<Task, 'id'> = {
      createdAt: new Date(),
      status: TaskStatus.Todo,
      userId: '1',
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

    if (currentTask.status === TaskStatus.Archived) {
      throw new UnprocessableEntityError(`It is not possible to change the information on a Task on 'Archived' status.`)
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
