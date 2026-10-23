import { describe, it, expect, vi } from 'vitest'
import { NasaApiRepository } from '../../repositories/NasaApi/NasaApiRepository'
import { IApodApiClient } from '../../domain/shared/IApodApiClient'
import { success, error } from '../../domain/shared/result'
import { InternalServerError, NotFoundError } from '../../domain/shared/errors'
import { IMAGE_RAW, YOUTUBE_RAW } from '../fixtures/apod-raw'

function fakeClient(overrides: Partial<IApodApiClient> = {}): IApodApiClient {
  return {
    getByDate: vi.fn<IApodApiClient['getByDate']>(async () => success(IMAGE_RAW)),
    getList: vi.fn<IApodApiClient['getList']>(async () => success({ items: [IMAGE_RAW, YOUTUBE_RAW], total: 31, total_pages: 2 })),
    ...overrides,
  }
}

describe('NasaApiRepository', () => {
  it('findByDate maps the raw response to the domain DTO', async () => {
    const client = fakeClient()
    const repository = new NasaApiRepository(client)

    const result = await repository.findByDate('2026-07-03')

    expect(client.getByDate).toHaveBeenCalledWith('2026-07-03')
    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.title).toBe('Three Galaxies in Pavo')
      expect(result.value.explanation).not.toContain('<')
    }
  })

  it('findByDate propagates a NotFoundError', async () => {
    const client = fakeClient({
      getByDate: vi.fn<IApodApiClient['getByDate']>(async () => error(new NotFoundError('2026-12-31'))),
    })
    const repository = new NasaApiRepository(client)

    const result = await repository.findByDate('2026-12-31')

    expect(result.isError() && result.value instanceof NotFoundError).toBe(true)
  })

  it('findMany forwards the range and paging and returns a page', async () => {
    const client = fakeClient()
    const repository = new NasaApiRepository(client)

    const result = await repository.findMany('2026-01-01', '2026-01-31', 2, 10)

    expect(client.getList).toHaveBeenCalledWith('2026-01-01', '2026-01-31', 2, 10)
    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.page).toBe(2)
      expect(result.value.per_page).toBe(10)
      expect(result.value.total).toBe(31)
      expect(result.value.total_pages).toBe(2)
      expect(result.value.items.map((item) => item.video_type)).toEqual([null, 'youtube'])
    }
  })

  it('findMany defaults to the first page of 25 when no arguments are given', async () => {
    const client = fakeClient()
    const repository = new NasaApiRepository(client)

    await repository.findMany()

    expect(client.getList).toHaveBeenCalledWith(undefined, undefined, 1, 25)
  })

  it('findMany propagates client errors', async () => {
    const client = fakeClient({
      getList: vi.fn<IApodApiClient['getList']>(async () => error(new InternalServerError('down'))),
    })
    const repository = new NasaApiRepository(client)

    const result = await repository.findMany()

    expect(result.isError() && result.value instanceof InternalServerError).toBe(true)
  })
})
