import { PropsWithoutRef } from 'react'
import { TransactionSummary } from '../../../lib/ynab-api/types'
import './TransactionItem.scss'

type Props = PropsWithoutRef<{
  transaction: TransactionSummary
  getCategoryName: (categoryId: string) => string
  onClick?: (transactionId: string) => void
}>

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  dateStyle: 'full',
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function TransactionsListItem(props: Props) {
  const { transaction: trx, getCategoryName, onClick, ...other } = props
  const flagClassName = trx.flag_color ? `mod-${trx.flag_color}` : ''

  const subsElement = trx.subtransactions.length > 0 ? <div>{JSON.stringify(trx.subtransactions)}</div> : null

  const memoElement = trx.memo ? (
    <span className="inline-block ml-3 text-sm text-gray-600">– {trx.memo}</span>
  ) : null

  return (
    <li className="m-transactionsList-item" onClick={() => onClick?.call(trx, trx.id)} {...other}>
      <div className={`m-transactionsList-item-wrapper ${flagClassName}`}>
        <div>
          <div>
            <span className="font-medium">{trx.payee_name}</span>
            {memoElement}
          </div>
          <div>{currencyFormatter.format(trx.amount / 1000)}</div>
          <div className="text-sm">{trx.account_name}</div>
          {subsElement}
        </div>
        <div className="text-right">
          <div>{dateFormatter.format(new Date(trx.date))}</div>
          <div>{getCategoryName(trx.category_id)}</div>
        </div>
      </div>
    </li>
  )
}

export default TransactionsListItem
