import { describe, it, expect } from 'vitest'
import { GET } from '../../../../app/api/health/route'

describe('GET /api/health', () => {
  it('responds 200 with ok true', async () => {
    const response = GET()

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
  })
})
