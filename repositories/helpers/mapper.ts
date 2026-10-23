import { ApodDto } from "@/domain/Apod/Dto/ApodDto"
import { ApodRawResponse } from "@/domain/Apod/RawResponse/ApodRawResponse"
import { extractMedia } from "@/utils/extract-media"
import { htmlToText } from "@/utils/html-to-text"

const EXPLANATION_LABEL = /^Explanation:\s*/i
const CREDIT_LABEL = /^(?:Image\s+)?Credit(?:\s*&\s*Copyright)?\s*:\s*|^Copyright\s*:\s*/i

function plainCredit(html: string | undefined): string | null {
  const text = htmlToText(html)?.replace(CREDIT_LABEL, "").trim()
  return text || null
}

export class Mapper {

  public rawToDomain(rawApiResponse: ApodRawResponse): ApodDto {
    const media = extractMedia(rawApiResponse)

    const Apod: ApodDto = {
      post_id: rawApiResponse.post_id,
      title: rawApiResponse.title,
      date: new Date(rawApiResponse.date),
      explanation: htmlToText(rawApiResponse.explanation)?.replace(EXPLANATION_LABEL, "") ?? "",
      copyright: plainCredit(rawApiResponse.copyright) ?? plainCredit(rawApiResponse.credit),
      alt: rawApiResponse.alt || null,
      media_type: rawApiResponse.media_type,
      video_type: media.video_type,
      media_url: media.media_url,
      thumbnail_url: media.thumbnail_url,
      permalink: rawApiResponse.permalink,
    }
    return Apod
  }

  //TODO a ser implementado . Estou apenas montando o esqueleto.
  // static toViewModel(domainDto: ApodDto): UserViewModel {
  //   // conversão aqui
  // }
}
