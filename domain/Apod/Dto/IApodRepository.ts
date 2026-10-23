import { Result } from "@/domain/shared/result"
import { ApodDto, ApodPage } from "@/domain/Apod/Dto/ApodDto"
import {
  NotFoundError,
  InternalServerError,
  UnauthorizedServerError,
  InvalidDataError
} from "@/domain/shared/errors"

export interface IApodRepository {

  findMany(start_date?: string, end_date?: string, page?: number, per_page?: number): Promise<Result<InvalidDataError | InternalServerError | UnauthorizedServerError, ApodPage>>

  findByDate(date: string): Promise<Result<NotFoundError | InvalidDataError | InternalServerError | UnauthorizedServerError, ApodDto>>
}
