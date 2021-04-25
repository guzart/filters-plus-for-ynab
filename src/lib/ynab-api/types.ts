export interface ApiResponseError {
  id: string
  name: string
  detail: string
}

export interface ApiErrorResponse {
  error: ApiResponseError
}

export interface ApiSuccessResponse<T> {
  data: T
}

export type YnabApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

export interface UserInfo {
  user: { id: string }
}

enum AccountType {
  checking = 'checking',
  savings = 'savings',
  cash = 'cash',
  creditCard = 'creditCard',
  lineOfCredit = 'lineOfCredit',
  otherAsset = 'otherAsset',
  otherLiability = 'otherLiability',
  payPal = 'payPal',
  merchantAccount = 'merchantAccount',
  investmentAccount = 'investmentAccount',
  mortgage = 'mortgage',
}

export interface BudgetSummary {
  id: string
  name: string
  last_modified_on: string
  first_month: string
  last_month: string
  date_format: {
    format: string
  }
  currency_format: {
    iso_code: string
    example_format: string
    decimal_digits: number
    decimal_separator: string
    symbol_first: boolean
    group_separator: string
    currency_symbol: string
    display_symbol: boolean
  }
  accounts: [
    {
      id: string
      name: string
      type: AccountType
      on_budget: boolean
      closed: boolean
      note: string
      balance: number
      cleared_balance: number
      uncleared_balance: number
      transfer_payee_id: string
      direct_import_linked: boolean
      direct_import_in_error: boolean
      deleted: boolean
    },
  ]
}
