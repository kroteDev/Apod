import { ApodDto, ApodPage } from "@/domain/Apod/Dto/ApodDto"
import { Mapper } from "@/repositories/helpers/mapper"
import { Result, success, error } from "@/domain/shared/result"
import { IApodRepository } from "@/domain/Apod/Dto/IApodRepository"
import { IApodApiClient } from "@/domain/shared/IApodApiClient"
import { ApodApiClient } from "@/infrastructure/http/ApodApiClient"
import {
  NotFoundError,
  InternalServerError,
  UnauthorizedServerError,
  InvalidDataError
} from "@/domain/shared/errors"

const DEFAULT_PER_PAGE = 25

export class NasaApiRepository implements IApodRepository {

  private readonly ApiClient: IApodApiClient
  private readonly mapper: Mapper

  constructor(ApiClient: IApodApiClient = new ApodApiClient()) {
    this.ApiClient = ApiClient
    this.mapper = new Mapper()
  }

  async findMany(start_date?: string, end_date?: string, page = 1, per_page = DEFAULT_PER_PAGE): Promise<Result<InvalidDataError | InternalServerError | UnauthorizedServerError, ApodPage>> {

    const response = await this.ApiClient.getList(start_date, end_date, page, per_page)

    if (response.isSuccess()) {

      return success({
        items: response.value.items.map((raw) => this.mapper.rawToDomain(raw)),
        page,
        per_page,
        total: response.value.total,
        total_pages: response.value.total_pages,
      })

    }

    return error(response.value)
  }

  async findByDate(date: string): Promise<Result<NotFoundError | InvalidDataError | InternalServerError | UnauthorizedServerError, ApodDto>> {

    const response = await this.ApiClient.getByDate(date)

    if (response.isSuccess()) {

      const data: ApodDto = this.mapper.rawToDomain(response.value)
      return success(data)

    }

    return error(response.value)
  }

}
