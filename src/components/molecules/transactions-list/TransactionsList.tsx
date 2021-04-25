import { PropsWithoutRef } from 'react'
import type * as t from '../../../lib/ynab-api/types'
import TransactionsListItem from './TransactionItem'

import './TransactionsList.scss'

type Props = PropsWithoutRef<{
  className?: string
  getCategoryName: (categoryId: string) => string
  transactions: t.TransactionSummary[]
  onSelect?: (transactionId: string) => void
  selectedTransactionIds?: Set<string>
}>

function TransactionsList(props: Props) {
  return (
    <ul className={`m-transactionsList ${props.className}`}>
      {props.transactions.map((trx) => (
        <TransactionsListItem
          key={trx.id}
          transaction={trx}
          getCategoryName={props.getCategoryName}
          onClick={(trxId) => props.onSelect?.call(trx, trxId)}
          isSelected={props.selectedTransactionIds?.has(trx.id)}
        />
      ))}
    </ul>
  )
}

export default TransactionsList
