import { NextFunction, Request, Response, Router } from 'express'
import { TaskService } from '../core/use-cases/task-use-cases'
import {
  TaskCommand,
  TaskUpdateStatusCommand,
  TaskUseCases,
  taskCommandValidator,
  updateStatusValidator,
} from '../core/domain/task'
import { validatorMiddleware } from '../middlewares/express-validator'

const routes = Router()

routes.get('/api/v1/tasks/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskService: TaskUseCases = new TaskService()
    const task = await taskService.getTask(req.params.id)
    res.status(200).send(task)
  } catch (err) {
    next(err)
  }
})

routes.get('/api/v1/tasks', async (req: Request, res: Response) => {
  const taskService: TaskUseCases = new TaskService()
  const tasks = await taskService.getAllTasks()

  res.status(200).send(tasks)
})

routes.post(
  '/api/v1/tasks',
  validatorMiddleware(taskCommandValidator),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskService: TaskUseCases = new TaskService()
      const input = req.body as TaskCommand
      const task = await taskService.addNewTask(input)
      res.status(201).send(task)
    } catch (err) {
      next(err)
    }
  }
)

routes.patch(
  '/api/v1/tasks/:id/update-status',
  validatorMiddleware(updateStatusValidator),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskService: TaskUseCases = new TaskService()

      const id = req.params.id
      const model = req.body as TaskUpdateStatusCommand

      const task = await taskService.updateStatus(id, model.status)
      res.status(200).send(task)
    } catch (err) {
      next(err)
    }
  }
)

routes.patch('/api/v1/tasks/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskService: TaskUseCases = new TaskService()
    const input = req.body as TaskCommand
    const id = req.params.id
    const task = await taskService.updateExistingTask(id, input)
    res.status(200).send(task)
  } catch (err) {
    next(err)
  }
})

routes.delete('/api/v1/tasks/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const taskService: TaskUseCases = new TaskService()
    const id = req.params.id
    await taskService.deleteTask(id)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

export default routes
