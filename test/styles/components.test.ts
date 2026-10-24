import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const GLOBALS = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8')

describe('shared component classes', () => {
  it('defines the button and metadata classes inside @layer components', () => {
    const layer = GLOBALS.match(/@layer components\s*\{([\s\S]*?)\n\}/)?.[1] ?? ''

    expect(layer).toContain('.btn-base')
    expect(layer).toContain('.metadata {')
    expect(layer).toContain('.metadata dt')
    expect(layer).toContain('.metadata dd')
  })
})
