import { ApiError } from './api-error'
import { ApiResponse } from './api-response'
import { BudgetSummary, UserInfo } from './types'

export default class Client {
  private accessToken: string = ''
  private baseUrl = 'https://api.youneedabudget.com/v1'

  constructor(accessToken?: string) {
    if (accessToken) {
      this.accessToken = accessToken
    }
  }

  updateAccessToken(token: string) {
    this.accessToken = token
  }

  async getUserInfo() {
    return await this.getRequest<UserInfo>('/user')
  }

  async getBudgets() {
    return await this.getRequest<{ budgets: BudgetSummary[] }>('/budgets')
  }

  private async getRequest<T>(urlPath: string) {
    const serverResponse = await fetch(this.baseUrl + urlPath, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    })

    const json = await serverResponse.json()
    const response = new ApiResponse<T>(json)
    if (response.data) {
      return response.data
    } else if (response.error) {
      throw new ApiError(response.error.name, response.error)
    } else {
      throw new Error('Unhandled server response')
    }
  }
}
