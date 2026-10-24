import type { ApodDto } from "@/domain/Apod/Dto/ApodDto"
import type { Dictionary } from "@/helpers/internationalization/get-dictionary"
import { formatApodDate } from "@/utils/format-date"
import { ApodImage } from "@/app/components/apod/apod-image"
import { ApodMediaUnavailable } from "@/app/components/apod/apod-media-unavailable"

interface ApodFigureProps {
  apod: ApodDto
  dictionary: Dictionary
  locale: string
}

export function ApodFigure({ apod, dictionary, locale }: ApodFigureProps) {
  if (!apod.media_url) {
    return <ApodMediaUnavailable dictionary={dictionary} />
  }

  const unavailable = <ApodMediaUnavailable dictionary={dictionary} />

  return (
    <figure className="relative mx-auto mb-14 w-full">
      <ApodImage
        src={apod.media_url}
        alt={apod.title}
        loadingClassName="min-h-[40vh]"
        className="mx-auto block h-auto max-h-[80vh] w-auto max-w-full"
        fallback={unavailable}
      />
      <figcaption className="text-right font-extralight italic text-grey-light">
        <small className="mr-1.5">{apod.title}.</small>
        <small>{`${dictionary.apod.published}: ${formatApodDate(apod.date, locale)}`}</small>
      </figcaption>
    </figure>
  )
}
