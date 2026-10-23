const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '–',
  mdash: '—',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
}

function decodeEntity(match: string, entity: string): string {
  if (entity[0] === '#') {
    const isHex = entity[1] === 'x' || entity[1] === 'X'
    const codePoint = parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10)

    if (Number.isNaN(codePoint) || codePoint > 0x10ffff) {
      return match
    }

    return String.fromCodePoint(codePoint)
  }

  return NAMED_ENTITIES[entity.toLowerCase()] ?? match
}

export function htmlToText(html: string | null | undefined): string | null {
  if (!html) {
    return null
  }

  const text = html
    .replace(/<br\s*\/?>|<\/(p|div|li|h[1-6])>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&(#[xX][0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, decodeEntity)
    .replace(/\s+/g, ' ')
    .trim()

  return text || null
}
