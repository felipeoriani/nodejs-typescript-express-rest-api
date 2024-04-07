export class AppError extends Error {
  status: number
  errors?: string[]

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message: string) {
    super(message, 422)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403)
  }
}
