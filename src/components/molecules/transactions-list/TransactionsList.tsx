import { PropsWithoutRef, useEffect, useState } from 'react'
import type Client from '../../../lib/ynab-api/client'
import type * as t from '../../../lib/ynab-api/types'

import './TransactionsList.scss'

type Props = PropsWithoutRef<{ budgetId: string; client: Client }>

function formatAmount(amount: number) {
  return (amount / 1000).toFixed(2)
}

function TransactionsList(props: Props) {
  const { budgetId } = props

  const [categoryGroups, setCategoryGroups] = useState(
    null as t.CategoryGroupWithCategories[] | null,
  )

  const [accounts, setAccounts] = useState(null as t.Account[] | null)

  const [payees, setPayees] = useState(null as t.Payee[] | null)

  const [transactions, setTransactions] = useState(
    null as t.TransactionSummary[] | null,
  )

  useEffect(() => {
    if (!categoryGroups) {
      props.client
        .getCategoryGroups(budgetId)
        .then((data) => setCategoryGroups(data.category_groups))
    }

    if (!accounts) {
      props.client
        .getAccounts(budgetId)
        .then((data) => setAccounts(data.accounts))
    }

    if (!payees) {
      props.client.getPayees(budgetId).then((data) => setPayees(data.payees))
    }

    if (!transactions) {
      props.client
        .getTransactions(budgetId)
        .then((data) => setTransactions(data.transactions))
    }
  }, [props.client, budgetId, categoryGroups, accounts, payees, transactions])

  if (!categoryGroups || !accounts || !payees || !transactions) {
    return <span>Loading...</span>
  }

  return (
    <>
      <div>
        <div>Date</div>
        <div>Accounts</div>
        <div>Categories</div>
        <div>Memo</div>
        <div>Flags</div>
        <div>Payees</div>
        <div>Amount</div>
        <div>Transfers Show</div>
      </div>
      <ul className="m-transactionsList">
        {transactions.map((trx) => (
          <li className="m-transactionsList-item" key={trx.id}>
            <div>{trx.date}</div>
            <div>{trx.account_name}</div>
            <div>{trx.category_name}</div>
            <div>{trx.payee_name}</div>
            <div>{formatAmount(trx.amount)}</div>
            <div>{JSON.stringify(trx.subtransactions)}</div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default TransactionsList
