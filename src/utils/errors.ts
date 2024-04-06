export class AppError extends Error {
  status: number
  errors?: string[]

  constructor(message: string, status: number, errors?: string[]) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, errors?: string[]) {
    super(message, 400, errors)
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message: string, errors?: string[]) {
    super(message, 422, errors)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, errors?: string[]) {
    super(message, 400, errors)
  }
}
