import { HTMLProps } from 'react'
import './CardSection.css'

type Props = HTMLProps<HTMLDivElement>

function CardSection(props: Props) {
  const { className, ...other } = props
  return <div className={`a-card-section ${className || ''}`} {...other}></div>
}

export default CardSection
