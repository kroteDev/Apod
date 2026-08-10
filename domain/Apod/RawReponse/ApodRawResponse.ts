export class ApodRawReponse {
  title: string
  date: string
  url: string
  media_type: 'image' | 'video'
  explanation: string 
  resource?: any
  hdurl?: string
  concepts?: string
  thumbnail_url?: string
  copyright?: string
  service_version?: string
}