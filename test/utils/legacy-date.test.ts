import { describe, it, expect } from 'vitest'
import { toLegacyDate } from '@/utils/legacy-date'

describe('toLegacyDate', () => {
  it('converts an ISO date to the YYMMDD legacy format', () => {
    expect(toLegacyDate('2026-10-23')).toBe('261023')
  })

  it('keeps leading zeros and handles 1990s dates', () => {
    expect(toLegacyDate('1995-06-16')).toBe('950616')
    expect(toLegacyDate('2001-01-05')).toBe('010105')
  })

  it('returns null for dates that do not exist', () => {
    expect(toLegacyDate('2026-02-30')).toBeNull()
    expect(toLegacyDate('2026-13-01')).toBeNull()
  })

  it('returns null for formats other than YYYY-MM-DD', () => {
    expect(toLegacyDate('2026-1-1')).toBeNull()
    expect(toLegacyDate('261023')).toBeNull()
    expect(toLegacyDate('2026/10/23')).toBeNull()
    expect(toLegacyDate('')).toBeNull()
  })
})
