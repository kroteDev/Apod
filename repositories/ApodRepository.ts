import { NasaApiRepository } from "@/repositories/NasaApi/NasaApiRepository"
import { IApodRepository } from "@/domain/Apod/Dto/IApodRepository"

// TODO adicionar o inMemory depois de pronto
export class ApodRepository {
  public static getInstance(): IApodRepository {
    switch (process.env.NODE_ENV) {
      case 'production':
      case 'test':
      case 'development':
      default:
        return new NasaApiRepository()
    }
  }
}