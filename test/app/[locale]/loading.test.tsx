import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Loading from '@/app/[locale]/(home)/loading'

describe('home loading', () => {
  it('shows a detail skeleton followed by two card skeletons', () => {
    const html = renderToStaticMarkup(<Loading />)

    expect(html.match(/<article/g)?.length).toBe(3)
    expect(html.match(/apod-card/g)?.length).toBe(2)
    expect(html.match(/aria-hidden="true"/g)?.length).toBeGreaterThan(10)
  })
})
