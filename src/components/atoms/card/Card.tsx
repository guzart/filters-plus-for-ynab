import { HTMLProps } from 'react'

import './Card.scss'

type Props = HTMLProps<HTMLDivElement>

function Card(props: Props) {
  const { className, ...other } = props
  return <div className={`a-panel ${className || ''}`} {...other}></div>
}

export default Card
