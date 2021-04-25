import { MouseEvent, PropsWithoutRef, useRef, useState } from 'react'
import compact from 'lodash/compact'
import './CheckboxList.scss'

interface Item {
  id: string
  name: string
}

interface Selection {
  selectedIds: Set<string>
}

type Props = PropsWithoutRef<{
  className?: string
  listClassName?: string
  id: string
  name: string
  label: string
  description?: string
  items: Item[]
  value: Set<string>
  onChange: (selection: Selection) => void
}>

function CheckboxList(props: Props) {
  const refContainer = useRef<HTMLDivElement>(null)
  const [lastTarget, setLastTarget] = useState(null as HTMLInputElement | null)

  const descriptionElement = props.description ? <p className="text-gray-500">{props.description}</p> : null

  function handleContainerClick(event: MouseEvent) {
    const target = event.target
    if (refContainer.current && target instanceof HTMLInputElement) {
      if (event.shiftKey && lastTarget) {
        const allInputs = Array.from(refContainer.current.querySelectorAll('.m-checkboxList-input'))
        const targetIndex = allInputs.indexOf(target)
        const lastTargetIndex = allInputs.indexOf(lastTarget)
        const fromIndex = Math.min(targetIndex, lastTargetIndex)
        const toIndex = Math.max(targetIndex, lastTargetIndex)
        const rangeValues = compact(
          allInputs.slice(fromIndex, toIndex + 1).map((input) => input.getAttribute('value')),
        )

        if (target.checked) {
          // is selection
          const selectedIds = new Set(Array.from(props.value).concat(rangeValues))
          props.onChange({ selectedIds })
        } else {
          const rangeIds = new Set(rangeValues)
          const selectedIds = new Set(Array.from(props.value).filter((c) => !rangeIds.has(c)))
          props.onChange({ selectedIds })
        }
      } else {
        const checkedInputs = refContainer.current.querySelectorAll('.m-checkboxList-input:checked')
        const selectedIds = compact(Array.from(checkedInputs).map((input) => input.getAttribute('value')))
        props.onChange({ selectedIds: new Set(selectedIds) })
      }

      setLastTarget(target)
    }
  }

  return (
    <div className={props.className}>
      <div className="m-checkboxList-label">
        {props.label}({props.value.size}/{props.items.length})
      </div>
      <div
        ref={refContainer}
        className={`mt-4 space-y-4 pl-4 ${props.listClassName || ''}`}
        onClick={handleContainerClick}
      >
        {props.items.map((item) => (
          <div className="relative flex items-start" key={item.id}>
            <div className="flex items-center h-5">
              <input
                name={props.name}
                id={`${props.id}-${item.id}`}
                value={item.id}
                type="checkbox"
                className="m-checkboxList-input"
                checked={props.value.has(item.id)}
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
