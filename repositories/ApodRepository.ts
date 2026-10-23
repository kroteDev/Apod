import { IApodRepository } from "@/domain/Apod/Dto/IApodRepository"
import { NasaApiRepository } from "@/repositories/NasaApi/NasaApiRepository"
import { ApodInMemoryRepository } from "@/repositories/inMemory/ApodInMemoryRepository"

export class ApodRepository {
  public static getInstance(): IApodRepository {
    if (process.env.NODE_ENV === 'test') {
      return new ApodInMemoryRepository()
    }

    return new NasaApiRepository()
  }
}
