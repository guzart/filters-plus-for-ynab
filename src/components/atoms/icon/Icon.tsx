import './Icon.css'

import CircleCheck from './circle-check.svg'
import { PropsWithoutRef } from 'react'

enum IconName {
  circleCheck = 'circle-check',
}

type Props = PropsWithoutRef<{ className?: string; name: keyof typeof IconName }>

function Icon(props: Props) {
  return <CircleCheck className={`a-icon ${props.className || ''}`} />
}

export default Icon
