import { describe, it, expect } from 'vitest'
import { buildApodMetadata, SITE_TITLE } from '@/app/lib/apod-metadata'
import { Mapper } from '@/repositories/helpers/mapper'
import { IMAGE_RAW, MP4_RAW } from '@/test/fixtures/apod-raw'

const image = new Mapper().rawToDomain(IMAGE_RAW)
const video = new Mapper().rawToDomain(MP4_RAW)

describe('buildApodMetadata', () => {
  it('falls back to the site title when there is no APOD', () => {
    expect(buildApodMetadata(null)).toEqual({ title: SITE_TITLE })
  })

  it('prefixes the site name to the APOD title', () => {
    expect(buildApodMetadata(image).title).toBe(`KröteDev APOD - ${image.title}`)
  })

  it('uses the explanation as description', () => {
    const metadata = buildApodMetadata(image)

    expect(metadata.description).toBe(image.explanation)
    expect(metadata.openGraph).toMatchObject({ description: image.explanation })
  })

  it('uses the media as the social image for an image day', () => {
    const metadata = buildApodMetadata(image)

    expect(metadata.openGraph?.images).toBe(image.media_url)
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image', images: image.media_url })
  })

  it('uses the thumbnail as the social image for a video day', () => {
    expect(buildApodMetadata(video).openGraph?.images).toBe(video.thumbnail_url)
  })

  it('omits the social image when the day has none', () => {
    expect(buildApodMetadata({ ...image, media_url: null }).openGraph?.images).toBeUndefined()
  })
})
