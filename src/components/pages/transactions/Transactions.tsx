import flatMap from 'lodash/flatMap'
import { PropsWithoutRef, useEffect, useMemo, useState } from 'react'
import { Box, Flex, Grid, ScrollArea, Switch, Tabs, Text } from '@radix-ui/themes'

import { toUTCDateString } from '@/lib/helpers/format'
import type Client from '@/lib/ynab-api/client'
import * as cards from '@/components/atoms/card'
import SectionTitle from '@/components/atoms/section-title/SectionTitle'
import CheckboxList from '@/components/molecules/checkbox-list/CheckboxList'
import TransactionsList from '@/components/molecules/transactions-list/TransactionsList'
import type { Account, CategoryGroupWithCategories, Payee, TransactionSummary } from '@/lib/ynab-api/types'
import {
  fetchEntities,
  loadFilter as loadFilter,
  loadNullableDateFilter,
  loadStringSetFilter,
  saveFilter,
} from '@/lib/helpers/storage'

import './Transactions.css'

type Props = PropsWithoutRef<{ budgetId: string; client: Client }>

const lastYear = new Date(new Date().getFullYear() - 1, 0, 1)

function Transactions(props: Props) {
  const { budgetId } = props

  // Budget Entities
  const [accounts, setAccounts] = useState(null as Account[] | null)
  const [categoryGroups, setCategoryGroups] = useState(null as CategoryGroupWithCategories[] | null)
  const [payees, setPayees] = useState(null as Payee[] | null)
  const [transactions, setTransactions] = useState(null as TransactionSummary[] | null)

  // Filters

  const [fromDate, setFromDate] = useState(loadFilter('dateRangeFrom', { default: lastYear }))
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
    if (!categoryGroups) {
      fetchEntities('categoryGroups', {
        request: () => props.client.getCategoryGroups(budgetId).then((data) => data.category_groups),
        setState: setCategoryGroups,
      })
    }

    if (!accounts) {
      fetchEntities('accounts', {
        request: () => props.client.getAccounts(budgetId).then((data) => data.accounts),
        setState: setAccounts,
      })
    }

    if (!payees) {
      fetchEntities('payees', {
        request: () => props.client.getPayees(budgetId).then((data) => data.payees),
        setState: setPayees,
      })
    }

    if (!transactions) {
      fetchEntities('transactions', {
        request: () =>
          props.client.getTransactions(budgetId, { fromDate: fromDate || lastYear }).then((data) => data.transactions),
        setState: setTransactions,
      })
    }
  }, [props.client])

  useEffect(() => {
    saveFilter('dateRangeFrom', fromDate.toISOString())
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
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  const selectedTransactions = transactions.filter((tr) => selectedTransactionIds.has(tr.id))

  // Other filters: memo, flags, amount range, payees
  return (
    <div className="flex h-screen flex-col overflow-hidden p-4">
      <div>
        <h2 className="text-2xl font-bold">Filters</h2>
        <Flex gap="8">
          <Box>
            <h3 className="p-transactions-filterHeading">Date Range</h3>
            <span className="mr-2 inline-block italic">From</span>
            <input
              className="p-transactions-dateInput"
              type="date"
              value={toUTCDateString(fromDate)}
              onChange={(ev) => setFromDate(ev.target.valueAsDate || lastYear)}
            />
            <span className="mx-5 inline-block italic"> to </span>
            <input
              className="p-transactions-dateInput"
              type="date"
              value={toUTCDateString(toDate)}
              onChange={(ev) => setToDate(ev.target.valueAsDate)}
            />
          </Box>
          <Box className="mt-4 pt-2">
            <Text as="label">
              <Flex gap="2" align="center">
                <Switch checked={showTransfers} onCheckedChange={() => setShowTransfers(!showTransfers)} />
                Show Transfers
              </Flex>
            </Text>
          </Box>
        </Flex>
        <Box className="mt-2">
          <Tabs.Root defaultValue="accounts">
            <Tabs.List>
              <Tabs.Trigger value="accounts">
                Accounts ({selectedAccountIds.size}/{accounts.length})
              </Tabs.Trigger>
              <Tabs.Trigger value="categories">
                Categories ({selectedCategoryIds.size}/{categoryGroups.flatMap((group) => group.categories).length})
              </Tabs.Trigger>
              <Tabs.Trigger value="payees">
                Payees ({selectedPayeeIds.size}/{payees.length})
              </Tabs.Trigger>
            </Tabs.List>
            <ScrollArea type="always" scrollbars="vertical" style={{ height: 180 }}>
              <Box pt="3">
                <Tabs.Content value="accounts">
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
                </Tabs.Content>
                <Tabs.Content value="categories">
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
                </Tabs.Content>
                <Tabs.Content value="payees">
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
                </Tabs.Content>
              </Box>
            </ScrollArea>
          </Tabs.Root>
        </Box>
      </div>
      <div className="flex h-full flex-1 flex-row gap-4 overflow-hidden">
        <div className="flex flex-1 flex-col gap-4">
          <h2 className="mt-4 text-2xl font-bold">
            Transactions ({selectedTransactionIds.size}/{filteredTransactions.length})
          </h2>
          <ScrollArea type="always" scrollbars="vertical">
            <TransactionsList
              className="pe-2"
              transactions={filteredTransactions}
              getCategoryName={getCategoryName}
              onSelect={handleSelectTransaction}
              selectedTransactionIds={selectedTransactionIds}
            />
          </ScrollArea>
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <h2 className="mt-4 text-2xl font-bold">Selected Transactions ({selectedTransactions.length})</h2>
          <ScrollArea type="always" scrollbars="vertical">
            <TransactionsList transactions={selectedTransactions} getCategoryName={getCategoryName} />
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default Transactions
