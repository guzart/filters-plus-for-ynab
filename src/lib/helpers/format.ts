import padStart from 'lodash/padStart'

export function toUTCDateString(date: Date | null) {
  if (!date) {
    return ''
  }

  const month = padStart((date.getUTCMonth() + 1).toString(), 2, '0')
  const day = padStart(date.getUTCDate().toString(), 2, '0')
  return `${date.getUTCFullYear()}-${month}-${day}`
}
