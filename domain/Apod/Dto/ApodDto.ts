export class ApodDto {
  post_id: number
  title: string
  date: Date
  explanation: string
  copyright: string | null
  alt: string | null
  media_type: 'image' | 'video'
  video_type: 'youtube' | 'vimeo' | 'video' | null
  media_url: string | null
  thumbnail_url: string | null
  permalink: string
}

export interface ApodPage {
  items: ApodDto[]
  page: number
  per_page: number
  total: number
  total_pages: number
}
