export class ApodDto {  
  title: string
  date: Date
  url: string  
  explanation: string 
  media_type: 'image' | 'video'
  video_type: 'vimeo' | 'youtube' | 'video' | null
  hdurl?: string
  concepts?: string
  thumbnail_url?: string
  copyright?: string
}