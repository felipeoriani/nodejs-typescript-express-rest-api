/* eslint-disable @typescript-eslint/no-unused-vars */
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { randomUUID } from 'node:crypto'
import { Task, TaskCommand, TaskRepository, TaskStatus, TaskUseCases } from '../../../src/core/domain/task.js'
import { TaskService } from '../../../src/core/use-cases/task-use-cases.js'
import { AppError, NotFoundError, UnprocessableEntityError, ForbiddenError } from '../../../src/utils/errors.js'
import { faker } from '@faker-js/faker'
import { CurrentUser, UserData, UserSession } from '../../../src/core/domain/user.js'

describe('task use cases', () => {
  const superUserMock: CurrentUser = {
    user: {
      id: '123',
      name: 'Spider Man',
      username: 'spiderman',
      super: true,
    },
    get() {
      return {
        user: this.user,
        userAgent: 'Mozilla/5.0',
        ipAddress: '127.0.0.1',
      }
    },
  }

  const userDataMock: CurrentUser = {
    user: {
      id: '456',
      name: 'Peter Park',
      username: 'peter',
      super: false,
    },
    get() {
      return {
        user: this.user,
        userAgent: 'Mozilla/5.0',
        ipAddress: '192.168.0.1',
      }
    },
  }

  it('should get a task of another user when you are a super user', async () => {
    // arrange
    const id = randomUUID()

    const taskRepositoryMock = {
      get: async (id: string): Promise<Task> => ({
        id: id,
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        userId: userDataMock.user.id,
        status: TaskStatus.Done,
      }),
    } as TaskRepository

    const taskUseCases = new TaskService(taskRepositoryMock, superUserMock)

    // act
    const task = await taskUseCases.getTask(id)

    // assert
    assert.ok(task)
    assert.equal(task.userId, userDataMock.user.id)
  })

  it('should not get a task of another user', async () => {
    // arrange
    const id = randomUUID()

    const taskRepositoryMock = {
      get: async (id: string): Promise<Task> => ({
        id: id,
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        userId: superUserMock.user.id,
        status: TaskStatus.Done,
      }),
    } as TaskRepository

    const taskUseCases = new TaskService(taskRepositoryMock, userDataMock)

    try {
      // act
      await taskUseCases.getTask(id)
    } catch (err) {
      // assert
      assert.ok(err)
      assert(err instanceof AppError)
      assert(err instanceof ForbiddenError)
      assert.equal(err.status, 403)
      assert.equal(err.message, 'You do not have permission to see this task.')
    }
  })

  it('should create a new task', async () => {
    // arrange
    const id = randomUUID()

    const taskRepositoryMock = {
      create: async (task: Omit<Task, 'id'>): Promise<Task> => {
        const result = task as Task
        result.id = id
        return result
      },
    } as TaskRepository

    const command: TaskCommand = {
      title: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
    }

    const taskUseCases = new TaskService(taskRepositoryMock, superUserMock)

    // act
    const task = await taskUseCases.addNewTask(command)

    // assert
    assert.ok(task)
    assert.equal(task.id, id)
    assert.equal(task.status, TaskStatus.Todo)
    assert.equal(task.title, command.title)
    assert.equal(task.description, command.description)
    assert.ok(task.createdAt)
    assert.ok(task.userId)
  })

  it('should update a task of another user when you are a super user', async () => {
    // arrange
    const id = randomUUID()
    const createdAt = new Date()

    const taskRepositoryMock = {
      get: async (id: string): Promise<Task> => ({
        id: id,
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        createdAt,
        userId: userDataMock.user.id,
        status: TaskStatus.Done,
      }),
      update: async (id: string, task: Task): Promise<Task> => {
        task.id = id
        return task
      },
    } as TaskRepository

    const command: TaskCommand = {
      title: 'new title',
      description: 'new description',
    }

    const taskUseCases = new TaskService(taskRepositoryMock, superUserMock)

    // act
    const task = await taskUseCases.updateExistingTask(id, command)

    // assert
    assert.ok(task)
    assert.equal(task.id, id)
    assert.equal(task.title, command.title)
    assert.equal(task.description, command.description)
    assert.equal(task.createdAt, createdAt)
    assert.equal(task.status, TaskStatus.Done)
    assert.equal(task.userId, userDataMock.user.id)
  })

  it('should not update of another user when you the user of the task', async () => {
    // arrange
    const id = randomUUID()
    const createdAt = new Date()

    const taskRepositoryMock = {
      get: async (id: string): Promise<Task> => ({
        id: id,
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        createdAt,
        userId: superUserMock.user.id,
        status: TaskStatus.Done,
      }),
    } as TaskRepository

    const command: TaskCommand = {
      title: 'new title',
      description: 'new description',
    }

    const taskUseCases = new TaskService(taskRepositoryMock, userDataMock)

    try {
      // act
      await taskUseCases.updateExistingTask(id, command)
    } catch (err) {
      // assert
      assert.ok(err)
      assert(err instanceof AppError)
      assert(err instanceof ForbiddenError)
      assert.equal(err.status, 403)
      assert.equal(err.message, 'You do not have permission to change this task.')
    }
  })

  it('should not update a task when it is in archived status', async () => {
    // arrange
    const id = randomUUID()
    const createdAt = new Date()

    const taskRepositoryMock = {
      get: async (id: string): Promise<Task> => ({
        id: id,
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        createdAt,
        userId: userDataMock.user.id,
        status: TaskStatus.Archived,
      }),
    } as TaskRepository

    const command: TaskCommand = {
      title: 'new title',
      description: 'new description',
    }

    const taskUseCases = new TaskService(taskRepositoryMock, userDataMock)

    try {
      // act
      await taskUseCases.updateExistingTask(id, command)
    } catch (err) {
      // assert
      assert.ok(err)
      assert(err instanceof AppError)
      assert(err instanceof UnprocessableEntityError)
      assert.equal(err.status, 422)
      assert.equal(err.message, "It is not possible to change the information on a Task on 'Archived' status.")
    }
  })

  it('should not update the status for a non-existing task', async () => {
    // arrange
    const id = randomUUID()

    const taskRepositoryMock = {
      get: async (_: string): Promise<Task | null> => null,
    } as TaskRepository

    const taskUseCases = new TaskService(taskRepositoryMock, superUserMock)

    try {
      // act
      await taskUseCases.updateStatus(id, TaskStatus.Archived)
    } catch (err) {
      // assert
      assert.ok(err)
      assert(err instanceof AppError)
      assert(err instanceof NotFoundError)
      assert.equal(err.status, 404)
      assert.equal(err.message, `There is no Task available for id ${id}.`)
    }
  })

  it('should not update the status from Archived to other status for a given task', async () => {
    // arrange
    const id = randomUUID()
    const currentStatus = TaskStatus.Archived
    const expectedStatus = TaskStatus.InProgress

    const taskRepositoryMock = {
      get: async (id: string): Promise<Task> => ({
        id: id,
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        userId: superUserMock.user.id,
        status: currentStatus,
      }),
      update: async (_: string, task: Task): Promise<Task> => task,
    } as TaskRepository

    const taskUseCases = new TaskService(taskRepositoryMock, superUserMock)

    try {
      // act
      await taskUseCases.updateStatus(id, TaskStatus.Archived)
    } catch (err) {
      // assert
      assert.ok(err)
      assert(err instanceof AppError)
      assert(err instanceof UnprocessableEntityError)
      assert.equal(err.status, 422)
      assert.equal(err.message, `It is not possible to move the Task from 'Archived' status.`)
    }
  })

  it('should update the status from ToDo to InProgress for a given task', async () => {
    // arrange
    const id = randomUUID()
    const currentStatus = TaskStatus.Todo
    const expectedStatus = TaskStatus.InProgress

    const taskRepositoryMock = {
      get: async (id: string): Promise<Task> => ({
        id: id,
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        userId: superUserMock.user.id,
        status: currentStatus,
      }),
      update: async (_: string, task: Task): Promise<Task> => task,
    } as TaskRepository

    const taskUseCases = new TaskService(taskRepositoryMock, superUserMock)

    // act
    const result = await taskUseCases.updateStatus(id, expectedStatus)

    // assert
    assert.ok(result)
    assert.equal(result.id, id)
    assert.equal(result.status, expectedStatus)
  })

  it('should update the status from InProgress to Done for a given task', async () => {
    // arrange
    const id = randomUUID()
    const currentStatus = TaskStatus.InProgress
    const expectedStatus = TaskStatus.Done

    const taskRepositoryMock = {
      get: async (id: string): Promise<Task> => ({
        id: id,
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        userId: superUserMock.user.id,
        status: currentStatus,
      }),
      update: async (_: string, task: Task): Promise<Task> => task,
    } as TaskRepository

    const taskUseCases = new TaskService(taskRepositoryMock, superUserMock)

    // act
    const result = await taskUseCases.updateStatus(id, expectedStatus)

    // assert
    assert.ok(result)
    assert.equal(result.id, id)
    assert.equal(result.status, expectedStatus)
  })

  it('should update the status from Done to Archived for a given task', async () => {
    // arrange
    const id = randomUUID()
    const currentStatus = TaskStatus.Done
    const expectedStatus = TaskStatus.Archived

    const taskRepositoryMock = {
      get: async (id: string): Promise<Task> => ({
        id: id,
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        userId: superUserMock.user.id,
        status: currentStatus,
      }),
      update: async (_: string, task: Task): Promise<Task> => task,
    } as TaskRepository

    const taskUseCases = new TaskService(taskRepositoryMock, superUserMock)

    // act
    const result = await taskUseCases.updateStatus(id, expectedStatus)

    // assert
    assert.ok(result)
    assert.equal(result.id, id)
    assert.equal(result.status, expectedStatus)
  })

  it('should not update the status for a task of another user', async () => {
    // arrange
    const id = randomUUID()

    const taskRepositoryMock = {
      get: async (id: string): Promise<Task> => ({
        id: id,
        title: faker.lorem.sentence(),
        description: faker.lorem.sentence(),
        createdAt: new Date(),
        userId: superUserMock.user.id,
        status: TaskStatus.Done,
      }),
    } as TaskRepository

    const taskUseCases = new TaskService(taskRepositoryMock, userDataMock)

    try {
      // act
      await taskUseCases.updateStatus(id, TaskStatus.Archived)
    } catch (err) {
      // assert
      assert.ok(err)
      assert(err instanceof AppError)
      assert(err instanceof ForbiddenError)
      assert.equal(err.status, 403)
      assert.equal(err.message, 'You do not have permission to change this task.')
    }
  })
})
