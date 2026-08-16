import { ApodDto } from "@/domain/Apod/Dto/ApodDto"
import { Mapper } from "@/repositories/helpers/mapper"
import { Result, success, error } from "@/domain/shared/result"
import { IApodRepository } from "@/domain/Apod/Dto/IApodRepository"
import { ApodRawReponse } from "@/domain/Apod/RawReponse/ApodRawResponse"
import {
  NotFoundError,
  InternalServerError,
  UnauthorizedServerError
} from  "@/domain/shared/errors"

export class NasaApiRepository implements IApodRepository {
  
  async findMany(start_date?: string, end_date?: string, count?: number): Promise<Result<InternalServerError | UnauthorizedServerError, ApodDto[]>> {
    throw new Error("Method not implemented.")
  }
  
  async findByDate(date: string): Promise<Result<NotFoundError | InternalServerError | UnauthorizedServerError, ApodDto>> {
    throw new Error("Method not implemented.")
  }

  private async fetchApodApi(): Promise<Result<NotFoundError | InternalServerError | UnauthorizedServerError, ApodDto>> {
    
    throw new Error("Method not implemented.")
  }
}