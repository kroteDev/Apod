import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getDictionary } from '@/helpers/internationalization/get-dictionary'
import { defaultLocale, supportedLocales } from '@/helpers/internationalization'

const DICTIONARIES_DIR = join(process.cwd(), 'resources/dictionaries/')

function fileFor(locale: string): string {
  return `${DICTIONARIES_DIR}${locale.replace('-', '_')}.json`
}

function readDictionary(locale: string): Record<string, unknown> {
  return JSON.parse(readFileSync(fileFor(locale), 'utf8'))
}

function flatten(value: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  return Object.entries(value).reduce<Record<string, unknown>>((acc, [key, entry]) => {
    const path = prefix ? `${prefix}.${key}` : key

    if (entry && typeof entry === 'object') {
      return { ...acc, ...flatten(entry as Record<string, unknown>, path) }
    }

    return { ...acc, [path]: entry }
  }, {})
}

describe('getDictionary', () => {
  it.each(supportedLocales)('loads the %s dictionary', async (locale) => {
    const dictionary = await getDictionary(locale)
    expect(dictionary).toEqual(readDictionary(locale))
  })

  it('falls back to the default locale for an unsupported locale', async () => {
    const dictionary = await getDictionary('xx-YY')
    expect(dictionary).toEqual(readDictionary(defaultLocale))
  })
})

describe('dictionary files', () => {
  it.each(supportedLocales)('has a dictionary file for %s', (locale) => {
    expect(existsSync(fileFor(locale))).toBe(true)
  })

  it.each(supportedLocales)('has the same keys in %s as in the default locale', (locale) => {
    const expected = Object.keys(flatten(readDictionary(defaultLocale))).sort()
    const actual = Object.keys(flatten(readDictionary(locale))).sort()

    const missing = expected.filter((key) => !actual.includes(key))
    const extra = actual.filter((key) => !expected.includes(key))

    expect({ missing, extra }).toEqual({ missing: [], extra: [] })
  })

  it.each(supportedLocales)('has only non-empty text in %s', (locale) => {
    const entries = Object.entries(flatten(readDictionary(locale)))
    const invalid = entries.filter(([, value]) => typeof value !== 'string' || value.trim() === '')

    expect(invalid).toEqual([])
  })
})
