import { describe, it, expect, afterEach, vi } from 'vitest'
import { ApodRepository } from '../../repositories/ApodRepository'
import { ApodInMemoryRepository } from '../../repositories/inMemory/ApodInMemoryRepository'
import { NasaApiRepository } from '../../repositories/NasaApi/NasaApiRepository'

describe('ApodRepository.getInstance', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('uses the in-memory repository in test', () => {
    vi.stubEnv('NODE_ENV', 'test')
    expect(ApodRepository.getInstance()).toBeInstanceOf(ApodInMemoryRepository)
  })

  it('uses the NASA API repository in production and development', () => {
    vi.stubEnv('NODE_ENV', 'production')
    expect(ApodRepository.getInstance()).toBeInstanceOf(NasaApiRepository)

    vi.stubEnv('NODE_ENV', 'development')
    expect(ApodRepository.getInstance()).toBeInstanceOf(NasaApiRepository)
  })
})
