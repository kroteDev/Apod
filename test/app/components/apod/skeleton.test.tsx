import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { ApodCardSkeleton, ApodDetailSkeleton, ApodSkeleton } from '@/app/components/apod/skeleton'

describe('ApodSkeleton', () => {
  it('is hidden from assistive tech and pulses', () => {
    const html = renderToStaticMarkup(<ApodSkeleton className="h-4 w-full" />)

    expect(html).toContain('aria-hidden="true"')
    expect(html).toContain('animate-pulse')
    expect(html).toContain('h-4 w-full')
  })
})

describe('ApodDetailSkeleton', () => {
  it('mirrors the detail card and is hidden from assistive tech', () => {
    const html = renderToStaticMarkup(<ApodDetailSkeleton />)

    expect(html).toContain('<article')
    expect(html).toContain('aria-hidden="true"')
    expect(html).toContain('max-w-5xl')
    expect(html.match(/animate-pulse/g)?.length).toBeGreaterThan(5)
  })
})

describe('ApodCardSkeleton', () => {
  it('mirrors the card layout with an image half and a text half', () => {
    const html = renderToStaticMarkup(<ApodCardSkeleton />)

    expect(html).toContain('apod-card')
    expect(html).toContain('image-wrapper')
    expect(html).toContain('info')
    expect(html).toContain('aria-hidden="true"')
  })
})
