import { ApodDto } from "@/domain/Apod/Dto/ApodDto"
import { GetVideoType } from "@/utils/get-video-type"
import { ApodRawReponse } from "@/domain/Apod/RawReponse/ApodRawResponse"

export class Mapper {
  
  public rawToDomain(rawApiResponse: ApodRawReponse): ApodDto {
    
    const Apod: ApodDto = {      
      title: rawApiResponse.title,
      date: new Date(rawApiResponse.date),
      url: rawApiResponse.url,  
      explanation: rawApiResponse.explanation,
      media_type: rawApiResponse.media_type,
      video_type: GetVideoType({url: rawApiResponse.url}),
      hdurl: rawApiResponse.hdurl,
      concepts: rawApiResponse.concepts,
      thumbnail_url: rawApiResponse.thumbnail_url,
      copyright: rawApiResponse.copyright
    }
    return Apod
  }
  
  //TODO a ser implementado . Estou apenas montando o esqueleto. 
  // static toViewModel(domainDto: ApodDto): UserViewModel {
  //   // conversão aqui
  // }
}