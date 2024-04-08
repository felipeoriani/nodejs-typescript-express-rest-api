/* eslint-disable @typescript-eslint/no-unused-vars */
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { randomUUID } from 'node:crypto'
import { Task, TaskCommand, TaskRepository, TaskStatus, TaskUseCases } from '../../../src/core/domain/task.js'
import { TaskService } from '../../../src/core/use-cases/task-use-cases.js'
import { AppError, NotFoundError, UnprocessableEntityError } from '../../../src/utils/errors.js'
import { faker } from '@faker-js/faker'

describe('task use cases', () => {
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

    const taskUseCases = new TaskService(taskRepositoryMock)

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

  it('should not update the status for a non-existing task', async () => {
    // arrange
    const id = randomUUID()

    const taskRepositoryMock = {
      get: async (_: string): Promise<Task | null> => null,
    } as TaskRepository

    const taskUseCases = new TaskService(taskRepositoryMock)

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
        userId: '1',
        status: currentStatus,
      }),
      update: async (_: string, task: Task): Promise<Task> => task,
    } as TaskRepository

    const taskUseCases = new TaskService(taskRepositoryMock)

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
        userId: '1',
        status: currentStatus,
      }),
      update: async (_: string, task: Task): Promise<Task> => task,
    } as TaskRepository

    const taskUseCases = new TaskService(taskRepositoryMock)

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
        userId: '1',
        status: currentStatus,
      }),
      update: async (_: string, task: Task): Promise<Task> => task,
    } as TaskRepository

    const taskUseCases = new TaskService(taskRepositoryMock)

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
        userId: '1',
        status: currentStatus,
      }),
      update: async (_: string, task: Task): Promise<Task> => task,
    } as TaskRepository

    const taskUseCases = new TaskService(taskRepositoryMock)

    // act
    const result = await taskUseCases.updateStatus(id, expectedStatus)

    // assert
    assert.ok(result)
    assert.equal(result.id, id)
    assert.equal(result.status, expectedStatus)
  })
})
