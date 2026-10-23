import { GetVideoType } from '@/utils/get-video-type'

export interface ExtractedMedia {
  media_url: string | null
  video_type: 'youtube' | 'vimeo' | 'video' | null
  thumbnail_url: string | null
}

interface MediaSource {
  media_type: 'image' | 'video'
  hdurl?: string
  basic_html?: string
}

const NASA_ASSET_HOST = 'assets.science.nasa.gov'
const YOUTUBE_HOSTS = ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'youtube-nocookie.com']
const VIMEO_HOSTS = ['player.vimeo.com']

const EMPTY_MEDIA: ExtractedMedia = { media_url: null, video_type: null, thumbnail_url: null }

function parseHttps(src: string): URL | null {
  try {
    const url = new URL(src.startsWith('//') ? `https:${src}` : src)
    return url.protocol === 'https:' ? url : null
  } catch {
    return null
  }
}

function allowedAssetUrl(src: string | undefined): string | null {
  if (!src) {
    return null
  }

  const url = parseHttps(src)
  return url && url.hostname === NASA_ASSET_HOST ? url.toString() : null
}

function findAttribute(html: string, tag: string): string | null {
  const match = new RegExp(`<${tag}[^>]*\\ssrc=["']([^"']+)["']`, 'i').exec(html)
  return match ? match[1] : null
}

function extractVideo(source: MediaSource): ExtractedMedia {
  const html = source.basic_html ?? ''

  const iframeSrc = findAttribute(html, 'iframe')
  const iframeUrl = iframeSrc ? parseHttps(iframeSrc) : null

  if (iframeUrl && YOUTUBE_HOSTS.includes(iframeUrl.hostname)) {
    const id = /\/embed\/([\w-]{6,20})/.exec(iframeUrl.pathname)?.[1]

    if (id) {
      return {
        media_url: `https://www.youtube.com/embed/${id}`,
        video_type: 'youtube',
        thumbnail_url: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      }
    }
  }

  if (iframeUrl && VIMEO_HOSTS.includes(iframeUrl.hostname)) {
    const id = /\/video\/(\d+)/.exec(iframeUrl.pathname)?.[1]

    if (id) {
      return {
        media_url: `https://player.vimeo.com/video/${id}`,
        video_type: 'vimeo',
        thumbnail_url: allowedAssetUrl(source.hdurl),
      }
    }
  }

  const sourceSrc = findAttribute(html, 'source')
  const fileUrl = sourceSrc ? parseHttps(sourceSrc) : null

  if (fileUrl && fileUrl.hostname === NASA_ASSET_HOST && GetVideoType({ url: fileUrl.toString() }) === 'video') {
    return {
      media_url: fileUrl.toString(),
      video_type: 'video',
      thumbnail_url: allowedAssetUrl(source.hdurl),
    }
  }

  return EMPTY_MEDIA
}

export function extractMedia(source: MediaSource): ExtractedMedia {
  if (source.media_type === 'image') {
    return { media_url: allowedAssetUrl(source.hdurl), video_type: null, thumbnail_url: null }
  }

  return extractVideo(source)
}
