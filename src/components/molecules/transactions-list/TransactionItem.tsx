import { PropsWithoutRef } from 'react'
import { TransactionSummary } from '../../../lib/ynab-api/types'
import './TransactionItem.scss'

type Props = PropsWithoutRef<{ transaction: TransactionSummary }>

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  dateStyle: 'full',
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function TransactionsListItem(props: Props) {
  const { transaction: trx, ...other } = props
  const flagClassName = trx.flag_color ? `mod-${trx.flag_color}` : ''

  return (
    <li className="m-transactionsList-item" {...other}>
      <div className={`m-transactionsList-item-wrapper ${flagClassName}`}>
        <div>
          <div>{trx.category_name}</div>
          <div>{trx.payee_name}</div>
          <div>{trx.memo}</div>
          <div>{trx.account_name}</div>
          <div>{currencyFormatter.format(trx.amount / 1000)}</div>
          <div>{JSON.stringify(trx.subtransactions)}</div>
        </div>
        <div className="">
          <div>{dateFormatter.format(new Date(trx.date))}</div>
        </div>
      </div>
    </li>
  )
}

export default TransactionsListItem
