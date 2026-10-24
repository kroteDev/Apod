export interface ISiteConfig {
  nasa_config: {
    apod_url: string    
    api_url: string
    api_key: string
  }
}

const DEFAULT_APOD_BASE_URL = "https://apod.nasa.gov"
const DEFAULT_APOD_API_BASE_URL = "https://science.nasa.gov/wp-json/wp/v2/apod-basic"

export function getSiteConfig(): ISiteConfig {
  const {
    APOD_BASE_URL,
    APOD_API_BASE_URL,
    NASA_API_KEY
  } = process.env

  const configs: ISiteConfig = {
    nasa_config: {
      apod_url: APOD_BASE_URL ?? DEFAULT_APOD_BASE_URL,
      api_url: APOD_API_BASE_URL ?? DEFAULT_APOD_API_BASE_URL,
      api_key: NASA_API_KEY ?? ""
    }
  }
  return configs
}