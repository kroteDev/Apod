import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const GLOBALS = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8')

// Palette from the old project (.references/Apod-nextjs/src/app/globals.css),
// with grey-light (old "paragraph") and grey-dark added.
const EXPECTED_COLORS: Record<string, string> = {
  'nasa-blue': '#0b3d91',
  'nasa-blue-light': '#3357e6',
  'nasa-red': '#db362d',
  'gradient-1': '#001841',
  'gradient-2': '#0b3d91',
  'site-background': '#f9f9f9',
  'grey-light': '#54595f',
  'grey-dark': '#333333',
}

function block(css: string, selector: string): string {
  const match = css.match(new RegExp(`${selector}\\s*\\{([^}]*)\\}`))
  return match ? match[1] : ''
}

function declarations(body: string): Record<string, string> {
  const entries: Record<string, string> = {}

  for (const match of body.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    entries[match[1]] = match[2].trim().toLowerCase()
  }

  return entries
}

describe('theme colors', () => {
  it('defines exactly the expected palette as CSS variables in :root', () => {
    expect(declarations(block(GLOBALS, ':root'))).toEqual(EXPECTED_COLORS)
  })

  it('maps every color to a utility through @theme inline', () => {
    const mapped = declarations(block(GLOBALS, '@theme inline'))
    const expected = Object.fromEntries(
      Object.keys(EXPECTED_COLORS).map((name) => [`color-${name}`, `var(--${name})`]),
    )

    expect(Object.fromEntries(Object.entries(mapped).filter(([key]) => key.startsWith('color-')))).toEqual(expected)
  })
})
