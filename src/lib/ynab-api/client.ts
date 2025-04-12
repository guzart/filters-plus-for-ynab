import { ApiError } from './api-error'
import { ApiResponse } from './api-response'
import type * as t from './types'

export default class Client {
  private accessToken: string = ''
  private baseUrl = 'https://api.ynab.com/v1'
  private count = 0
  private cache = new Map<string, string>()

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

  async getTransactions(budgetId: string, { fromDate }: { fromDate: Date }) {
    return await this.getRequest<{ transactions: t.TransactionSummary[] }>(`/budgets/${budgetId}/transactions`, {
      params: {
        since_date: fromDate.toISOString(),
      },
    })
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

  private async getRequest<T>(urlPath: string, options?: { params?: Record<string, string> }) {
    this.count += 1
    if (this.count > 15) {
      // DEV: Prevent excessive requests
      throw new Error('Rate limit exceeded')
    }

    const cachedResponse = this.cache.get(urlPath)
    if (cachedResponse) {
      // DEV: Prevent excessive requests
      console.log('YNAB API Client: Using cached response for', urlPath)
      return JSON.parse(cachedResponse)
    }

    const requestUrl = new URL(this.baseUrl + urlPath)
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        requestUrl.searchParams.set(key, value)
      })
    }

    const serverResponse = await fetch(requestUrl, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    })

    const json = await serverResponse.json()
    const response = new ApiResponse<T>(json)
    if (response.data) {
      console.log('YNAB API Client: Caching response for', urlPath)
      this.cache.set(urlPath, JSON.stringify(response.data))
      return response.data
    } else if (response.error) {
      throw new ApiError(response.error.name, response.error)
    } else {
      throw new Error('Unhandled server response')
    }
  }
}
