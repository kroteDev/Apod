import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { ApodFigure } from '@/app/components/apod/apod-figure'
import { ApodDto } from '@/domain/Apod/Dto/ApodDto'
import { getDictionary } from '@/helpers/internationalization/get-dictionary'
import { Mapper } from '@/repositories/helpers/mapper'
import { IMAGE_RAW } from '@/test/fixtures/apod-raw'

const image: ApodDto = new Mapper().rawToDomain(IMAGE_RAW)

describe('ApodFigure', () => {
  it('renders the image at its natural ratio, capped by the container width and 80vh', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodFigure apod={image} dictionary={pt} locale="pt-BR" />)

    expect(html).toContain(`src="${image.media_url?.replaceAll('&', '&amp;')}"`)
    expect(html).toContain('mx-auto block h-auto max-h-[80vh] w-auto max-w-full')
    expect(html).toContain('loading="lazy"')
    expect(html).toContain('decoding="async"')
  })

  it('uses the title as alt text', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodFigure apod={image} dictionary={pt} locale="pt-BR" />)

    expect(html).toContain(`alt="${image.title}"`)
  })

  it('shows the title and the published date in the locale format', async () => {
    const pt = await getDictionary('pt-BR')
    const en = await getDictionary('en-US')

    const ptHtml = renderToStaticMarkup(<ApodFigure apod={image} dictionary={pt} locale="pt-BR" />)
    const enHtml = renderToStaticMarkup(<ApodFigure apod={image} dictionary={en} locale="en-US" />)

    expect(ptHtml).toContain(`${image.title}.`)
    expect(ptHtml).toContain(`${pt.apod.published}: 03/07/2026`)
    expect(enHtml).toContain(`${en.apod.published}: 7/3/26`)
  })

  it('shows the unavailable message instead of an image when there is no media URL', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(
      <ApodFigure apod={{ ...image, media_url: null }} dictionary={pt} locale="pt-BR" />,
    )

    expect(html).not.toContain('<img')
    expect(html).toContain(pt.apod.media_unavailable)
  })
})
