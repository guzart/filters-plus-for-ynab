import { PropsWithRef } from 'react'
import './Toggle.scss'

type Props = PropsWithRef<{
  label: string
  value: boolean
  onChange: (checked: boolean) => any
}>

function Toggle(props: Props) {
  return (
    <button
      type="button"
      className="a-toggle"
      role="switch"
      aria-checked={props.value}
      onClick={() => props.onChange(!props.value)}
    >
      <span className="sr-only">{props.label}</span>
      <span aria-hidden="true" className="a-toggle-head" data-checked={props.value}></span>
    </button>
  )
}

export default Toggle
