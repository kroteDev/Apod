import { describe, it, expect } from 'vitest'
import { formatApodDate } from '@/utils/format-date'

describe('formatApodDate', () => {
  it('uses the day-first short format for pt-BR', () => {
    expect(formatApodDate(new Date('2026-07-03'), 'pt-BR')).toBe('03/07/2026')
  })

  it('uses the month-first short format for en-US', () => {
    expect(formatApodDate(new Date('2026-07-03'), 'en-US')).toBe('7/3/26')
  })

  it('keeps the UTC calendar day at the start of a year', () => {
    expect(formatApodDate(new Date('2026-01-01'), 'pt-BR')).toBe('01/01/2026')
    expect(formatApodDate(new Date('2026-01-01'), 'en-US')).toBe('1/1/26')
  })
})
