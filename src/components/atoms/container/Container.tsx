import { HTMLProps } from 'react'

import './Container.css'

type Props = HTMLProps<HTMLDivElement>

function Container(props: Props) {
  const { className, children, ...other } = props
  return (
    <div className={`a-container ${className || ''}`} {...other}>
      {children}
    </div>
  )
}

export default Container
