import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { proxy } from '@/proxy'
import { defaultLocale, supportedLocales } from '@/helpers/internationalization'

const BASE = 'http://localhost:3000'

function run(path: string) {
  return proxy(new NextRequest(new URL(path, BASE)))
}

function redirectTarget(path: string): string | null {
  return run(path).headers.get('location')
}

describe('proxy locale redirects', () => {
  it('redirects the root to the default locale', () => {
    expect(redirectTarget('/')).toBe(`${BASE}/${defaultLocale}`)
  })

  it('redirects a path without locale to the default locale', () => {
    expect(redirectTarget('/about')).toBe(`${BASE}/${defaultLocale}/about`)
  })

  it('redirects an unknown locale-like prefix to the default locale', () => {
    expect(redirectTarget('/xx-YY/about')).toBe(`${BASE}/${defaultLocale}/xx-YY/about`)
  })

  it('keeps the query string when redirecting', () => {
    expect(redirectTarget('/about?page=2')).toBe(`${BASE}/${defaultLocale}/about?page=2`)
  })

  it.each(supportedLocales)('lets %s paths through', (locale) => {
    const response = run(`/${locale}/about`)

    expect(response.headers.get('location')).toBeNull()
    expect(response.status).toBe(200)
  })

  it.each(supportedLocales)('redirects the short language prefix of %s to the full locale', (locale) => {
    const language = locale.split('-')[0]
    expect(redirectTarget(`/${language}/about?x=1`)).toBe(`${BASE}/${locale}/about?x=1`)
  })
})
