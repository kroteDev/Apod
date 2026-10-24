import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { ApodMediaUnavailable } from '@/app/components/apod/apod-media-unavailable'
import { getDictionary } from '@/helpers/internationalization/get-dictionary'

describe('ApodMediaUnavailable', () => {
  it('shows the localized message', async () => {
    const pt = await getDictionary('pt-BR')
    const en = await getDictionary('en-US')

    expect(renderToStaticMarkup(<ApodMediaUnavailable dictionary={pt} />)).toContain(pt.apod.media_unavailable)
    expect(renderToStaticMarkup(<ApodMediaUnavailable dictionary={en} />)).toContain(en.apod.media_unavailable)
  })
})
