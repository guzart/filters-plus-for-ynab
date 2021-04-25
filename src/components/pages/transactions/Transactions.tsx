import flatMap from 'lodash/flatMap'
import { PropsWithoutRef, useEffect, useMemo, useState } from 'react'
import { toUTCDateString } from '../../../lib/helpers/format'
import type Client from '../../../lib/ynab-api/client'
import type * as t from '../../../lib/ynab-api/types'
import Toggle from '../../atoms/toggle/Toggle'
import CheckboxList from '../../molecules/checkbox-list/CheckboxList'
import TransactionsList from '../../molecules/transactions-list/TransactionsList'

import './Transactions.scss'

type Props = PropsWithoutRef<{ budgetId: string; client: Client }>

const storageKeys = {
  accountIds: 'selectedAccountIds',
  categoryIds: 'selectedCategoryIds',
  dateRangeFrom: 'fromDateFilter',
  dateRangeTo: 'toDateFilter',
  selectedTransactions: 'selectedTransactions',
  showTransfers: 'showTransfersFilter',
}

function Transactions(props: Props) {
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
    const storedFromDate = localStorage.getItem(storageKeys.dateRangeFrom)
    if (storedFromDate) {
      return new Date(storedFromDate)
    }

    return null
  })

  const [toDate, setToDate] = useState(() => {
    const storedToDate = localStorage.getItem(storageKeys.dateRangeTo)
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

  const [selectedTransactionIds, setSelectedTransactionIds] = useState(() => {
    const storedIds = localStorage.getItem(storageKeys.selectedTransactions)
    if (storedIds) {
      return new Set<string>(JSON.parse(storedIds))
    }

    return new Set<string>([])
  })

  useEffect(() => {
    if (fromDate) {
      localStorage.setItem(storageKeys.dateRangeFrom, fromDate.toISOString())
    }

    if (toDate) {
      localStorage.setItem(storageKeys.dateRangeTo, toDate.toISOString())
    }

    localStorage.setItem(storageKeys.showTransfers, JSON.stringify(showTransfers))

    localStorage.setItem(storageKeys.accountIds, JSON.stringify(Array.from(selectedAccountIds)))

    localStorage.setItem(storageKeys.categoryIds, JSON.stringify(Array.from(selectedCategoryIds)))

    localStorage.setItem(storageKeys.selectedTransactions, JSON.stringify(Array.from(selectedTransactionIds)))
  }, [fromDate, toDate, showTransfers, selectedAccountIds, selectedCategoryIds, selectedTransactionIds])

  if (!categoryGroups || !accounts || !transactions) {
    return <span>Loading...</span>
  }

  function handleSelectTransaction(transactionId: string) {
    if (selectedTransactionIds.has(transactionId)) {
      selectedTransactionIds.delete(transactionId)
    } else {
      selectedTransactionIds.add(transactionId)
    }

    setSelectedTransactionIds(new Set(selectedTransactionIds))
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
            className="p-transactions-dateInput"
            type="date"
            value={toUTCDateString(fromDate)}
            onChange={(ev) => setFromDate(ev.target.valueAsDate)}
          />
          <span className="inline-block mx-5"> – </span>
          <input
            className="p-transactions-dateInput"
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
          className="p-transactions-checkboxList"
          listClassName="p-transactions-checkboxList-list"
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
          className="p-transactions-checkboxList"
          listClassName="p-transactions-checkboxList-list"
          value={selectedCategoryIds}
          onChange={(selection) => setSelectedCategoryIds(selection.selectedIds)}
        />
      </div>
      <h2 className="mt-4 mb-2 font-medium text-gray-900">
        Transactions ({selectedTransactionIds.size}/{filteredTransactions.length})
      </h2>
      <TransactionsList
        className="p-transactions-list"
        transactions={filteredTransactions}
        getCategoryName={getCategoryName}
        onSelect={handleSelectTransaction}
        selectedTransactionIds={selectedTransactionIds}
      />
    </>
  )
}

export default Transactions
