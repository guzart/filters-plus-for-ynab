import { PropsWithoutRef, useEffect, useState } from 'react'
import Client from '../../../lib/ynab-api/client'
import { BudgetSummary } from '../../../lib/ynab-api/types'

import { Button } from '@radix-ui/themes'

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
    const data = localStorage.getItem('budgets')
    const fetchedAt = localStorage.getItem('budgetsFetchedAt')
    if (!data || !fetchedAt || isExpired(fetchedAt)) {
      props.client.getBudgets().then((data) => {
        setBudgets(data.budgets)
        localStorage.setItem('budgets', JSON.stringify(data.budgets))
        localStorage.setItem('budgetsFetchedAt', new Date().getTime().toString())
      })
    } else if (data && budgets.length === 0) {
      setBudgets(JSON.parse(data))
    }
  }, [budgets, props.client])

  return (
    <div>
      <p className="text-lg font-bold mb-4">Select your budget</p>
      <ul className="flex flex-row justify-center gap-2">
        {budgets.map((budget) => (
          <li key={budget.id}>
            <Button onClick={() => props.onSelect(budget.id)}>
              {budget.name}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BudgetSelect
