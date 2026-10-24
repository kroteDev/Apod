import { describe, it, expect } from 'vitest'
import { truncateText } from '@/utils/truncate-string'

describe('truncateText', () => {
  it('returns the text unchanged when it fits', () => {
    expect(truncateText('short text', 500)).toBe('short text')
  })

  it('returns the text unchanged when it has exactly the max length', () => {
    expect(truncateText('abcde', 5)).toBe('abcde')
  })

  it('cuts at the last space before the limit and adds an ellipsis', () => {
    expect(truncateText('one two three four', 10)).toBe('one two...')
  })

  it('cuts at the limit when there is no space to cut at', () => {
    expect(truncateText('abcdefghijklmnop', 5)).toBe('abcde...')
  })

  it('cuts at the limit when the only spaces come after it', () => {
    expect(truncateText('abcdefghij klm', 5)).toBe('abcde...')
  })

  it('defaults to 500 characters', () => {
    const text = 'a'.repeat(499) + ' ' + 'b'.repeat(100)

    expect(truncateText(text)).toBe(`${'a'.repeat(499)}...`)
  })
})
