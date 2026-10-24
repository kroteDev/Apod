import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { ApodVideo } from '@/app/components/apod/apod-video'
import { ApodDto } from '@/domain/Apod/Dto/ApodDto'
import { getDictionary } from '@/helpers/internationalization/get-dictionary'
import { Mapper } from '@/repositories/helpers/mapper'
import { MP4_RAW, YOUTUBE_RAW } from '@/test/fixtures/apod-raw'

const youtube: ApodDto = new Mapper().rawToDomain(YOUTUBE_RAW)
const mp4: ApodDto = new Mapper().rawToDomain(MP4_RAW)

describe('ApodVideo', () => {
  it('embeds YouTube as a responsive iframe', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodVideo apod={youtube} dictionary={pt} />)

    expect(html).toContain('<iframe')
    expect(html).toContain(`src="${youtube.media_url}"`)
    expect(html).toContain(`title="${youtube.title}"`)
    expect(html).toContain('allowFullScreen=""')
    expect(html).toContain('aspect-video')
    expect(html).not.toContain('<video')
  })

  it('embeds Vimeo as an iframe', async () => {
    const pt = await getDictionary('pt-BR')
    const vimeo: ApodDto = { ...youtube, video_type: 'vimeo', media_url: 'https://player.vimeo.com/video/123456' }
    const html = renderToStaticMarkup(<ApodVideo apod={vimeo} dictionary={pt} />)

    expect(html).toContain('<iframe')
    expect(html).toContain('src="https://player.vimeo.com/video/123456"')
  })

  it('plays an mp4 with native controls and the thumbnail as poster', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodVideo apod={mp4} dictionary={pt} />)

    expect(html).toContain('<video')
    expect(html).toContain('controls=""')
    expect(html).toContain(`poster="${mp4.thumbnail_url?.replaceAll('&', '&amp;')}"`)
    expect(html).toContain(`<source src="${mp4.media_url}" type="video/mp4"/>`)
    expect(html).toContain('max-h-[80vh]')
    expect(html).not.toContain('<iframe')
  })

  it('omits the poster when there is no thumbnail', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodVideo apod={{ ...mp4, thumbnail_url: null }} dictionary={pt} />)

    expect(html).toContain('<video')
    expect(html).not.toContain('poster=')
  })

  it('shows the unavailable message when the video has no playable media', async () => {
    const pt = await getDictionary('pt-BR')
    const html = renderToStaticMarkup(<ApodVideo apod={{ ...youtube, media_url: null, video_type: null }} dictionary={pt} />)

    expect(html).not.toContain('<iframe')
    expect(html).not.toContain('<video')
    expect(html).toContain(pt.apod.media_unavailable)
  })
})
