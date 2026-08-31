'use server'
import { IApodApiClient } from "@/domain/shared/IApodApiClient"
import { Result, success, error } from "@/domain/shared/result"
import { getSiteConfig, ISiteConfig } from "@/helpers/get-site-config"
import { 
  NotFoundError,
  InternalServerError,
  UnauthorizedServerError
} from "@/domain/shared/errors"
import { ApodRawReponse } from "@/domain/Apod/RawReponse/ApodRawResponse"

// TODO finalizar essa classe
export class ApodApiClient implements IApodApiClient {
  
  private readonly baseUrl: string
  private readonly apiKey: string

  constructor() {

    const config: ISiteConfig = getSiteConfig()
    this.baseUrl = config.nasa_config.api_url
    this.apiKey = config.nasa_config.api_key

  }

  async getByDate(date: string): Promise<Result<NotFoundError | InternalServerError | UnauthorizedServerError, ApodRawReponse>> {
    
    const url = `${this.baseUrl}/planetary/apod?date=${date}`
    const response =  await this.fetchAndHandle(url)
    
    if(response.isSuccess()) {      
     
      return success(response.value as ApodRawReponse)
    
    }
    return error(response.value)    
  }
  
  async getByDateRange(start_date: string, end_date: string): Promise<Result<InternalServerError | UnauthorizedServerError, ApodRawReponse[]>> {
    const url = `${this.baseUrl}/planetary/apod?start_date=${start_date}&end_date=${end_date}`
    const response = await this.fetchAndHandle(url)

    if (response.isSuccess()) {
      return success(response.value as ApodRawReponse[])
    }

    if(response.isError() && ! (response.value instanceof NotFoundError) ){
      return error(response.value)
    }

  }
  
  async getRandom(count: number): Promise<Result<InternalServerError | UnauthorizedServerError, ApodRawReponse[]>> {
    const url = `${this.baseUrl}/planetary/apod?count=${count}`
    const response = await this.fetchAndHandle(url)

    if (response.isSuccess()) {
      return success(response.value as ApodRawReponse[])
    }

    if(response.isError() && ! (response.value instanceof NotFoundError) ){
      return error(response.value)
    }
  }
 

  public async fetchAndHandle(url: string): Promise<Result<NotFoundError | InternalServerError | UnauthorizedServerError, ApodRawReponse | ApodRawReponse[]>> {
  
  const headers = new Headers()
  const requestOptions: RequestInit = {
    method: "GET",
    headers: headers,
    redirect: "follow"
  }
  
  try {

    const response = await fetch(
      `${url}&api_key=${this.apiKey}`, 
      requestOptions
    )

    switch (response.status) {
      case 200:
        const data: ApodRawReponse | ApodRawReponse[] = await response.json()
        return success(data)
      case 404:
        return error(new NotFoundError(url))
      case 401:
        return error(new UnauthorizedServerError(url))
      case 500:
        default:
        return error(new InternalServerError(url))        
    }     

  } catch (error) {
    
    return error(new InternalServerError(error))
  }    
}
}

