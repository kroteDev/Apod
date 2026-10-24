import type { ApodDto } from "@/domain/Apod/Dto/ApodDto"
import type { Dictionary } from "@/helpers/internationalization/get-dictionary"
import { formatApodDate } from "@/utils/format-date"

interface ApodMetaProps {
  apod: ApodDto
  dictionary: Dictionary
  locale: string
  className?: string
}

export function ApodMeta({ apod, dictionary, locale, className = "" }: ApodMetaProps) {
  const mediaTypeLabel = apod.media_type === "video" ? dictionary.apod.media_type_video : dictionary.apod.media_type_image

  return (
    <dl className={className ? `metadata ${className}` : "metadata"}>
      <div>
        <dt>{dictionary.apod.date}:</dt>
        <dd>{formatApodDate(apod.date, locale)}</dd>
      </div>
      <div>
        <dt>{dictionary.apod.media_type}:</dt>
        <dd>{mediaTypeLabel}</dd>
      </div>
      {apod.copyright && (
        <div>
          <dt>{dictionary.apod.copyright}:</dt>
          <dd>{apod.copyright}</dd>
        </div>
      )}
    </dl>
  )
}
