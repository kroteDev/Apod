export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}
