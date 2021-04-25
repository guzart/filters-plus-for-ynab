import { YnabApiResponse, ApiErrorResponse } from './types'

export function isErrorResponse(
  data: YnabApiResponse<any>,
): data is ApiErrorResponse {
  return (data as ApiErrorResponse).error !== undefined
}
