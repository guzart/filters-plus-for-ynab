import { HTMLProps } from 'react'

import './SectionTitle.scss'

type Props = HTMLProps<HTMLHeadingElement>

function SectionTitle(props: Props) {
  const { className } = props
  return <h2 className={`a-sectionTitle ${className || ''}`} {...props}></h2>
}

export default SectionTitle
