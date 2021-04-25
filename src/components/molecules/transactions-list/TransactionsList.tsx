import { PropsWithoutRef } from 'react'
import type * as t from '../../../lib/ynab-api/types'
import TransactionsListItem from './TransactionItem'

import './TransactionsList.scss'

type Props = PropsWithoutRef<{
  className?: string
  transactions: t.TransactionSummary[]
  getCategoryName: (categoryId: string) => string
}>

function TransactionsList(props: Props) {
  return (
    <ul className={`m-transactionsList ${props.className}`}>
      {props.transactions.map((trx) => (
        <TransactionsListItem key={trx.id} transaction={trx} getCategoryName={props.getCategoryName} />
      ))}
    </ul>
  )
}

export default TransactionsList
