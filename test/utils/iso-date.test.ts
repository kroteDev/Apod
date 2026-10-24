import { describe, it, expect } from 'vitest'
import { toIsoDate } from '@/utils/iso-date'

describe('toIsoDate', () => {
  it('returns the UTC calendar day as YYYY-MM-DD', () => {
    expect(toIsoDate(new Date('2026-07-03'))).toBe('2026-07-03')
  })

  it('keeps the day at the start of the year', () => {
    expect(toIsoDate(new Date('2026-01-01'))).toBe('2026-01-01')
  })
})
