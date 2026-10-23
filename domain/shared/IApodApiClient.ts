import { Result } from "@/domain/shared/result"
import { ApodRawResponse } from "@/domain/Apod/RawResponse/ApodRawResponse"
import { NotFoundError, InternalServerError, UnauthorizedServerError, InvalidDataError } from "@/domain/shared/errors"

export interface ApodRawPage {
  items: ApodRawResponse[]
  total: number
  total_pages: number
}

export interface IApodApiClient {

  getByDate(date: string): Promise<Result<NotFoundError | InvalidDataError | InternalServerError | UnauthorizedServerError, ApodRawResponse>>

  getList(start_date: string | undefined, end_date: string | undefined, page: number, per_page: number): Promise<Result<InvalidDataError | InternalServerError | UnauthorizedServerError, ApodRawPage>>

}
