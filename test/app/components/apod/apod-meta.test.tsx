import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { ApodMeta } from '@/app/components/apod/apod-meta'
import { getDictionary } from '@/helpers/internationalization/get-dictionary'
import { Mapper } from '@/repositories/helpers/mapper'
import { IMAGE_RAW, MP4_RAW } from '@/test/fixtures/apod-raw'

const image = new Mapper().rawToDomain(IMAGE_RAW)
const video = new Mapper().rawToDomain(MP4_RAW)

describe('ApodMeta', () => {
  it('shows the date, media type and copyright in pt-BR', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodMeta apod={image} dictionary={pt} locale="pt-BR" />)

    expect(html).toContain('<dl class="metadata">')
    expect(html).toContain('Data:')
    expect(html).toContain('03/07/2026')
    expect(html).toContain('Tipo de Midia:')
    expect(html).toContain('Imagem')
    expect(html).toContain('Copyright:')
  })

  it('uses the English labels and date format in en-US', async () => {
    const en = await getDictionary('en-US')
    const html = renderToStaticMarkup(<ApodMeta apod={image} dictionary={en} locale="en-US" />)

    expect(html).toContain('Date:')
    expect(html).toContain('7/3/26')
    expect(html).toContain('Media Type:')
    expect(html).toContain('Image')
  })

  it('names a video as video', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodMeta apod={video} dictionary={pt} locale="pt-BR" />)

    expect(html).toContain('Vídeo')
  })

  it('omits the copyright row when there is no copyright', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodMeta apod={{ ...image, copyright: null }} dictionary={pt} locale="pt-BR" />)

    expect(html).not.toContain('Copyright:')
  })
})
