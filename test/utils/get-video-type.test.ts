import { describe, it, expect } from 'vitest'
import { GetVideoType } from '@/utils/get-video-type'

describe('GetVideoType', () => {
  it('detects YouTube embed URLs', () => {
    const url = 'https://www.youtube.com/embed/FG0fTKAqZ5g?rel=0'
    expect(GetVideoType({ url })).toBe('youtube')
  })

  it('detects youtu.be short URLs', () => {
    const url = 'https://youtu.be/dQw4w9WgXcQ'
    expect(GetVideoType({ url })).toBe('youtube')
  })

  it('detects Vimeo player URLs', () => {
    const url = 'https://player.vimeo.com/video/41038445?portrait=0&color=c8b3df'
    expect(GetVideoType({ url })).toBe('vimeo')
  })

  it('detects direct video file by extension (lowercase)', () => {
    const url = 'https://example.com/path/video.mp4'
    expect(GetVideoType({ url })).toBe('video')
  })

  it('detects direct video file by extension (uppercase)', () => {
    const url = 'https://example.com/path/video.MP4'
    expect(GetVideoType({ url })).toBe('video')
  })

  it('returns null for unknown URLs', () => {
    const url = 'https://example.com/some/page'
    expect(GetVideoType({ url })).toBeNull()
  })
})
