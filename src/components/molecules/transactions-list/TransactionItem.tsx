import { HTMLProps } from 'react'
import { BookmarkFilledIcon, CheckCircledIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'

import { TransactionSummary } from '@/lib/ynab-api/types'
import './TransactionItem.css'
import { upperFirst } from 'lodash'

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

  const subsElement = trx.subtransactions.length > 0 ? <div>{JSON.stringify(trx.subtransactions)}</div> : null

  const memoElement = trx.memo ? <span className="ml-3 inline-block text-sm text-gray-600">– {trx.memo}</span> : null

  const selectedElement = isSelected ? (
    <span className="text-green-600">
      <CheckCircledIcon />
    </span>
  ) : null

  const className = clsx('relative block flex flex-row justify-between hover:bg-gray-50 p-1 py-2', {
    'bg-green-50': isSelected,
  })

  const flagElement = trx.flag_color ? (
    <span className={`m-transactionsListItem-flag mod-${trx.flag_color} inline-flex items-center text-sm`}>
      <BookmarkFilledIcon className="inline-block" />
      {upperFirst(trx.flag_color)}
    </span>
  ) : null

  return (
    <li className={className} {...other}>
      <div className="">
        <div>
          <span className="font-medium">{trx.payee_name}</span>
          {memoElement}
        </div>
        <div>{getCategoryName(trx.category_id)}</div>
        {subsElement}
        <div>
          {selectedElement} {flagElement}
        </div>
      </div>
      <div className="flex-col justify-between text-right">
        <div>{currencyFormatter.format(trx.amount / 1000)}</div>
        <div className="text-sm">{trx.account_name}</div>
        <div className="text-sm">{dateFormatter.format(new Date(trx.date))}</div>
      </div>
    </li>
  )
}

export default TransactionsListItem
