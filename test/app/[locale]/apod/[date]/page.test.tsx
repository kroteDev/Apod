import { describe, it, expect, afterEach, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import ApodPage, { generateMetadata } from '@/app/[locale]/apod/[date]/page'
import { getApodByDate } from '@/app/lib/apod'
import { IApodRepository } from '@/domain/Apod/Dto/IApodRepository'
import { InternalServerError } from '@/domain/shared/errors'
import { error } from '@/domain/shared/result'
import { ApodRepository } from '@/repositories/ApodRepository'

const NOT_FOUND_DIGEST = 'NEXT_HTTP_ERROR_FALLBACK;404'

async function render(locale: string, date: string): Promise<string> {
  const element = await ApodPage({ params: Promise.resolve({ locale, date }) })
  return renderToStaticMarkup(element)
}

async function metadataFor(date: string) {
  return generateMetadata({ params: Promise.resolve({ locale: 'pt-BR', date }) })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('APOD date page', () => {
  describe('image day', () => {
    it('renders the title, the image, the metadata and both actions in pt-BR', async () => {
      const html = await render('pt-BR', '2026-10-23')

      expect(html).toContain('<h1')
      expect(html).toContain('Andromeda in Southern Spring')
      expect(html).toContain('<img')
      expect(html).toContain('Data:')
      expect(html).toContain('23/10/2026')
      expect(html).toContain('Tipo de Midia:')
      expect(html).toContain('Imagem')
      expect(html).toContain('Copyright:')
      expect(html).toContain('Lucy Yunxi Hu')
      expect(html).toContain('Ir para o Apod')
      expect(html).toContain('>Download<')
    })

    it('renders the same day in en-US with the English labels and date', async () => {
      const html = await render('en-US', '2026-10-23')

      expect(html).toContain('Date:')
      expect(html).toContain('10/23/26')
      expect(html).toContain('Media Type:')
      expect(html).toContain('Image')
      expect(html).toContain('Go to APOD')
      expect(html).toContain('>Download<')
    })
  })

  describe('video day', () => {
    it('embeds a YouTube video and offers no download', async () => {
      const html = await render('pt-BR', '2025-12-08')

      expect(html).toContain('<iframe')
      expect(html).toContain('https://www.youtube.com/embed/FG0fTKAqZ5g')
      expect(html).toContain('Vídeo')
      expect(html).toContain('Ir para o Apod')
      expect(html).not.toContain('>Download<')
    })

    it('plays an mp4 with native controls and offers no download', async () => {
      const html = await render('pt-BR', '2026-10-16')

      expect(html).toContain('<video')
      expect(html).toContain('CRS35-Holland30s1080p.mp4')
      expect(html).not.toContain('>Download<')
    })

    it('omits the copyright row when the day has no copyright', async () => {
      const html = await render('pt-BR', '2025-12-08')

      expect(html).not.toContain('Copyright:')
    })
  })

  describe('not found', () => {
    it('calls notFound for a date without an APOD', async () => {
      await expect(render('pt-BR', '2026-12-31')).rejects.toMatchObject({ digest: NOT_FOUND_DIGEST })
    })

    it('calls notFound for an invalid calendar date', async () => {
      await expect(render('pt-BR', '2026-02-30')).rejects.toMatchObject({ digest: NOT_FOUND_DIGEST })
    })
  })

  describe('unexpected failures', () => {
    it('rethrows server errors so the error boundary handles them instead of showing a 404', async () => {
      const failing = { findByDate: async () => error(new InternalServerError('offline')) } as unknown as IApodRepository
      vi.spyOn(ApodRepository, 'getInstance').mockReturnValue(failing)

      await expect(render('pt-BR', '2026-10-23')).rejects.toBeInstanceOf(InternalServerError)
    })
  })
})

describe('APOD date page metadata', () => {
  it('uses the APOD title and explanation, with the image for image days', async () => {
    const result = await getApodByDate('2026-10-23')
    if (!result.isSuccess()) throw new Error('fixture missing')
    const apod = result.value

    const metadata = await metadataFor('2026-10-23')

    expect(metadata.title).toBe(`KröteDev APOD - ${apod.title}`)
    expect(metadata.description).toBe(apod.explanation)
    expect(metadata.openGraph?.images).toBe(apod.media_url)
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image', images: apod.media_url })
  })

  it('uses the thumbnail as the social image for video days', async () => {
    const result = await getApodByDate('2026-10-16')
    if (!result.isSuccess()) throw new Error('fixture missing')
    const apod = result.value

    const metadata = await metadataFor('2026-10-16')

    expect(metadata.openGraph?.images).toBe(apod.thumbnail_url)
  })

  it('falls back to the site title when the day cannot be loaded', async () => {
    const metadata = await metadataFor('2026-12-31')

    expect(metadata).toEqual({ title: 'KröteDev APOD' })
  })
})
