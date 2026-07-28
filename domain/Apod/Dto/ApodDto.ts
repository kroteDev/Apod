export class ApodDto {
  concept_tags: boolean
  title: string
  date: string
  url: string  
  explanation: string 
  media_type: 'youtube' | 'image' | 'video'
  hdurl?: string
  concepts?: string
  thumbnail_url?: string
  copyright?: string
  service_version?: string
  resource?: any  
}