import { MouseEvent, PropsWithoutRef, useRef, useState } from 'react'
import type * as t from '../../../lib/ynab-api/types'
import TransactionsListItem from './TransactionItem'

import './TransactionsList.scss'

type Props = PropsWithoutRef<{
  className?: string
  getCategoryName: (categoryId: string) => string
  transactions: t.TransactionSummary[]
  onSelect?: (transactionIds: string[], targetId: string) => void
  selectedTransactionIds?: Set<string>
}>

const ITEM_SELECTOR = '.m-transactionsList-item'

function TransactionsList(props: Props) {
  const refList = useRef<HTMLUListElement>(null)
  const [lastTarget, setLastTarget] = useState(null as HTMLElement | null)

  function handleClick(event: MouseEvent, transaction: t.TransactionSummary) {
    const { target } = event
    if (props.onSelect && target instanceof HTMLElement) {
      let selectedIds = [transaction.id]
      const itemTarget = target.closest(ITEM_SELECTOR)
      if (refList.current && itemTarget instanceof HTMLElement) {
        if (event.shiftKey && lastTarget) {
          event.preventDefault()
          const items = Array.from(refList.current.querySelectorAll(ITEM_SELECTOR))
          const targetIndex = items.indexOf(itemTarget)
          const lastTargetIndex = items.indexOf(lastTarget)
          const fromIndex = Math.min(targetIndex, lastTargetIndex)
          const toIndex = Math.max(targetIndex, lastTargetIndex)
          selectedIds = props.transactions.slice(fromIndex, toIndex + 1).map((trx) => trx.id)
        }

        setLastTarget(itemTarget)
      }

      props.onSelect(selectedIds, transaction.id)
    }
  }

  return (
    <div className={`m-transactionsList ${props.className || ''}`}>
      <ul ref={refList} className="m-transactionsList-container">
        {props.transactions.map((trx) => (
          <TransactionsListItem
            key={trx.id}
            transaction={trx}
            getCategoryName={props.getCategoryName}
            onClick={(event) => handleClick(event, trx)}
            isSelected={props.selectedTransactionIds?.has(trx.id)}
          />
        ))}
      </ul>
    </div>
  )
}

export default TransactionsList
