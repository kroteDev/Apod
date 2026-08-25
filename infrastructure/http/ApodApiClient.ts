import { getSiteConfig, ISiteConfig } from "@/helpers/get-site-config"

// TODO finalizar essa class
export class ApodApiClient {
  private readonly baseUrl: string
  private readonly apiKey: string

  constructor() {
    
    const config: ISiteConfig = getSiteConfig()
    this.baseUrl = config.nasa_config.api_url
    this.apiKey = config.nasa_config.api_key
  }

  // Method 1: Find by date
  async getByDate(date: string): Promise<any> {
    const url = `${this.baseUrl}/planetary/apod?date=${date}&api_key=${this.apiKey}`
    return this.fetchAndHandle(url)
  }

  // Method 2: Find by date range
  async getByDateRange(startDate: string, endDate: string): Promise<any[]> {
    const url = `${this.baseUrl}/planetary/apod?start_date=${startDate}&end_date=${endDate}&api_key=${this.apiKey}`
    return this.fetchAndHandle(url)
  }

  // Method 3: Find random
  async getRandom(count: number = 1): Promise<any[]> {
    const url = `${this.baseUrl}/planetary/apod?count=${count}&api_key=${this.apiKey}`
    return this.fetchAndHandle(url)
  }

  // Shared HTTP logic
  private async fetchAndHandle<T>(url: string): Promise<T> {
    const response = await fetch(url)
    
    if (!response.ok) {
      if (response.status === 404) throw new Error('HTTP_404')
      if (response.status === 401) throw new Error('HTTP_401')
      throw new Error(`HTTP_${response.status}`)
    }
    
    return response.json()
  }
}