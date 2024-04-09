import { TaskStatus } from '../core/domain/task.js'
import { TaskService } from '../core/use-cases/task-use-cases.js'

const taskServiceFactory = () => new TaskService()

export const resolvers = {
  Query: {
    /**
     * Return a list of tasks that the user can see.
     * @returns List of Tasks
     */
    tasks: () => taskServiceFactory().getAllTasks(),

    /**
     * Get a Task by Id, since it belongs to the user or it is a super user.
     * @returns A single task instance by the given Id.
     */
    task: async (_parent: unknown, { id }: { id: string }) => await taskServiceFactory().getTask(id),

    /**
     * List of tasks by the status given the user permission.
     * @returns
     */
    tasksByStatus: async (_parent: unknown, { status }: { status: TaskStatus }) =>
      await taskServiceFactory().getTasksByStatus(status),
  },
}
