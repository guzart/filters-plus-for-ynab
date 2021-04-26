import { HTMLProps } from 'react'

import './SectionTitle.scss'

type Props = HTMLProps<HTMLHeadingElement>

function SectionTitle(props: Props) {
  const { className, children, ...other } = props
  return (
    <h2 className={`a-sectionTitle ${className || ''}`} {...other}>
      {children}
    </h2>
  )
}

export default SectionTitle
