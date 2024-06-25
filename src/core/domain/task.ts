import joi from 'joi'

export type Task = {
  id: string
  title: string
  description: string
  createdAt: Date
  status: TaskStatus
  userId: string
}

export enum TaskStatus {
  Todo = 'todo',
  InProgress = 'inProgress',
  Done = 'done',
  Archived = 'archived',
}

export type TaskCommand = {
  title: string
  description: string
}

export type TaskUpdateStatusCommand = {
  status: TaskStatus
}

/**
 * The `TaskRepository` is an abstraction that represents a storage of tasks.
 * Its implementation is part of the infrastructure layer.
 */
export interface TaskRepository {
  get(id: string): Promise<Task | null>
  getAll(userId?: string): Promise<Task[]>
  getByStatus(status: TaskStatus, userId?: string): Promise<Task[]>
  create(task: Omit<Task, 'id'>): Promise<Task>
  update(id: string, task: Task): Promise<Task | null>
  delete(id: string): Promise<boolean>
}

/**
 * The `TaskUseCases` is a service that is responsable to manage all the `Task` entities on the platform.
 * Each Task has a owner defined by the `userId` property which limits the access to all the users.
 * A Task can be handled only by the user owner or a super user.
 */
export interface TaskUseCases {
  /**
   * Get a Task by a given id based on the current user permissions.
   * @param id Task id.
   * @returns Existing task or an error when it does not exists or user is not authorized.
   */
  getTask(id: string): Promise<Task>

  /**
   * Get a list of all tasks based on the current user.
   * @returns Async result containing a list of tasks allowed by the current user.
   */
  getAllTasks(): Promise<Task[]>

  /**
   * Get a collection of tasks based on the status.
   * @param status Status of the Tasks defined by `TaskStatus` enum.
   * @returns Async result containing a collection of tasks.
   */
  getTasksByStatus(status: TaskStatus): Promise<Task[]>

  /**
   * Add a new tasks for the current user.
   * @param command Valida command representing a Task.
   * @returns Async result containing a new Task.
   */
  addNewTask(command: TaskCommand): Promise<Task>

  /**
   * Update an existing Task by a given id based on the current user permissions.
   * @param id Id of the task to be updated.
   * @param command Valid command representing a Task.
   * @returns Async result containing the updated Task. This operation can also throw an error based on the current user permissions.
   */
  updateExistingTask(id: string, command: TaskCommand): Promise<Task>

  /**
   * Update the status of a task. Useful when a user just want to move the Task to a different state. Only owners and admin can change it.
   * @param id Id of the task.
   * @param status New state of the task.
   * @returns Async result containing the updated task. This operation can also throw an error depending on the user permissions.
   */
  updateStatus(id: string, status: TaskStatus): Promise<Task>

  /**
   * Delete an existing Task by the id.
   * @param id Task Id.
   * @returns Async result containing if the delete operation succeed. This operation can also throw an error depending on the user permissions.
   */
  deleteTask(id: string): Promise<boolean>
}

export const taskCommandValidator = joi.object<TaskCommand>().keys({
  title: joi.string().required().min(3).max(100),
  description: joi.string().required().min(3).max(1000),
})

export const updateStatusValidator = joi.object<TaskUpdateStatusCommand>().keys({
  status: joi.string().valid(...Object.values(TaskStatus)),
})
