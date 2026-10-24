import { describe, it, expect } from 'vitest'
import { defaultLocale, isLocaleLike, isSupportedLocale, supportedLocales } from '@/helpers/internationalization'

describe('internationalization config', () => {
  it('includes the default locale among the supported locales', () => {
    expect(supportedLocales).toContain(defaultLocale)
  })

  it('has no duplicated locales', () => {
    expect(new Set(supportedLocales).size).toBe(supportedLocales.length)
  })

  it.each(supportedLocales)('accepts %s as a supported locale', (locale) => {
    expect(isSupportedLocale(locale)).toBe(true)
  })

  it.each(['pt', 'en', 'PT-br', 'pt_BR', 'xx-YY', ''])('rejects "%s"', (value) => {
    expect(isSupportedLocale(value)).toBe(false)
  })

  it.each(['pt', 'de', 'fr-FR', 'pt-BR'])('treats "%s" as locale-like', (value) => {
    expect(isLocaleLike(value)).toBe(true)
  })

  it.each(['pt_BR', 'PT-br', 'fr-FRA', 'about', 'apod', ''])('does not treat "%s" as locale-like', (value) => {
    expect(isLocaleLike(value)).toBe(false)
  })
})
