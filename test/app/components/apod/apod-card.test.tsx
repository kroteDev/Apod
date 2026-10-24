import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { ApodCard } from '@/app/components/apod/apod-card'
import { getDictionary } from '@/helpers/internationalization/get-dictionary'
import { Mapper } from '@/repositories/helpers/mapper'
import { IMAGE_RAW, MP4_RAW, YOUTUBE_RAW } from '@/test/fixtures/apod-raw'

const image = new Mapper().rawToDomain(IMAGE_RAW)
const youtube = new Mapper().rawToDomain(YOUTUBE_RAW)
const mp4 = new Mapper().rawToDomain(MP4_RAW)

describe('ApodCard', () => {
  it('links the image, title and read-more action to the internal date page', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodCard apod={image} dictionary={pt} locale="pt-BR" />)

    expect(html.match(/href="\/pt-BR\/apod\/2026-07-03"/g)?.length).toBe(3)
    expect(html).toContain(pt.button.read_more)
    expect(html).not.toContain(`href="${image.permalink}"`)
  })

  it('uses the image as the card media and offers its download', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodCard apod={image} dictionary={pt} locale="pt-BR" />)

    expect(html).toContain(`src="${image.media_url?.replaceAll('&', '&amp;')}"`)
    expect(html).toContain('>Download<')
  })

  it('uses the thumbnail as the media of a video and offers no download', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodCard apod={youtube} dictionary={pt} locale="pt-BR" />)

    expect(html).toContain(`src="${youtube.thumbnail_url}"`)
    expect(html).not.toContain('>Download<')
  })

  it('uses the mp4 poster as the media of an mp4 day', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodCard apod={mp4} dictionary={pt} locale="pt-BR" />)

    expect(html).toContain(`src="${mp4.thumbnail_url?.replaceAll('&', '&amp;')}"`)
  })

  it('shows the unavailable message in place of a missing media', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(
      <ApodCard apod={{ ...image, media_url: null, thumbnail_url: null }} dictionary={pt} locale="pt-BR" />,
    )

    expect(html).not.toContain('<img')
    expect(html).toContain(pt.apod.media_unavailable)
  })

  it('shortens a long explanation to 500 characters at a word boundary', async () => {
    const pt = await getDictionary('pt-BR')
    const long = 'palavra '.repeat(200).trim()
    const html = renderToStaticMarkup(<ApodCard apod={{ ...image, explanation: long }} dictionary={pt} locale="pt-BR" />)

    expect(html).toContain('...</p>')
    expect(html).not.toContain(long)
  })

  it('keeps a short explanation whole', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodCard apod={{ ...image, explanation: 'Curto.' }} dictionary={pt} locale="pt-BR" />)

    expect(html).toContain('>Curto.</p>')
  })

  it('shows the metadata in the locale format', async () => {
    const en = await getDictionary('en-US')
    const html = renderToStaticMarkup(<ApodCard apod={image} dictionary={en} locale="en-US" />)

    expect(html).toContain('7/3/26')
    expect(html).toContain(en.button.read_more)
  })
})
