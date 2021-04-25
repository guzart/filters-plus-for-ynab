import flatMap from 'lodash/flatMap'
import padStart from 'lodash/padStart'
import { PropsWithoutRef, useEffect, useMemo, useState } from 'react'
import type Client from '../../../lib/ynab-api/client'
import type * as t from '../../../lib/ynab-api/types'
import Toggle from '../../atoms/toggle/Toggle'
import CheckboxList from '../checkbox-list/CheckboxList'
import TransactionsListItem from './TransactionItem'

import './TransactionsList.scss'

type Props = PropsWithoutRef<{ budgetId: string; client: Client }>

const storageKeys = {
  accountIds: 'selectedAccountIds',
  categoryIds: 'selectedCategoryIds',
  fromDate: 'fromDateFilter',
  toDate: 'toDateFilter',
  showTransfers: 'showTransfersFilter',
}

function toUTCDateString(date: Date | null) {
  if (!date) {
    return ''
  }

  const month = padStart((date.getUTCMonth() + 1).toString(), 2, '0')
  const day = padStart(date.getUTCDate().toString(), 2, '0')
  return `${date.getUTCFullYear()}-${month}-${day}`
}

function TransactionsList(props: Props) {
  const { budgetId } = props

  // Budget Entities

  const [categoryGroups, setCategoryGroups] = useState(null as t.CategoryGroupWithCategories[] | null)
  const categoriesMap = useMemo(() => {
    const output = new Map<string, { name: string }>()
    categoryGroups?.forEach((group) => {
      group.categories.forEach((category) => {
        output.set(category.id, { name: `${category.name} (${group.name})` })
      })
    })

    return output
  }, [categoryGroups])

  const [accounts, setAccounts] = useState(null as t.Account[] | null)

  const [transactions, setTransactions] = useState(null as t.TransactionSummary[] | null)

  useEffect(() => {
    if (!categoryGroups) {
      props.client.getCategoryGroups(budgetId).then((data) => setCategoryGroups(data.category_groups))
    }

    if (!accounts) {
      props.client.getAccounts(budgetId).then((data) => setAccounts(data.accounts))
    }

    if (!transactions) {
      props.client.getTransactions(budgetId).then((data) => setTransactions(data.transactions))
    }
  }, [props.client, budgetId, categoryGroups, accounts, transactions])

  // Filters

  const [fromDate, setFromDate] = useState(() => {
    const storedFromDate = localStorage.getItem(storageKeys.fromDate)
    if (storedFromDate) {
      return new Date(storedFromDate)
    }

    return null
  })

  const [toDate, setToDate] = useState(() => {
    const storedToDate = localStorage.getItem(storageKeys.toDate)
    if (storedToDate) {
      return new Date(storedToDate)
    }

    return null
  })

  const [showTransfers, setShowTransfers] = useState(() => {
    const storedValue = localStorage.getItem(storageKeys.showTransfers)
    if (storedValue) {
      return storedValue !== 'false'
    }

    return true
  })

  const [selectedAccountIds, setSelectedAccountIds] = useState(() => {
    const storedIds = localStorage.getItem(storageKeys.accountIds)
    if (storedIds) {
      return new Set<string>(JSON.parse(storedIds))
    }

    return new Set<string>([])
  })

  const [selectedCategoryIds, setSelectedCategoryIds] = useState(() => {
    const storedIds = localStorage.getItem(storageKeys.categoryIds)
    if (storedIds) {
      return new Set<string>(JSON.parse(storedIds))
    }

    return new Set<string>([])
  })

  useEffect(() => {
    if (fromDate) {
      localStorage.setItem(storageKeys.fromDate, fromDate.toISOString())
    }

    if (toDate) {
      localStorage.setItem(storageKeys.toDate, toDate.toISOString())
    }

    localStorage.setItem(storageKeys.showTransfers, JSON.stringify(showTransfers))

    localStorage.setItem(storageKeys.accountIds, JSON.stringify(Array.from(selectedAccountIds)))

    localStorage.setItem(storageKeys.categoryIds, JSON.stringify(Array.from(selectedCategoryIds)))
  }, [fromDate, toDate, showTransfers, selectedAccountIds, selectedCategoryIds])

  if (!categoryGroups || !accounts || !transactions) {
    return <span>Loading...</span>
  }

  const getCategoryName = (categoryId: string) => categoriesMap.get(categoryId)?.name || categoryId

  const filteredTransactions = transactions.filter((trx) => {
    if (fromDate && toDate) {
      const trxTime = new Date(trx.date).getTime()
      const fromTime = fromDate.getTime()
      const toTime = toDate.getTime()
      if (!(fromTime <= trxTime && trxTime <= toTime)) {
        return false
      }
    }

    if (!showTransfers && trx.transfer_account_id) {
      return false
    }

    if (!selectedAccountIds.has(trx.account_id)) {
      return false
    }

    if (!selectedCategoryIds.has(trx.category_id)) {
      return false
    }

    return true
  })

  // Other filters: memo, flags, amount range, payees
  return (
    <>
      <div>
        <div>
          <div className="text-base font-medium text-gray-900">Date Range</div>
          <input
            className="m-transactionsList-dateInput"
            type="date"
            value={toUTCDateString(fromDate)}
            onChange={(ev) => setFromDate(ev.target.valueAsDate)}
          />
          <span className="inline-block mx-5"> – </span>
          <input
            className="m-transactionsList-dateInput"
            type="date"
            value={toUTCDateString(toDate)}
            onChange={(ev) => setToDate(ev.target.valueAsDate)}
          />
        </div>
        <div className="flex items-center mt-4">
          <span className="font-medium text-gray-900 inline-block mr-2">Show Transfers</span>
          <Toggle
            label="Show Transfer"
            value={showTransfers}
            onChange={(checked) => setShowTransfers(checked)}
          />
        </div>
        <CheckboxList
          id="accounts"
          name="accounts"
          label="Accounts"
          items={accounts.map(({ id, name }) => ({ id, name }))}
          className="m-transactionsList-checkboxList"
          listClassName="m-transactionsList-checkboxList-list"
          value={selectedAccountIds}
          onChange={(selection) => setSelectedAccountIds(selection.selectedIds)}
        />
        <CheckboxList
          id="categories"
          name="categories"
          label="Categories"
          items={flatMap(
            categoryGroups.map((group) =>
              group.categories.map(({ id, name }) => ({
                id,
                name: `${name} (${group.name})`,
              })),
            ),
          )}
          className="m-transactionsList-checkboxList"
          listClassName="m-transactionsList-checkboxList-list"
          value={selectedCategoryIds}
          onChange={(selection) => setSelectedCategoryIds(selection.selectedIds)}
        />
      </div>
      <h2 className="mt-4 mb-2 font-medium text-gray-900">Transactions ({filteredTransactions.length})</h2>
      <ul className="m-transactionsList-list">
        {filteredTransactions.map((trx) => (
          <TransactionsListItem key={trx.id} transaction={trx} getCategoryName={getCategoryName} />
        ))}
      </ul>
    </>
  )
}

export default TransactionsList
