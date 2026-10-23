import { ApodApiClient } from '@/infrastructure/http/ApodApiClient'
import { NotFoundError, InternalServerError, UnauthorizedServerError, InvalidDataError } from '@/domain/shared/errors'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { IMAGE_RAW } from '../fixtures/apod-raw'

const BASE = 'https://science.nasa.gov/wp-json/wp/v2/apod-basic'

function jsonResponse(status: number, body: unknown, headers: Record<string, string> = {}) {
  return {
    status,
    headers: new Headers(headers),
    json: async () => body,
  }
}

function fetchCalls(fetchMock: ReturnType<typeof vi.fn>): string[] {
  return fetchMock.mock.calls.map((call) => String(call[0]))
}

describe('ApodApiClient', () => {
  const OLD_ENV = { ...process.env }

  beforeEach(() => {
    process.env.APOD_BASE_URL = 'https://apod.test'
    process.env.APOD_API_BASE_URL = BASE
    delete process.env.NASA_API_KEY
  })

  afterEach(() => {
    process.env = { ...OLD_ENV }
    vi.unstubAllGlobals()
  })

  describe('getByDate', () => {
    it('requests the legacy YYMMDD path without an api_key', async () => {
      const fetchMock = vi.fn(async () => jsonResponse(200, IMAGE_RAW))
      vi.stubGlobal('fetch', fetchMock)

      const client = new ApodApiClient({ retryDelayMs: 0 })
      const result = await client.getByDate('2026-07-03')

      expect(fetchCalls(fetchMock)).toEqual([`${BASE}/260703`])
      expect(fetchMock).toHaveBeenCalledWith(
        `${BASE}/260703`,
        expect.objectContaining({ method: 'GET' })
      )
      expect(result.isSuccess()).toBe(true)
      if (result.isSuccess()) {
        expect(result.value.post_id).toBe(1258485)
      }
    })

    it('rejects an invalid date without calling the API', async () => {
      const fetchMock = vi.fn()
      vi.stubGlobal('fetch', fetchMock)

      const client = new ApodApiClient({ retryDelayMs: 0 })
      const result = await client.getByDate('2026-02-30')

      expect(fetchMock).not.toHaveBeenCalled()
      expect(result.isError() && result.value instanceof InvalidDataError).toBe(true)
    })

    it('maps a 404 to NotFoundError carrying the requested date', async () => {
      const fetchMock = vi.fn(async () => jsonResponse(404, { code: 'apod_basic_not_found' }))
      vi.stubGlobal('fetch', fetchMock)

      const client = new ApodApiClient({ retryDelayMs: 0 })
      const result = await client.getByDate('2026-12-31')

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(result.isError() && result.value instanceof NotFoundError).toBe(true)
      if (result.isError()) {
        expect(result.value.message).toBe('2026-12-31')
      }
    })

    it('maps a 401 to UnauthorizedServerError without retrying', async () => {
      const fetchMock = vi.fn(async () => jsonResponse(401, {}))
      vi.stubGlobal('fetch', fetchMock)

      const client = new ApodApiClient({ retryDelayMs: 0 })
      const result = await client.getByDate('2026-07-03')

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(result.isError() && result.value instanceof UnauthorizedServerError).toBe(true)
    })

    it('treats a payload without the required fields as invalid data', async () => {
      const fetchMock = vi.fn(async () => jsonResponse(200, { code: 'unexpected' }))
      vi.stubGlobal('fetch', fetchMock)

      const client = new ApodApiClient({ retryDelayMs: 0 })
      const result = await client.getByDate('2026-07-03')

      expect(result.isError() && result.value instanceof InvalidDataError).toBe(true)
    })

    it('uses a short cache window for recent dates and a long one for archive dates', async () => {
      const fetchMock = vi.fn(async () => jsonResponse(200, IMAGE_RAW))
      vi.stubGlobal('fetch', fetchMock)

      const client = new ApodApiClient({ retryDelayMs: 0 })
      const today = new Date().toISOString().slice(0, 10)

      await client.getByDate(today)
      await client.getByDate('1995-06-16')

      const [recentOptions] = fetchMock.mock.calls[0].slice(1)
      const [archiveOptions] = fetchMock.mock.calls[1].slice(1)
      expect(recentOptions).toEqual(expect.objectContaining({ next: { revalidate: 3600 } }))
      expect(archiveOptions).toEqual(expect.objectContaining({ next: { revalidate: 604800 } }))
    })
  })

  describe('getList', () => {
    it('sends the date range in legacy format with paging and reads the totals', async () => {
      const fetchMock = vi.fn(async () =>
        jsonResponse(200, [IMAGE_RAW, IMAGE_RAW], { 'x-wp-total': '31', 'x-wp-totalpages': '2' })
      )
      vi.stubGlobal('fetch', fetchMock)

      const client = new ApodApiClient({ retryDelayMs: 0 })
      const result = await client.getList('2026-01-01', '2026-01-31', 1, 25)

      expect(fetchCalls(fetchMock)).toEqual([
        `${BASE}/?page=1&per_page=25&date_from=260101&date_to=260131`,
      ])
      expect(result.isSuccess()).toBe(true)
      if (result.isSuccess()) {
        expect(result.value.items).toHaveLength(2)
        expect(result.value.total).toBe(31)
        expect(result.value.total_pages).toBe(2)
      }
    })

    it('requests the latest entries when no range is given', async () => {
      const fetchMock = vi.fn(async () => jsonResponse(200, [IMAGE_RAW], { 'x-wp-total': '11445', 'x-wp-totalpages': '458' }))
      vi.stubGlobal('fetch', fetchMock)

      const client = new ApodApiClient({ retryDelayMs: 0 })
      await client.getList(undefined, undefined, 2, 10)

      expect(fetchCalls(fetchMock)).toEqual([`${BASE}/?page=2&per_page=10`])
    })

    it('rejects a half-open range, a reversed range, or an invalid date without calling the API', async () => {
      const fetchMock = vi.fn()
      vi.stubGlobal('fetch', fetchMock)

      const client = new ApodApiClient({ retryDelayMs: 0 })

      const halfOpen = await client.getList('2026-01-01', undefined, 1, 25)
      const reversed = await client.getList('2026-01-31', '2026-01-01', 1, 25)
      const invalid = await client.getList('2026-01-01', '2026-99-01', 1, 25)

      for (const result of [halfOpen, reversed, invalid]) {
        expect(result.isError() && result.value instanceof InvalidDataError).toBe(true)
      }
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('rejects per_page above 25 and invalid pages', async () => {
      const fetchMock = vi.fn()
      vi.stubGlobal('fetch', fetchMock)

      const client = new ApodApiClient({ retryDelayMs: 0 })

      const tooMany = await client.getList(undefined, undefined, 1, 26)
      const badPage = await client.getList(undefined, undefined, 0, 25)

      expect(tooMany.isError() && tooMany.value instanceof InvalidDataError).toBe(true)
      expect(badPage.isError() && badPage.value instanceof InvalidDataError).toBe(true)
      expect(fetchMock).not.toHaveBeenCalled()
    })

    it('rejects a list payload that contains an invalid entry', async () => {
      const fetchMock = vi.fn(async () => jsonResponse(200, [IMAGE_RAW, { title: 'broken' }]))
      vi.stubGlobal('fetch', fetchMock)

      const client = new ApodApiClient({ retryDelayMs: 0 })
      const result = await client.getList(undefined, undefined, 1, 25)

      expect(result.isError() && result.value instanceof InvalidDataError).toBe(true)
    })
  })

  describe('retries and failures', () => {
    it('retries a 500 and succeeds on the next attempt', async () => {
      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce(jsonResponse(500, {}))
        .mockResolvedValueOnce(jsonResponse(200, IMAGE_RAW))
      vi.stubGlobal('fetch', fetchMock)

      const client = new ApodApiClient({ retryDelayMs: 0 })
      const result = await client.getByDate('2026-07-03')

      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(result.isSuccess()).toBe(true)
    })

    it('gives up after the configured attempts and returns InternalServerError', async () => {
      const fetchMock = vi.fn(async () => jsonResponse(503, {}))
      vi.stubGlobal('fetch', fetchMock)

      const client = new ApodApiClient({ attempts: 3, retryDelayMs: 0 })
      const result = await client.getByDate('2026-07-03')

      expect(fetchMock).toHaveBeenCalledTimes(3)
      expect(result.isError() && result.value instanceof InternalServerError).toBe(true)
    })

    it('retries network errors and reports InternalServerError when they persist', async () => {
      const fetchMock = vi.fn(async () => {
        throw new Error('socket hang up')
      })
      vi.stubGlobal('fetch', fetchMock)

      const client = new ApodApiClient({ attempts: 3, retryDelayMs: 0 })
      const result = await client.getList(undefined, undefined, 1, 25)

      expect(fetchMock).toHaveBeenCalledTimes(3)
      expect(result.isError() && result.value instanceof InternalServerError).toBe(true)
    })

    it('does not retry a 400 response', async () => {
      const fetchMock = vi.fn(async () => jsonResponse(400, { code: 'rest_invalid_param' }))
      vi.stubGlobal('fetch', fetchMock)

      const client = new ApodApiClient({ retryDelayMs: 0 })
      const result = await client.getList(undefined, undefined, 1, 25)

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(result.isError() && result.value instanceof InvalidDataError).toBe(true)
    })
  })
})
