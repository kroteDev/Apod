import type { ApodDto } from "@/domain/Apod/Dto/ApodDto"
import type { Dictionary } from "@/helpers/internationalization/get-dictionary"
import { APOD_DETAIL_CLASS } from "@/app/components/apod/classes"
import { ApodActions } from "@/app/components/apod/apod-actions"
import { ApodFigure } from "@/app/components/apod/apod-figure"
import { ApodMeta } from "@/app/components/apod/apod-meta"
import { ApodVideo } from "@/app/components/apod/apod-video"

interface ApodDetailProps {
  apod: ApodDto
  dictionary: Dictionary
  locale: string
}

export function ApodDetail({ apod, dictionary, locale }: ApodDetailProps) {
  return (
    <article className={APOD_DETAIL_CLASS}>
      {apod.media_type === "video" ? (
        <ApodVideo apod={apod} dictionary={dictionary} />
      ) : (
        <ApodFigure apod={apod} dictionary={dictionary} locale={locale} />
      )}

      <div className="mx-auto mb-14 w-full">
        <h1 className="mb-6 text-4xl font-semibold text-black">{apod.title}</h1>
        <p className="mb-8 text-base/loose font-normal text-grey-light">{apod.explanation}</p>
        <ApodMeta apod={apod} dictionary={dictionary} locale={locale} />
      </div>

      <ApodActions apod={apod} dictionary={dictionary} className="lg:justify-end" />
    </article>
  )
}
