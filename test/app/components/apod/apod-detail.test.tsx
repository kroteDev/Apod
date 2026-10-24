import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { ApodDetail } from '@/app/components/apod/apod-detail'
import { getDictionary } from '@/helpers/internationalization/get-dictionary'
import { Mapper } from '@/repositories/helpers/mapper'
import { IMAGE_RAW, MP4_RAW, YOUTUBE_RAW } from '@/test/fixtures/apod-raw'

const image = new Mapper().rawToDomain(IMAGE_RAW)
const youtube = new Mapper().rawToDomain(YOUTUBE_RAW)
const mp4 = new Mapper().rawToDomain(MP4_RAW)

describe('ApodDetail', () => {
  it('renders the media, title, explanation, metadata and actions of an image day', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodDetail apod={image} dictionary={pt} locale="pt-BR" />)

    expect(html).toContain('<article')
    expect(html).toContain('<figure')
    expect(html).toContain(`<h1 class="mb-6 text-4xl font-semibold text-black">${image.title}</h1>`)
    expect(html).toContain('<dl class="metadata">')
    expect(html).toContain(`href="${image.permalink}"`)
    expect(html).toContain('>Download<')
  })

  it('embeds the video of a video day without a download', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodDetail apod={youtube} dictionary={pt} locale="pt-BR" />)

    expect(html).toContain('<iframe')
    expect(html).not.toContain('<figure')
    expect(html).not.toContain('>Download<')
  })

  it('plays an mp4 day with native controls', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodDetail apod={mp4} dictionary={pt} locale="pt-BR" />)

    expect(html).toContain('<video')
    expect(html).not.toContain('>Download<')
  })
})
