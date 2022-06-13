import flatMap from 'lodash/flatMap'
import { PropsWithoutRef, useEffect, useMemo, useState } from 'react'
import { toUTCDateString } from '../../../lib/helpers/format'
import type Client from '../../../lib/ynab-api/client'
import type * as t from '../../../lib/ynab-api/types'
import Toggle from '../../atoms/toggle/Toggle'
import * as cards from '../../atoms/card'
import SectionTitle from '../../atoms/section-title/SectionTitle'
import CheckboxList from '../../molecules/checkbox-list/CheckboxList'
import TransactionsList from '../../molecules/transactions-list/TransactionsList'

import './Transactions.scss'

type Props = PropsWithoutRef<{ budgetId: string; client: Client }>

const storageKeys = {
  dateRangeFrom: 'fromDateFilter',
  dateRangeTo: 'toDateFilter',
  selectedAccountIds: 'selectedAccountIds',
  selectedCategoryIds: 'selectedCategoryIds',
  selectedPayeeIds: 'selectedPayeeIds',
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

  const [payees, setPayees] = useState(null as t.Payee[] | null)

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
    const storedIds = localStorage.getItem(storageKeys.selectedAccountIds)
    if (storedIds) {
      return new Set<string>(JSON.parse(storedIds))
    }

    return new Set<string>([])
  })

  const [selectedCategoryIds, setSelectedCategoryIds] = useState(() => {
    const storedIds = localStorage.getItem(storageKeys.selectedCategoryIds)
    if (storedIds) {
      return new Set<string>(JSON.parse(storedIds))
    }

    return new Set<string>([])
  })

  const [selectedPayeeIds, setSelectedPayeeIds] = useState(() => {
    const storedIds = localStorage.getItem(storageKeys.selectedPayeeIds)
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

  // Fetch budget items from server
  useEffect(() => {
    if (!categoryGroups) {
      props.client.getCategoryGroups(budgetId).then((data) => setCategoryGroups(data.category_groups))
    }

    if (!accounts) {
      props.client.getAccounts(budgetId).then((data) => {
        setAccounts(data.accounts)
        setSelectedAccountIds(new Set(data.accounts.map((account) => account.id)))
      })
    }

    if (!payees) {
      props.client.getPayees(budgetId).then((data) => {
        const sortedPayees = data.payees.sort((a, b) => (a.name < b.name ? -1 : a.name === b.name ? 0 : 1))
        setPayees(sortedPayees)
        setSelectedPayeeIds(new Set(data.payees.map(({ id }) => id)))
      })
    }

    if (!transactions) {
      props.client.getTransactions(budgetId).then((data) => setTransactions(data.transactions))
    }
  }, [props.client, budgetId, categoryGroups, accounts, payees, transactions])

  useEffect(() => {
    if (fromDate) {
      localStorage.setItem(storageKeys.dateRangeFrom, fromDate.toISOString())
    } else {
      localStorage.removeItem(storageKeys.dateRangeFrom)
    }

    if (toDate) {
      localStorage.setItem(storageKeys.dateRangeTo, toDate.toISOString())
    } else {
      localStorage.removeItem(storageKeys.dateRangeTo)
    }

    localStorage.setItem(storageKeys.showTransfers, JSON.stringify(showTransfers))

    localStorage.setItem(storageKeys.selectedAccountIds, JSON.stringify(Array.from(selectedAccountIds)))

    localStorage.setItem(storageKeys.selectedCategoryIds, JSON.stringify(Array.from(selectedCategoryIds)))

    localStorage.setItem(storageKeys.selectedPayeeIds, JSON.stringify(Array.from(selectedPayeeIds)))

    localStorage.setItem(storageKeys.selectedTransactions, JSON.stringify(Array.from(selectedTransactionIds)))
  }, [
    fromDate,
    toDate,
    showTransfers,
    selectedAccountIds,
    selectedCategoryIds,
    selectedPayeeIds,
    selectedTransactionIds,
  ])

  const filteredTransactions: t.TransactionSummary[] = useMemo(() => {
    if (!transactions) {
      return []
    }

    return transactions.filter((trx) => {
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

      if (!selectedPayeeIds.has(trx.payee_id)) {
        return false
      }

      return true
    })
  }, [
    transactions,
    fromDate,
    toDate,
    showTransfers,
    selectedAccountIds,
    selectedCategoryIds,
    selectedPayeeIds,
  ])

  function handleSelectTransaction(transactionIds: string[], targetId: string) {
    const isRemove = selectedTransactionIds.has(targetId)
    transactionIds.forEach((id) => {
      if (isRemove) {
        selectedTransactionIds.delete(id)
      } else {
        selectedTransactionIds.add(id)
      }
    })

    setSelectedTransactionIds(new Set(selectedTransactionIds))
  }

  const getCategoryName = (categoryId: string) => categoriesMap.get(categoryId)?.name || categoryId

  if (!categoryGroups || !accounts || !payees || !transactions) {
    return <span>Loading...</span>
  }

  const selectedTransactions = transactions.filter((tr) => selectedTransactionIds.has(tr.id))

  // Other filters: memo, flags, amount range, payees
  return (
    <>
      <SectionTitle>Filters</SectionTitle>
      <cards.Card>
        <cards.Section>
          <h3 className="p-transactions-filterHeading">Date Range</h3>
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
        </cards.Section>
        <cards.Section>
          <div className="flex items-center mt-4">
            <Toggle
              label="Show Transfer"
              value={showTransfers}
              onChange={(checked) => setShowTransfers(checked)}
            />
            <h3
              className="p-transactions-filterHeading mod-toggleLabel"
              onClick={() => setShowTransfers(!showTransfers)}
            >
              Show Transfers
            </h3>
          </div>
        </cards.Section>
        <cards.Section>
          <CheckboxList
            id="accounts"
            name="accounts"
            label="Accounts"
            items={accounts.map(({ id, name }) => ({ id, name }))}
            className="p-transactions-checkboxList"
            labelClassName="p-transactions-filterHeading"
            listClassName="p-transactions-checkboxList-list"
            value={selectedAccountIds}
            onChange={(selection) => setSelectedAccountIds(selection.selectedIds)}
          />
        </cards.Section>
        <cards.Section>
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
            labelClassName="p-transactions-filterHeading"
            listClassName="p-transactions-checkboxList-list"
            value={selectedCategoryIds}
            onChange={(selection) => setSelectedCategoryIds(selection.selectedIds)}
          />
        </cards.Section>
        <cards.Section>
          <CheckboxList
            id="payees"
            name="payees"
            label="Payees"
            items={payees.map(({ id, name }) => ({ id, name }))}
            className="p-transactions-checkboxList"
            labelClassName="p-transactions-filterHeading"
            listClassName="p-transactions-checkboxList-list"
            value={selectedPayeeIds}
            onChange={(selection) => setSelectedPayeeIds(selection.selectedIds)}
          />
        </cards.Section>
      </cards.Card>
      <SectionTitle>
        Transactions ({selectedTransactionIds.size}/{filteredTransactions.length})
      </SectionTitle>
      <div className="p-transactions-window">
        <TransactionsList
          transactions={filteredTransactions}
          getCategoryName={getCategoryName}
          onSelect={handleSelectTransaction}
          selectedTransactionIds={selectedTransactionIds}
        />
      </div>
      <SectionTitle>Selected Transactions ({selectedTransactions.length})</SectionTitle>
      <div className="p-transactions-window">
        <TransactionsList transactions={selectedTransactions} getCategoryName={getCategoryName} />
      </div>
    </>
  )
}

export default Transactions
