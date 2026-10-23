import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { getSiteConfig } from '../../helpers/get-site-config'

describe('getSiteConfig', () => {
  const OLD_ENV = { ...process.env }

  beforeEach(() => {
    process.env.APOD_BASE_URL = 'https://apod.test'
    process.env.APOD_API_BASE_URL = 'https://api.apod.test'
    process.env.NASA_API_KEY = 'test-key-123'
  })

  afterEach(() => {
    process.env = { ...OLD_ENV }
  })

  it('loads site configuration from environment variables', () => {
    const cfg = getSiteConfig()
    expect(cfg).toBeDefined()
    expect(cfg.nasa_config.apod_url).toBe('https://apod.test')
    expect(cfg.nasa_config.api_url).toBe('https://api.apod.test')
    expect(cfg.nasa_config.api_key).toBe('test-key-123')
  })

  it('returns undefined when environment variables are missing', () => {
    delete process.env.APOD_BASE_URL
    delete process.env.APOD_API_BASE_URL
    delete process.env.NASA_API_KEY

    const cfg = getSiteConfig()
    expect(cfg.nasa_config.apod_url).toBeUndefined()
    expect(cfg.nasa_config.api_url).toBeUndefined()
    expect(cfg.nasa_config.api_key).toBeUndefined()
  })

  it('returns empty strings when environment variables are empty', () => {
    process.env.APOD_BASE_URL = ''
    process.env.APOD_API_BASE_URL = ''
    process.env.NASA_API_KEY = ''

    const cfg = getSiteConfig()
    expect(cfg.nasa_config.apod_url).toBe('')
    expect(cfg.nasa_config.api_url).toBe('')
    expect(cfg.nasa_config.api_key).toBe('')
  })

  it('returns the raw value when env var contains invalid URL format', () => {
    process.env.APOD_BASE_URL = 'not-a-url'
    const cfg = getSiteConfig()
    expect(cfg.nasa_config.apod_url).toBe('not-a-url')
  })
})
