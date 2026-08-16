export interface ISiteConfig {
  nasa_api: {
    apod_url: string    
    api_url: string
    api_key: string
  }
}

export function getSiteConfig(): ISiteConfig {
  
  const {   
    APOD_BASE_URL,    
    APOD_API_BASE_URL,
    NASA_API_KEY
  } = process.env

  const configs: ISiteConfig = {   
    nasa_api: {
      apod_url: APOD_BASE_URL!,
      api_url: APOD_API_BASE_URL!,
      api_key: NASA_API_KEY!
    }
  }
  return configs
}