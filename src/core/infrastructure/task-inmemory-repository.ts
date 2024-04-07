import { Task, TaskRepository } from '../domain/task'

export class TaskInMemoryRepository implements TaskRepository {
  static tasks: Task[] = []

  get tasks(): Task[] {
    return TaskInMemoryRepository.tasks
  }

  async get(id: string): Promise<Task | null> {
    const task = this.tasks.filter((x) => x.id === id)
    if (task) {
      return task[0]
    }
    return null
  }

  async getAll(): Promise<Task[]> {
    return this.tasks
  }

  async create(task: Task): Promise<Task> {
    this.tasks.push(task)
    return task
  }

  async update(id: string, task: Task): Promise<Task | null> {
    const deleteResult = await this.delete(id)

    if (deleteResult) {
      task.id = id
      this.tasks.push(task)

      return task
    }

    return null
  }

  async delete(id: string): Promise<boolean> {
    const existingTask = await this.get(id)
    if (existingTask) {
      const index = this.tasks.findIndex((task) => task.id === id)
      if (index !== -1) {
        this.tasks.splice(index, 1)
      }

      return true
    }

    return false
  }
}
