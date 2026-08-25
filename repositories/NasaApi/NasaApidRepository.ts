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

import { getSiteConfig, ISiteConfig } from "@/helpers/get-site-config"

export class NasaApiRepository implements IApodRepository {
  
  async findMany(start_date?: string, end_date?: string): Promise<Result<InternalServerError | UnauthorizedServerError, ApodDto[]>> {
    throw new Error("Method not implemented.")
  }
  
  async findByDate(date: string): Promise<Result<NotFoundError | InternalServerError | UnauthorizedServerError, ApodDto>> {
    throw new Error("Method not implemented.")
  }

  async findRandom(count: number): Promise<Result<InternalServerError | UnauthorizedServerError, ApodDto[]>> {
    throw new Error("Method not implemented.")
  }
  
}
const {nasa_config: {api_key, api_url}}: ISiteConfig = getSiteConfig()

export interface NasaApodParams {
  date: string | null
  start_date: string | null
  end_date: string | null
  count: number  
  api_key: string
  thumbs: boolean  
}
// TODO fazer a classe ApodApiClient
// Count não pode ser usado em conjunto com start_date e end_date (Excelente para trazer valores aleatórios)
// start_date e end_date não pode ser utilizado com date já que date retorna só um