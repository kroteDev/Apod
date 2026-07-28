import { Result } from "@/domain/shared/result"
import { ApodDto } from "@/domain/Apod/Dto/ApodDto"
import {
  NotFoundError, RequiredFieldsError
} from  "@/domain/shared/errors"

export interface IApodRepository {
  
  findMany(start_date?: number, end_date?: number, count?: number): Promise<Result<RequiredFieldsError,ApodDto[]>>

  findByDate(date: string): Promise<Result<NotFoundError, ApodDto>>
}