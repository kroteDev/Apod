import { ApodApiClient } from '@/infrastructure/http/ApodApiClient'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('ApodApiClient', () => {
  const OLD_ENV = { ...process.env }

  beforeEach(() => {
    process.env.APOD_BASE_URL = 'https://apod.test'
    process.env.APOD_API_BASE_URL = 'https://api.apod.test'
    process.env.NASA_API_KEY = 'test-key-123'
  })

  afterEach(() => {
    process.env = { ...OLD_ENV }
    vi.unstubAllGlobals()
  })

  it('fetches APODs for a date range', async () => {
    const fetchMock = vi.fn(async () => ({
      status: 200,
      json: async () => [
        { title: 'A', date: '2024-01-01', url: 'https://example.com/a.jpg', media_type: 'image' },
        { title: 'B', date: '2024-01-02', url: 'https://example.com/b.jpg', media_type: 'image' }
      ]
    }))

    vi.stubGlobal('fetch', fetchMock)

    const client = new ApodApiClient()
    const result = await client.getByDateRange('2024-01-01', '2024-01-02')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.apod.test/planetary/apod?start_date=2024-01-01&end_date=2024-01-02&api_key=test-key-123',
      expect.objectContaining({ method: 'GET' })
    )
    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value).toHaveLength(2)
    }
  })

  it('fetches a random set of APODs', async () => {
    const fetchMock = vi.fn(async () => ({
      status: 200,
      json: async () => [
        { title: 'Random 1', date: '2024-01-03', url: 'https://example.com/r1.jpg', media_type: 'image' },
        { title: 'Random 2', date: '2024-01-04', url: 'https://example.com/r2.jpg', media_type: 'image' }
      ]
    }))

    vi.stubGlobal('fetch', fetchMock)

    const client = new ApodApiClient()
    const result = await client.getRandom(2)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.apod.test/planetary/apod?count=2&api_key=test-key-123',
      expect.objectContaining({ method: 'GET' })
    )
    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value).toHaveLength(2)
    }
  })
})
