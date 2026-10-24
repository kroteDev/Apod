import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { ApodActions } from '@/app/components/apod/apod-actions'
import { ApodDto } from '@/domain/Apod/Dto/ApodDto'
import { getDictionary } from '@/helpers/internationalization/get-dictionary'
import { Mapper } from '@/repositories/helpers/mapper'
import { IMAGE_RAW, MP4_RAW, YOUTUBE_RAW } from '@/test/fixtures/apod-raw'

const image: ApodDto = new Mapper().rawToDomain(IMAGE_RAW)
const youtube: ApodDto = new Mapper().rawToDomain(YOUTUBE_RAW)
const mp4: ApodDto = new Mapper().rawToDomain(MP4_RAW)

describe('ApodActions', () => {
  it('links to the official permalink in a new tab', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodActions apod={image} dictionary={pt} />)

    expect(html).toContain(`href="${image.permalink}"`)
    expect(html).toContain(pt.button.go_to_apod)
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noreferrer"')
  })

  it('offers the download of the media for images', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodActions apod={image} dictionary={pt} />)

    expect(html).toContain(`href="${image.media_url?.replaceAll('&', '&amp;')}"`)
    expect(html).toContain(`>${pt.button.download}<`)
  })

  it('shows the download in English for en-US', async () => {
    const en = await getDictionary('en-US')
    const html = renderToStaticMarkup(<ApodActions apod={image} dictionary={en} />)

    expect(html).toContain(`>${en.button.download}<`)
    expect(html).toContain(en.button.go_to_apod)
  })

  it('does not offer a download for YouTube videos', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodActions apod={youtube} dictionary={pt} />)

    expect(html).toContain(pt.button.go_to_apod)
    expect(html).not.toContain(`>${pt.button.download}<`)
  })

  it('does not offer a download for mp4 videos, even with a media URL', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodActions apod={mp4} dictionary={pt} />)

    expect(html).not.toContain(`>${pt.button.download}<`)
  })

  it('links to the internal detail page instead of the permalink when one is given', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodActions apod={image} dictionary={pt} detailHref="/pt-BR/apod/2026-07-03" />)

    expect(html).toContain('href="/pt-BR/apod/2026-07-03"')
    expect(html).toContain(pt.button.read_more)
    expect(html).not.toContain(pt.button.go_to_apod)
    expect(html).not.toContain(`href="${image.permalink}"`)
  })

  it('does not offer a download for an image without a media URL', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodActions apod={{ ...image, media_url: null }} dictionary={pt} />)

    expect(html).toContain(pt.button.go_to_apod)
    expect(html).not.toContain(`>${pt.button.download}<`)
  })
})
