import { ApiResponseError } from './types'

export class ApiError extends Error {
  public readonly responseError: ApiResponseError

  constructor(message: string, error: ApiResponseError) {
    super(message)
    this.responseError = error
  }
}
