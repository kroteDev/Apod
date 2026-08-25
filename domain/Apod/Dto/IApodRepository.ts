import { Result } from "@/domain/shared/result"
import { ApodDto } from "@/domain/Apod/Dto/ApodDto"
import {
  NotFoundError,
  InternalServerError,
  UnauthorizedServerError
} from  "@/domain/shared/errors"

export interface IApodRepository {
  
  findMany(start_date?: string, end_date?: string): Promise<Result<InternalServerError | UnauthorizedServerError, ApodDto[]>>

  findByDate(date: string): Promise<Result<NotFoundError | InternalServerError | UnauthorizedServerError, ApodDto>>

  findRandom(count: number): Promise<Result<InternalServerError | UnauthorizedServerError, ApodDto[]>>
}