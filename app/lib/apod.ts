import { ApodDto, ApodPage } from "@/domain/Apod/Dto/ApodDto"
import { IApodRepository } from "@/domain/Apod/Dto/IApodRepository"
import {
  InternalServerError,
  InvalidDataError,
  NotFoundError,
  UnauthorizedServerError,
} from "@/domain/shared/errors"
import { Result, error } from "@/domain/shared/result"
import { ApodRepository } from "@/repositories/ApodRepository"
import { toLegacyDate } from "@/utils/legacy-date"

export type GetApodByDateError = NotFoundError | InvalidDataError | InternalServerError | UnauthorizedServerError

export type GetApodPageError = InvalidDataError | InternalServerError | UnauthorizedServerError

export interface GetApodPageParams {
  start_date?: string
  end_date?: string
  page?: number
  per_page?: number
}

function isValidDate(date: string): boolean {
  return toLegacyDate(date) !== null
}

export async function getApodByDate(date: string): Promise<Result<GetApodByDateError, ApodDto>> {
  if (!isValidDate(date)) {
    return error(new InvalidDataError("date"))
  }

  const repository: IApodRepository = ApodRepository.getInstance()
  return repository.findByDate(date)
}

export async function getApodPage({
  start_date,
  end_date,
  page,
  per_page,
}: GetApodPageParams = {}): Promise<Result<GetApodPageError, ApodPage>> {
  if (start_date && !isValidDate(start_date)) {
    return error(new InvalidDataError("start_date"))
  }

  if (end_date && !isValidDate(end_date)) {
    return error(new InvalidDataError("end_date"))
  }

  const repository: IApodRepository = ApodRepository.getInstance()
  return repository.findMany(start_date, end_date, page, per_page)
}
