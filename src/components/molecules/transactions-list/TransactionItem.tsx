import { HTMLProps } from 'react'
import { CircleIcon } from '@radix-ui/react-icons'

import { TransactionSummary } from '@/lib/ynab-api/types'
import './TransactionItem.css'

type Props = HTMLProps<HTMLLIElement> & {
  transaction: TransactionSummary
  getCategoryName: (categoryId: string) => string
  isSelected?: boolean
}

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  dateStyle: 'full',
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function TransactionsListItem(props: Props) {
  const { transaction: trx, getCategoryName, isSelected, ...other } = props
  const flagClassName = trx.flag_color ? `mod-${trx.flag_color}` : ''
  const modClassName = isSelected ? 'mod-selected' : ''

  const subsElement = trx.subtransactions.length > 0 ? <div>{JSON.stringify(trx.subtransactions)}</div> : null

  const memoElement = trx.memo ? <span className="ml-3 inline-block text-sm text-gray-600">– {trx.memo}</span> : null

  const selectedElement = isSelected ? (
    <div className="m-transactionsList-item-selectedIcon">
      <CircleIcon />
    </div>
  ) : null

  return (
    <li className={`m-transactionsList-item ${modClassName} p-1`} {...other}>
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
        <div className="flex-col justify-between text-right">
          <div>
            {dateFormatter.format(new Date(trx.date))}
            <br />
            {getCategoryName(trx.category_id)}
          </div>
          {selectedElement}
        </div>
      </div>
    </li>
  )
}

export default TransactionsListItem
