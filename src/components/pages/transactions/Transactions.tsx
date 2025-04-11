import flatMap from 'lodash/flatMap'
import { PropsWithoutRef, useEffect, useMemo, useState } from 'react'

import { toUTCDateString } from '@/lib/helpers/format'
import type Client from '@/lib/ynab-api/client'
import Toggle from '@/components/atoms/toggle/Toggle'
import * as cards from '@/components/atoms/card'
import SectionTitle from '@/components/atoms/section-title/SectionTitle'
import CheckboxList from '@/components/molecules/checkbox-list/CheckboxList'
import TransactionsList from '@/components/molecules/transactions-list/TransactionsList'
import type { Account, CategoryGroupWithCategories, Payee, TransactionSummary } from '@/lib/ynab-api/types'
import { EntityStorageKeys } from '@/lib/constants'
import {
  fetchEntities,
  loadFilter as loadFilter,
  loadNullableDateFilter,
  loadStringSetFilter,
  saveFilter,
} from '@/lib/helpers/storage'

import './Transactions.css'

type Props = PropsWithoutRef<{ budgetId: string; client: Client }>

function Transactions(props: Props) {
  const { budgetId } = props

  // Budget Entities Loading State
  const [isLoading, setIsLoading] = useState<Record<EntityStorageKeys, boolean>>({
    accounts: false,
    categoryGroups: false,
    payees: false,
    transactions: false,
  })

  // Budget Entities
  const [accounts, setAccounts] = useState(null as Account[] | null)
  const [categoryGroups, setCategoryGroups] = useState(null as CategoryGroupWithCategories[] | null)
  const [payees, setPayees] = useState(null as Payee[] | null)
  const [transactions, setTransactions] = useState(null as TransactionSummary[] | null)

  // Filters

  const [fromDate, setFromDate] = useState(loadNullableDateFilter('dateRangeFrom'))
  const [toDate, setToDate] = useState(loadNullableDateFilter('dateRangeTo'))
  const [showTransfers, setShowTransfers] = useState(loadFilter('showTransfers', { default: true }))
  const [selectedAccountIds, setSelectedAccountIds] = useState(loadStringSetFilter('selectedAccountIds'))
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(loadStringSetFilter('selectedCategoryIds'))
  const [selectedPayeeIds, setSelectedPayeeIds] = useState(loadStringSetFilter('selectedPayeeIds'))
  const [selectedTransactionIds, setSelectedTransactionIds] = useState(loadStringSetFilter('selectedTransactions'))

  // Memoized
  const categoriesMap = useMemo(() => {
    const output = new Map<string, { name: string }>()
    categoryGroups?.forEach((group) => {
      group.categories.forEach((category) => {
        output.set(category.id, { name: `${category.name} (${group.name})` })
      })
    })

    return output
  }, [categoryGroups])

  // Fetch budget items from server
  useEffect(() => {
    fetchEntities({
      storageKey: 'categoryGroups',
      request: () => props.client.getCategoryGroups(budgetId).then((data) => data.category_groups),
      setState: setCategoryGroups,
      isLoading,
      setIsLoading,
    })

    fetchEntities({
      storageKey: 'accounts',
      request: () => props.client.getAccounts(budgetId).then((data) => data.accounts),
      setState: setAccounts,
      isLoading,
      setIsLoading,
    })

    fetchEntities({
      storageKey: 'payees',
      request: () => props.client.getPayees(budgetId).then((data) => data.payees),
      setState: setPayees,
      isLoading,
      setIsLoading,
    })

    fetchEntities({
      storageKey: 'transactions',
      request: () => props.client.getTransactions(budgetId).then((data) => data.transactions),
      setState: setTransactions,
      isLoading,
      setIsLoading,
    })
  }, [props.client, budgetId, categoryGroups, accounts, payees, transactions])

  useEffect(() => {
    saveFilter('dateRangeFrom', fromDate?.toISOString())
    saveFilter('dateRangeTo', toDate?.toISOString())
    saveFilter('showTransfers', showTransfers)
    saveFilter('selectedAccountIds', Array.from(selectedAccountIds))
    saveFilter('selectedCategoryIds', Array.from(selectedCategoryIds))
    saveFilter('selectedPayeeIds', Array.from(selectedPayeeIds))
    saveFilter('selectedTransactions', Array.from(selectedTransactionIds))
  }, [
    fromDate,
    toDate,
    showTransfers,
    selectedAccountIds,
    selectedCategoryIds,
    selectedPayeeIds,
    selectedTransactionIds,
  ])

  const filteredTransactions: TransactionSummary[] = useMemo(() => {
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
  }, [transactions, fromDate, toDate, showTransfers, selectedAccountIds, selectedCategoryIds, selectedPayeeIds])

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
          <span className="mx-5 inline-block"> – </span>
          <input
            className="p-transactions-dateInput"
            type="date"
            value={toUTCDateString(toDate)}
            onChange={(ev) => setToDate(ev.target.valueAsDate)}
          />
        </cards.Section>
        <cards.Section>
          <div className="mt-4 flex items-center">
            <Toggle label="Show Transfer" value={showTransfers} onChange={(checked) => setShowTransfers(checked)} />
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
