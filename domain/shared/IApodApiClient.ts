import { Result } from "@/domain/shared/result"
import { ApodRawReponse } from "@/domain/Apod/RawReponse/ApodRawResponse"
import { NotFoundError, InternalServerError, UnauthorizedServerError } from "@/domain/shared/errors"

export interface IApodApiClient {

  getByDate(date: string): Promise<Result<NotFoundError | InternalServerError | UnauthorizedServerError , ApodRawReponse>>

  getByDateRange(startDate: string, endDate: string): Promise<Result<InternalServerError | UnauthorizedServerError , ApodRawReponse[]>>
  
  getRandom(count: number): Promise<Result<InternalServerError | UnauthorizedServerError , ApodRawReponse[]>> 
 
}