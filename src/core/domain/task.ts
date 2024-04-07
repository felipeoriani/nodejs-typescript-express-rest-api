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

export interface TaskRepository {
  get(id: string): Promise<Task | null>
  getAll(): Promise<Task[]>
  create(task: Omit<Task, 'id'>): Promise<Task>
  update(id: string, task: Task): Promise<Task | null>
  delete(id: string): Promise<boolean>
}

export interface TaskUseCases {
  getTask(id: string): Promise<Task>
  getAllTasks(): Promise<Task[]>
  addNewTask(command: TaskCommand): Promise<Task>
  updateExistingTask(id: string, command: TaskCommand): Promise<Task>
  updateStatus(id: string, status: TaskStatus): Promise<Task>
  deleteTask(id: string): Promise<boolean>
}

export const taskCommandValidator = joi.object<TaskCommand>().keys({
  title: joi.string().required().min(3).max(100),
  description: joi.string().required().min(3).max(1000),
})

export const updateStatusValidator = joi.object<TaskUpdateStatusCommand>().keys({
  status: joi.string().valid(...Object.values(TaskStatus)),
})
