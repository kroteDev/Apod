const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

export function toLegacyDate(isoDate: string): string | null {
  const match = ISO_DATE.exec(isoDate)

  if (!match) {
    return null
  }

  const [, year, month, day] = match
  const parsed = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))

  if (
    parsed.getUTCFullYear() !== Number(year) ||
    parsed.getUTCMonth() !== Number(month) - 1 ||
    parsed.getUTCDate() !== Number(day)
  ) {
    return null
  }

  return `${year.slice(2)}${month}${day}`
}
