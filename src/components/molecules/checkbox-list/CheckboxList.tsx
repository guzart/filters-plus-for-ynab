import { MouseEvent, PropsWithoutRef, useMemo, useRef, useState } from 'react'
import { Button } from '@radix-ui/themes'
import compact from 'lodash/compact'

import './CheckboxList.css'

interface Item {
  id: string
  name: string
}

export type CheckboxListAction =
  | { type: 'toggle'; id: string }
  | { type: 'add'; ids: string[] }
  | { type: 'remove'; ids: string[] }
  | { type: 'set'; ids: string[] }

type Props = PropsWithoutRef<{
  className?: string
  listClassName?: string
  id: string
  name: string
  label: string
  labelClassName?: string
  description?: string
  items: Item[]
  value: Set<string>
  onChange: (action: CheckboxListAction) => void
}>

function CheckboxList(props: Props) {
  const refContainer = useRef<HTMLDivElement>(null)
  const [lastTarget, setLastTarget] = useState(null as HTMLInputElement | null)
  const [searchQuery, setSearchQuery] = useState('')

  const descriptionElement = props.description ? <p className="text-gray-500">{props.description}</p> : null

  const searchResults = useMemo(() => {
    if (!props.items) {
      return []
    }

    return props.items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [props.items, searchQuery])

  function handleOnChange() {
    // No op. Used to make checkbox mutable
  }

  function handleContainerClick(event: MouseEvent) {
    const target = event.target
    if (refContainer.current && target instanceof HTMLInputElement) {
      if (event.shiftKey && lastTarget) {
        const allInputs = Array.from(refContainer.current.querySelectorAll('.m-checkboxList-input'))
        const targetIndex = allInputs.indexOf(target)
        const lastTargetIndex = allInputs.indexOf(lastTarget)
        const fromIndex = Math.min(targetIndex, lastTargetIndex)
        const toIndex = Math.max(targetIndex, lastTargetIndex)
        const rangeIds = compact(allInputs.slice(fromIndex, toIndex + 1).map((input) => input.getAttribute('value')))

        if (target.checked) {
          props.onChange({ type: 'add', ids: rangeIds })
        } else {
          props.onChange({ type: 'remove', ids: rangeIds })
        }
      } else {
        props.onChange({ type: 'toggle', id: target.value })
      }

      setLastTarget(target)
    }
  }

  return (
    <div className={props.className}>
      {/* Check all */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => props.onChange({ type: 'set', ids: props.items.map((item) => item.id) })}
        >
          Select All
        </Button>
        <Button variant="ghost" onClick={() => props.onChange({ type: 'set', ids: [] })}>
          Deselect All
        </Button>
        <div>
          <input
            type="search"
            placeholder="Search by..."
            className="m-checkboxList-search"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div ref={refContainer} className={`mt-4 space-y-4 ${props.listClassName || ''}`} onClick={handleContainerClick}>
        {searchResults.map((item) => (
          <div className="relative flex items-start" key={item.id}>
            <div className="flex h-5 items-center">
              <input
                name={props.name}
                id={`${props.id}-${item.id}`}
                value={item.id}
                type="checkbox"
                className="m-checkboxList-input"
                checked={props.value.has(item.id)}
                onChange={handleOnChange}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor={`${props.id}-${item.id}`} className="font-medium text-gray-700">
                {item.name}
              </label>
              {descriptionElement}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CheckboxList
