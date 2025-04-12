import { PropsWithoutRef, useEffect, useState } from 'react'
import { Button } from '@radix-ui/themes'

import Client from '@/lib/ynab-api/client'
import { BudgetSummary } from '@/lib/ynab-api/types'
import { BUDGETS_STORAGE_KEY, BUDGETS_FETCHED_AT_KEY } from '@/lib/constants'

type Props = PropsWithoutRef<{
  client: Client
  onSelect(budgetId: string): void
}>

function isExpired(time: string) {
  const now = new Date()
  const fetchedAt = new Date(parseInt(time))
  const difference = now.getTime() - fetchedAt.getTime()
  return difference > 2 * 60 * 1000
}

function BudgetSelect(props: Props) {
  const [budgets, setBudgets] = useState([] as BudgetSummary[])

  useEffect(() => {
    if (budgets.length > 0) {
      return
    }

    const fetchedAt = localStorage.getItem(BUDGETS_FETCHED_AT_KEY)
    const storedData = localStorage.getItem(BUDGETS_STORAGE_KEY)
    if (storedData && fetchedAt && !isExpired(fetchedAt)) {
      setBudgets(JSON.parse(storedData))
    } else {
      props.client.getBudgets().then((data) => {
        localStorage.setItem(BUDGETS_FETCHED_AT_KEY, new Date().getTime().toString())
        localStorage.setItem(BUDGETS_STORAGE_KEY, JSON.stringify(data.budgets))
        setBudgets(data.budgets)
      })
    }
  }, [props.client])

  return (
    <div>
      <p className="mb-4 text-lg font-bold">Select your budget</p>
      <ul className="flex flex-row justify-center gap-2">
        {budgets.map((budget) => (
          <li key={budget.id}>
            <Button onClick={() => props.onSelect(budget.id)}>{budget.name}</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BudgetSelect
