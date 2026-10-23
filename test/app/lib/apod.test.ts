import { describe, it, expect } from 'vitest'
import { getApodByDate, getApodPage } from '@/app/lib/apod'
import { InvalidDataError, NotFoundError } from '@/domain/shared/errors'

describe('getApodByDate', () => {
  it('returns the APOD for an existing date', async () => {
    const result = await getApodByDate('2026-10-23')

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.title).toBe('Andromeda in Southern Spring')
    }
  })

  it('returns NotFoundError for a date without an APOD', async () => {
    const result = await getApodByDate('2026-12-31')

    expect(result.isError()).toBe(true)
    if (result.isError()) {
      expect(result.value).toBeInstanceOf(NotFoundError)
    }
  })

  it.each(['2026-02-30', '261023', '2026/10/23', ''])('returns InvalidDataError for "%s"', async (date) => {
    const result = await getApodByDate(date)

    expect(result.isError()).toBe(true)
    if (result.isError()) {
      expect(result.value).toBeInstanceOf(InvalidDataError)
      expect((result.value as InvalidDataError).field).toBe('date')
    }
  })
})

describe('getApodPage', () => {
  it('lists every APOD, newest first, with the default paging', async () => {
    const result = await getApodPage()

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.page).toBe(1)
      expect(result.value.per_page).toBe(25)
      expect(result.value.total).toBe(5)
      expect(result.value.items.map((item) => item.post_id)).toEqual([1499061, 1497603, 1499050, 1258485, 1200001])
    }
  })

  it('filters by an inclusive date range', async () => {
    const result = await getApodPage({ start_date: '2026-10-01', end_date: '2026-10-31' })

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.total).toBe(3)
      expect(result.value.items.map((item) => item.post_id)).toEqual([1499061, 1497603, 1499050])
    }
  })

  it('returns the requested page', async () => {
    const result = await getApodPage({ page: 2, per_page: 2 })

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.total_pages).toBe(3)
      expect(result.value.items.map((item) => item.post_id)).toEqual([1499050, 1258485])
    }
  })

  it.each(['start_date', 'end_date'] as const)('returns InvalidDataError for a bad %s', async (field) => {
    const result = await getApodPage({ [field]: '2026-1-1' })

    expect(result.isError()).toBe(true)
    if (result.isError()) {
      expect(result.value).toBeInstanceOf(InvalidDataError)
      expect((result.value as InvalidDataError).field).toBe(field)
    }
  })
})
