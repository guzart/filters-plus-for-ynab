import { HTMLProps } from 'react'

import './Card.css'

type Props = HTMLProps<HTMLDivElement>

function Card(props: Props) {
  const { className, ...other } = props
  return <div className={`a-panel ${className || ''}`} {...other}></div>
}

export default Card
