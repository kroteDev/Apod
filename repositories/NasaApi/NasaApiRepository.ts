import { ApodDto } from "@/domain/Apod/Dto/ApodDto"
import { Mapper } from "@/repositories/helpers/mapper"
import { Result, success, error } from "@/domain/shared/result"
import { IApodRepository } from "@/domain/Apod/Dto/IApodRepository"
import { ApodApiClient } from "@/infrastructure/http/ApodApiClient"
import { ApodRawReponse } from "@/domain/Apod/RawReponse/ApodRawResponse"
import {
  NotFoundError,
  InternalServerError,
  UnauthorizedServerError
} from  "@/domain/shared/errors"

export class NasaApiRepository implements IApodRepository {
  
  private readonly ApiClient: ApodApiClient
  private readonly mapper: Mapper
  
  constructor () {
    this.ApiClient = new ApodApiClient()
    this.mapper = new Mapper()
  }

  async findMany(start_date?: string, end_date?: string): Promise<Result<InternalServerError | UnauthorizedServerError, ApodDto[]>> {
    
    const response = await this.ApiClient.getByDateRange(start_date, end_date)
    
    if(response.isSuccess()) {
      
      const data: ApodDto[] = response.value.map((raw: ApodRawReponse) => this.mapper.rawToDomain(raw))
      return success(data)

    }
    
    return error(response.value)
  }
  
  async findByDate(date: string): Promise<Result<NotFoundError | InternalServerError | UnauthorizedServerError, ApodDto>> {
    
    const response = await this.ApiClient.getByDate(date)
    
    if(response.isSuccess()) {

      const data: ApodDto = this.mapper.rawToDomain(response.value)
      return success(data)

    }
    
    return error(response.value)
  }

  async findRandom(count: number): Promise<Result<InternalServerError | UnauthorizedServerError, ApodDto[]>> {
    
    const response = await this.ApiClient.getRandom(count)

    if(response.isSuccess()) {

      const data: ApodDto[] = response.value.map((raw: ApodRawReponse) => this.mapper.rawToDomain(raw))
      return success(data)
    }

    return error(response.value)
  }
  
}