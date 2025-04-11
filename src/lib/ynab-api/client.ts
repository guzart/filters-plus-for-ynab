import { ApiError } from './api-error'
import { ApiResponse } from './api-response'
import type * as t from './types'

export default class Client {
  private accessToken: string = ''
  private baseUrl = 'https://api.ynab.com/v1'

  constructor(accessToken: string) {
    if (accessToken) {
      this.accessToken = accessToken
    }
  }

  updateAccessToken(token: string) {
    this.accessToken = token
  }

  async getUserInfo() {
    return await this.getRequest<t.UserInfo>('/user')
  }

  async getBudgets() {
    return await this.getRequest<{ budgets: t.BudgetSummary[] }>('/budgets')
  }

  async getTransactions(budgetId: string) {
    return await this.getRequest<{ transactions: t.TransactionSummary[] }>(`/budgets/${budgetId}/transactions`)
  }

  async getCategoryGroups(budgetId: string) {
    return await this.getRequest<{
      category_groups: t.CategoryGroupWithCategories[]
    }>(`/budgets/${budgetId}/categories`)
  }

  async getAccounts(budgetId: string) {
    return await this.getRequest<{ accounts: t.Account[] }>(`/budgets/${budgetId}/accounts`)
  }

  async getPayees(budgetId: string) {
    return await this.getRequest<{ payees: t.Payee[] }>(`/budgets/${budgetId}/payees`)
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
