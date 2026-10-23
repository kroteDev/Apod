import { describe, it, expect } from 'vitest'
import { extractMedia } from '../../utils/extract-media'

const HDURL = 'https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2026/july/sibling.jpg?w=1920&h=1487'
const PLACEHOLDER = 'https://assets.science.nasa.gov/dynamicimage/assets/science/astro/programs/cosmic-origins/images/misc/news-thumbnail.png?w=594&h=516'

const youtubeHtml = `<center><iframe width="960" height="540" src="//www.youtube.com/embed/FG0fTKAqZ5g?rel=0" frameborder="0" allowfullscreen></iframe></center>`
const mp4Html = `<center><video controls title=""><source src="https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2026/october/CRS35-Holland30s1080p.mp4" type="video/mp4"></video></center>`

describe('extractMedia', () => {
  describe('images', () => {
    it('uses hdurl from the NASA asset host', () => {
      expect(extractMedia({ media_type: 'image', hdurl: HDURL })).toEqual({
        media_url: HDURL,
        video_type: null,
        thumbnail_url: null,
      })
    })

    it('drops hdurl from any other host', () => {
      expect(extractMedia({ media_type: 'image', hdurl: 'https://evil.example/x.jpg' })).toEqual({
        media_url: null,
        video_type: null,
        thumbnail_url: null,
      })
    })

    it('drops non-https hdurl', () => {
      expect(extractMedia({ media_type: 'image', hdurl: 'http://assets.science.nasa.gov/x.jpg' }).media_url).toBeNull()
    })

    it('returns nothing when hdurl is missing', () => {
      expect(extractMedia({ media_type: 'image' }).media_url).toBeNull()
    })
  })

  describe('videos', () => {
    it('builds a YouTube embed and thumbnail from a protocol-relative iframe', () => {
      expect(extractMedia({ media_type: 'video', hdurl: PLACEHOLDER, basic_html: youtubeHtml })).toEqual({
        media_url: 'https://www.youtube.com/embed/FG0fTKAqZ5g',
        video_type: 'youtube',
        thumbnail_url: 'https://img.youtube.com/vi/FG0fTKAqZ5g/hqdefault.jpg',
      })
    })

    it('accepts a Vimeo player iframe', () => {
      const html = `<iframe src="https://player.vimeo.com/video/41038445?portrait=0"></iframe>`
      expect(extractMedia({ media_type: 'video', hdurl: HDURL, basic_html: html })).toEqual({
        media_url: 'https://player.vimeo.com/video/41038445',
        video_type: 'vimeo',
        thumbnail_url: HDURL,
      })
    })

    it('uses an mp4 source from the NASA asset host with hdurl as poster', () => {
      expect(extractMedia({ media_type: 'video', hdurl: HDURL, basic_html: mp4Html })).toEqual({
        media_url: 'https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2026/october/CRS35-Holland30s1080p.mp4',
        video_type: 'video',
        thumbnail_url: HDURL,
      })
    })

    it('rejects an iframe from an unknown host', () => {
      const html = `<iframe src="https://evil.example/embed/FG0fTKAqZ5g"></iframe>`
      expect(extractMedia({ media_type: 'video', basic_html: html })).toEqual({
        media_url: null,
        video_type: null,
        thumbnail_url: null,
      })
    })

    it('rejects a YouTube-looking host that is not YouTube', () => {
      const html = `<iframe src="https://youtube.com.evil.example/embed/FG0fTKAqZ5g"></iframe>`
      expect(extractMedia({ media_type: 'video', basic_html: html }).media_url).toBeNull()
    })

    it('rejects an mp4 source from an unknown host', () => {
      const html = `<video><source src="https://evil.example/clip.mp4"></video>`
      expect(extractMedia({ media_type: 'video', basic_html: html }).media_url).toBeNull()
    })

    it('rejects a non-https mp4 source', () => {
      const html = `<video><source src="http://assets.science.nasa.gov/clip.mp4"></video>`
      expect(extractMedia({ media_type: 'video', basic_html: html }).media_url).toBeNull()
    })

    it('rejects a YouTube iframe with an invalid id', () => {
      const html = `<iframe src="https://www.youtube.com/embed/../../etc"></iframe>`
      expect(extractMedia({ media_type: 'video', basic_html: html }).media_url).toBeNull()
    })

    it('returns nothing when the video has no playable source', () => {
      expect(extractMedia({ media_type: 'video', hdurl: PLACEHOLDER, basic_html: '<p>no media</p>' })).toEqual({
        media_url: null,
        video_type: null,
        thumbnail_url: null,
      })
    })

    it('returns nothing when basic_html is missing', () => {
      expect(extractMedia({ media_type: 'video', hdurl: HDURL }).media_url).toBeNull()
    })
  })
})
