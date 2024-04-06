import { NotFoundError, UnprocessableEntityError } from '../../utils/errors'
import { TaskCommand, Task, TaskRepository, TaskStatus, TaskUseCases } from '../domain/task'
import { TaskInMemoryRepository } from '../infrastructure/task-repository'
import { randomUUID } from 'crypto'

export class TaskService implements TaskUseCases {
  constructor(private readonly taskRepository: TaskRepository = new TaskInMemoryRepository()) {}

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

  async addNewTask(model: TaskCommand): Promise<Task> {
    const task: Task = {
      id: randomUUID(),
      createdAt: new Date(),
      status: TaskStatus.Todo,
      userId: '1',
      ...model,
    }

    const newTask = await this.taskRepository.create(task)

    return newTask
  }

  async updateExistingTask(id: string, task: Task): Promise<Task> {
    const model = await this.taskRepository.update(id, task)

    if (!model) {
      throw new UnprocessableEntityError(`An error ocurred while trying to update the Task with id ${id}.`)
    }

    return model
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
