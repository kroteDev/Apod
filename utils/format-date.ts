export function formatApodDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeZone: 'UTC' }).format(date)
}
