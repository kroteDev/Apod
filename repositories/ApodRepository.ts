import { IApodRepository } from "@/domain/Apod/Dto/IApodRepository"
import { NasaApiRepository } from "@/repositories/NasaApi/NasaApiRepository"
import { ApodInMemoryRepository } from "@/repositories/inMemory/ApodInMemoryRepository"

export class ApodRepository {
  public static getInstance(): IApodRepository {
    switch (process.env.NODE_ENV) {
      case 'production':
      case 'test':
        return new ApodInMemoryRepository()
      case 'development':
      default:
        return new NasaApiRepository()
    }
  }
}