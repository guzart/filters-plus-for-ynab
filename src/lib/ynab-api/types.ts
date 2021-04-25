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

export interface Account {
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
}

export interface Payee {
  id: string
  name: string
  transfer_account_id: string
  deleted: boolean
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
  accounts: Account[]
}

enum FlagColor {
  red = 'red',
  orange = 'orange',
  yellow = 'yellow',
  green = 'green',
  blue = 'blue',
  purple = 'purple',
}

enum ClearedStatus {
  cleared = 'cleared',
  uncleared = 'uncleared',
  reconciled = 'reconciled',
}

export interface TransactionSummary {
  id: string
  date: string
  amount: number
  memo: string
  /**
   * The cleared status of the transaction
   */
  cleared: ClearedStatus
  /**
   * Whether or not the transaction is approved
   */
  approved: boolean
  flag_color: FlagColor | null
  account_id: string
  payee_id: string
  category_id: string
  transfer_account_id: string
  transfer_transaction_id: string
  matched_transaction_id: string
  import_id: string
  /**
   * Whether or not the transaction has been deleted.
   * Deleted transactions will only be included in delta requests.
   */
  deleted: boolean
  account_name: string
  payee_name: string
  category_name: string
  subtransactions: [
    {
      id: string
      transaction_id: string
      amount: number
      memo: string
      payee_id: string
      payee_name: string
      category_id: string
      category_name: string
      transfer_account_id: string
      transfer_transaction_id: string
      deleted: boolean
    },
  ]
}

enum GoalType {
  /**
   * Target Category Balance
   */
  TB = 'TB',
  /**
   * Target Category Balance by Date
   */
  TBD = 'TBD',
  /**
   * Monthly Funding
   */
  MF = 'MF',
  /**
   * Plan Your Spending
   */
  NEED = 'NEED',
}

export interface Category {
  id: string
  category_group_id: string
  name: string
  hidden: boolean
  original_category_group_id: string
  note: string
  budgeted: number
  activity: number
  balance: number
  goal_type: GoalType
  goal_creation_month: string
  goal_target: number
  goal_target_month: string
  goal_percentage_complete: number
  goal_months_to_budget: number
  goal_under_funded: number
  goal_overall_funded: number
  goal_overall_left: number
  deleted: boolean
}

export interface CategoryGroup {
  id: string
  name: string
  hidden: boolean
  deleted: boolean
}

export type CategoryGroupWithCategories = CategoryGroup & {
  categories: Category[]
}
