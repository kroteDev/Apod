import { describe, it, expect } from 'vitest'
import { htmlToText } from '@/utils/html-to-text'

describe('htmlToText', () => {
  it('returns null for empty input', () => {
    expect(htmlToText(undefined)).toBeNull()
    expect(htmlToText(null)).toBeNull()
    expect(htmlToText('')).toBeNull()
    expect(htmlToText('   ')).toBeNull()
  })

  it('removes tags and keeps the text', () => {
    expect(htmlToText('<strong>Explanation:</strong> Star light, <a href="https://example.com">star bright</a>.'))
      .toBe('Explanation: Star light, star bright.')
  })

  it('removes the anchor URLs so they never reach the output', () => {
    const result = htmlToText('<a href="https://evil.example/phish">Click here</a>')
    expect(result).toBe('Click here')
    expect(result).not.toContain('http')
  })

  it('decodes named and numeric entities', () => {
    expect(htmlToText('Image Credit &amp; Copyright: Ángel')).toBe('Image Credit & Copyright: Ángel')
    expect(htmlToText('Tomorrow&#039;s picture &#8211; APOD')).toBe("Tomorrow's picture – APOD")
    expect(htmlToText('Messier &lt;4&gt; &quot;cluster&quot;')).toBe('Messier <4> "cluster"')
    expect(htmlToText('&#x41;&#x1F30C;')).toBe('A🌌')
  })

  it('leaves unknown or invalid entities untouched', () => {
    expect(htmlToText('&unknown; &#99999999;')).toBe('&unknown; &#99999999;')
  })

  it('collapses whitespace, including non-breaking spaces and line breaks', () => {
    expect(htmlToText('one\u00a0\u00a0two<br><br>three\n\n four')).toBe('one two three four')
  })
})
