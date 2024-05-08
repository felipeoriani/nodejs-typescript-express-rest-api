import { ForbiddenError, NotFoundError, UnprocessableEntityError } from '../../utils/errors.js'
import { CurrentSession } from '../../utils/session.js'
import { Task, TaskCommand, TaskRepository, TaskStatus, TaskUseCases } from '../domain/task.js'
import { CurrentUser } from '../domain/user.js'
import { TaskPrismaRepository } from '../infrastructure/task-repository.js'

/**
 * The `TaskService` is a service that is responsable to manage all the `Task` entities on the platform.
 * This service depends on an abstract `repository` and a user `session` representation.
 * Each Task has a owner defined by the `userId` property which limits the access to all the users.
 * A Task can be handled only by the user owner or admin user.
 */
export class TaskService implements TaskUseCases {
  /**
   * Instance a new TaskService to handle Tasks.
   * @param taskRepository task repository implementation for persistence.
   * @param session representation of the user session using this service.
   */
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

  /**
   * Get a Task by a given id based on the current user permissions.
   * @param id Task id.
   * @returns Existing task or an error when it does not exists or user is not authorized.
   */
  public async getTask(id: string): Promise<Task> {
    const task = await this.taskRepository.get(id)

    if (!task) {
      throw new NotFoundError(`There is no Task available for id ${id}.`)
    }

    if (this.userId && task.userId !== this.userId) {
      throw new ForbiddenError('You do not have permission to see this task.')
    }

    return task
  }

  /**
   * Get a list of all tasks based on the current user.
   * @returns Async result containing a list of tasks allowed by the current user.
   */
  public async getAllTasks(): Promise<Task[]> {
    return await this.taskRepository.getAll(this.userId)
  }

  /**
   * Get a collection of tasks based on the status.
   * @param status Status of the Tasks defined by `TaskStatus` enum.
   * @returns Async result containing a collection of tasks.
   */
  public async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    return await this.taskRepository.getByStatus(status, this.userId)
  }

  /**
   * Add a new tasks for the current user.
   * @param command Valida command representing a Task.
   * @returns Async result containing a new Task.
   */
  public async addNewTask(command: TaskCommand): Promise<Task> {
    const task: Omit<Task, 'id'> = {
      createdAt: new Date(),
      status: TaskStatus.Todo,
      userId: this.session.user.id,
      ...command,
    }

    const newTask = await this.taskRepository.create(task)

    return newTask
  }

  /**
   * Update an existing Task by a given id based on the current user permissions.
   * @param id Id of the task to be updated.
   * @param command Valid command representing a Task.
   * @returns Async result containing the updated Task. This operation can also throw an error based on the current user permissions.
   */
  public async updateExistingTask(id: string, command: TaskCommand): Promise<Task> {
    const currentTask = await this.taskRepository.get(id)

    // When the given Task does not exists.
    if (!currentTask) {
      throw new NotFoundError(`There is no Task available for id ${id}.`)
    }

    // When a current user is not the owner of the task.
    if (this.userId && currentTask.userId !== this.userId) {
      throw new ForbiddenError('You do not have permission to change this task.')
    }

    // When current Task is already Archived, it should not be updated.
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

  /**
   * Update the status of a task. Useful when a user just want to move the Task to a different state. Only owners and admin can change it.
   * @param id Id of the task.
   * @param status New state of the task.
   * @returns Async result containing the updated task. This operation can also throw an error depending on the user permissions.
   */
  public async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const currentTask = await this.taskRepository.get(id)

    // When the given Task does not exists.
    if (!currentTask) {
      throw new NotFoundError(`There is no Task available for id ${id}.`)
    }

    // Only the user owner or admin user can run this change.
    if (this.userId && (currentTask.userId !== this.userId || !this.session.user.super)) {
      throw new ForbiddenError('You do not have permission to change this task.')
    }

    // When current Task is already Archived, it should not be updated.
    if (currentTask.status === TaskStatus.Archived) {
      throw new UnprocessableEntityError(`It is not possible to move the Task from 'Archived' status.`)
    }

    // Update the status of the task.
    currentTask.status = status
    const updatedTask = await this.taskRepository.update(id, currentTask)

    if (!updatedTask) {
      throw new UnprocessableEntityError(`An error ocurred while trying to update the Task with id ${currentTask.id}.`)
    }

    return updatedTask
  }

  /**
   * Delete an existing Task by the id.
   * @param id Task Id.
   * @returns Async result containing if the delete operation succeed. This operation can also throw an error depending on the user permissions.
   */
  public async deleteTask(id: string): Promise<boolean> {
    const currentTask = await this.taskRepository.get(id)
    if (!currentTask) {
      throw new NotFoundError(`There is no Task available for id ${id}.`)
    }

    // Only the user owner or admin user can delete a Task.
    if (this.userId && (currentTask.userId !== this.userId || !this.session.user.super)) {
      throw new ForbiddenError('You do not have permission to change this task.')
    }

    return await this.taskRepository.delete(id)
  }
}
