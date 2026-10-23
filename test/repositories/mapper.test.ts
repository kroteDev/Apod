import { describe, it, expect } from 'vitest'
import { Mapper } from '../../repositories/helpers/mapper'
import { IMAGE_RAW, MP4_RAW, YOUTUBE_RAW } from '../fixtures/apod-raw'

describe('Mapper', () => {
  const mapper = new Mapper()

  it('maps an image and strips the explanation label and HTML', () => {
    const dto = mapper.rawToDomain(IMAGE_RAW)

    expect(dto.post_id).toBe(1258485)
    expect(dto.title).toBe('Three Galaxies in Pavo')
    expect(dto.date).toEqual(new Date('2026-07-03'))
    expect(dto.explanation).toBe('Some 190 million light-years away, these three galaxies are drawn together.')
    expect(dto.explanation).not.toContain('<')
    expect(dto.explanation).not.toContain('http')
    expect(dto.media_type).toBe('image')
    expect(dto.video_type).toBeNull()
    expect(dto.media_url).toBe(IMAGE_RAW.hdurl)
    expect(dto.thumbnail_url).toBeNull()
    expect(dto.permalink).toBe(IMAGE_RAW.permalink)
  })

  it('removes the credit label and the links from the copyright', () => {
    const dto = mapper.rawToDomain(IMAGE_RAW)
    expect(dto.copyright).toBe('Mike Selby')
  })

  it('falls back to credit when copyright is empty and returns null when both are empty', () => {
    expect(mapper.rawToDomain({ ...IMAGE_RAW, copyright: '' }).copyright).toBe('Mike Selby')
    expect(mapper.rawToDomain({ ...IMAGE_RAW, copyright: '', credit: '' }).copyright).toBeNull()
  })

  it('returns null alt when the field is empty', () => {
    expect(mapper.rawToDomain({ ...IMAGE_RAW, alt: '' }).alt).toBeNull()
    expect(mapper.rawToDomain(IMAGE_RAW).alt).toBe('See Explanation.')
  })

  it('maps a YouTube video to an embed and a thumbnail', () => {
    const dto = mapper.rawToDomain(YOUTUBE_RAW)

    expect(dto.media_type).toBe('video')
    expect(dto.video_type).toBe('youtube')
    expect(dto.media_url).toBe('https://www.youtube.com/embed/FG0fTKAqZ5g')
    expect(dto.thumbnail_url).toBe('https://img.youtube.com/vi/FG0fTKAqZ5g/hqdefault.jpg')
    expect(dto.copyright).toBeNull()
  })

  it('maps an mp4 video to the file and uses the poster as thumbnail', () => {
    const dto = mapper.rawToDomain(MP4_RAW)

    expect(dto.video_type).toBe('video')
    expect(dto.media_url).toBe('https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2026/october/CRS35-Holland30s1080p.mp4')
    expect(dto.thumbnail_url).toBe(MP4_RAW.hdurl)
    expect(dto.copyright).toBe('Eric Holland')
  })

  it('leaves media empty for a video without a playable source', () => {
    const dto = mapper.rawToDomain({ ...MP4_RAW, basic_html: '<p>nothing here</p>' })

    expect(dto.media_type).toBe('video')
    expect(dto.video_type).toBeNull()
    expect(dto.media_url).toBeNull()
    expect(dto.thumbnail_url).toBeNull()
  })
})
