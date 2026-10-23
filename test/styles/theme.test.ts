import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import tailwindConfig from '../../tailwind.config.mjs'

const GLOBALS = readFileSync(fileURLToPath(new URL('../../app/globals.css', import.meta.url)), 'utf8')

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

describe('theme colors', () => {
  it('defines exactly the expected palette in tailwind.config.mjs', () => {
    expect(tailwindConfig.theme.extend.colors).toEqual(EXPECTED_COLORS)
  })

  it('loads the tailwind config from globals.css', () => {
    expect(GLOBALS).toContain('@config "../tailwind.config.mjs"')
  })

  it('does not keep the template light/dark variables', () => {
    expect(GLOBALS).not.toContain('prefers-color-scheme')
    expect(GLOBALS).not.toContain('--background')
    expect(GLOBALS).not.toContain('--foreground')
  })
})
