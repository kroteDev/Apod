import { ApodDto } from "@/domain/Apod/Dto/ApodDto"
import { ApodRawReponse } from "@/domain/Apod/RawReponse/ApodRawResponse"

export class ApodMapper {
  
  static toDomain(rawApiResponse: ApodRawReponse): ApodDto {
    
    // TODO implementar o mapper
    return {} as ApodDto
  }
  
  //TODO a ser implementado . Estou apenas montando o esqueleto. 
  // static toViewModel(domainDto: ApodDto): UserViewModel {
  //   // conversão aqui
  // }
}