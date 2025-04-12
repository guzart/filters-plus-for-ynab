export const CLIENT_ID = '71591f4ec6dae7f1ff9a3b58f5a33064478f1b56f3e5a1642352292580bc88a3'

export const ACCESS_TOKEN_KEY = 'fp_accessToken'

export const BUDGETS_STORAGE_KEY = 'fp_budgets'

export const BUDGETS_FETCHED_AT_KEY = 'fp_budgetsFetchedAt'

export const ACTIVE_BUDGET_ID_KEY = 'fp_activeBudgetId'

export const FILTERS_STORAGE_KEYS = {
  dateRangeFrom: 'fp_fromDateFilter',
  dateRangeTo: 'fp_toDateFilter',
  selectedAccountIds: 'fp_selectedAccountIds',
  selectedCategoryIds: 'fp_selectedCategoryIds',
  selectedPayeeIds: 'fp_selectedPayeeIds',
  selectedTransactions: 'fp_selectedTransactions',
  showTransfers: 'fp_showTransfersFilter',
}

export const ENTITIES_STORAGE_KEYS = {
  categoryGroups: 'fp_categoryGroups',
  accounts: 'fp_accounts',
  transactions: 'fp_transactions',
  payees: 'fp_payees',
}

export type FilterStorageKeys = keyof typeof FILTERS_STORAGE_KEYS

export type EntityStorageKeys = keyof typeof ENTITIES_STORAGE_KEYS
