import { isErrorResponse } from './helpers'
import { ApiResponseError, YnabApiResponse } from './types'

export class ApiResponse<T> {
  private readonly body: YnabApiResponse<T>

  constructor(data: YnabApiResponse<T>) {
    this.body = data
  }

  get data(): T | null {
    if (isErrorResponse(this.body)) {
      return null
    }

    return this.body.data
  }

  get error(): ApiResponseError | null {
    if (isErrorResponse(this.body)) {
      return this.body.error
    }

    return null
  }
}
