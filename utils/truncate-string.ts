export function truncateText(text: string, maxLength = 500): string {
  if (text.length <= maxLength) {
    return text
  }

  const lastSpace = text.lastIndexOf(' ', maxLength)
  const cut = lastSpace === -1 ? maxLength : lastSpace

  return `${text.slice(0, cut)}...`
}
