import { describe, it, expect } from 'vitest'
import { ApodInMemoryRepository } from '@/repositories/inMemory/ApodInMemoryRepository'
import { NotFoundError } from '@/domain/shared/errors'

describe('ApodInMemoryRepository', () => {
  const repository = new ApodInMemoryRepository()

  it('findByDate returns the matching entry', async () => {
    const result = await repository.findByDate('2026-07-03')

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.title).toBe('Three Galaxies in Pavo')
    }
  })

  it('findByDate returns NotFoundError for an unknown date', async () => {
    const result = await repository.findByDate('1990-01-01')

    expect(result.isError() && result.value instanceof NotFoundError).toBe(true)
  })

  it('findMany returns the newest entries first with paging metadata', async () => {
    const result = await repository.findMany(undefined, undefined, 1, 2)

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.items.map((item) => item.date.toISOString().slice(0, 10))).toEqual(['2026-10-23', '2026-10-22'])
      expect(result.value.total).toBe(5)
      expect(result.value.total_pages).toBe(3)
    }
  })

  it('findMany filters by an inclusive range', async () => {
    const result = await repository.findMany('2026-07-01', '2026-10-16', 1, 25)

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.items.map((item) => item.title)).toEqual([
        'Chasing the International Space Station',
        'Three Galaxies in Pavo',
      ])
      expect(result.value.total).toBe(2)
    }
  })

  it('findMany returns an empty page past the last result', async () => {
    const result = await repository.findMany(undefined, undefined, 5, 2)

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.items).toEqual([])
      expect(result.value.total).toBe(5)
    }
  })
})
