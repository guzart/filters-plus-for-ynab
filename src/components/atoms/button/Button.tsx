import { PropsWithChildren } from 'react'
import './Button.scss'

type Props = PropsWithChildren<{
  href?: string
}>

function Button(props: Props) {
  const { children, href, ...other } = props
  if (href) {
    return (
      <a href={href} className="a-button">
        {children}
      </a>
    )
  }

  return (
    <button className="a-button" {...other}>
      {children}
    </button>
  )
}

export default Button
