import Link from "next/link"
import type { ApodDto } from "@/domain/Apod/Dto/ApodDto"
import type { Dictionary } from "@/helpers/internationalization/get-dictionary"
import { toIsoDate } from "@/utils/iso-date"
import { truncateText } from "@/utils/truncate-string"
import { APOD_CARD_CLASS } from "@/app/components/apod/classes"
import { ApodActions } from "@/app/components/apod/apod-actions"
import { ApodImage } from "@/app/components/apod/apod-image"
import { ApodMeta } from "@/app/components/apod/apod-meta"

const CARD_EXPLANATION_LENGTH = 500

interface ApodCardProps {
  apod: ApodDto
  dictionary: Dictionary
  locale: string
}

function CardFallback({ dictionary }: { dictionary: Dictionary }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-grey-light/10 p-4 text-center text-sm text-grey-light">
      {dictionary.apod.media_unavailable}
    </div>
  )
}

export function ApodCard({ apod, dictionary, locale }: ApodCardProps) {
  const detailHref = `/${locale}/apod/${toIsoDate(apod.date)}`
  const imageUrl = apod.media_type === "video" ? apod.thumbnail_url : apod.media_url
  const fallback = <CardFallback dictionary={dictionary} />

  return (
    <article className={APOD_CARD_CLASS}>
      <Link href={detailHref} className="image-wrapper block h-72 w-full overflow-hidden md:h-auto md:w-3/6">
        {imageUrl ? (
          <ApodImage
            src={imageUrl}
            alt={apod.title}
            frameClassName="h-full w-full"
            className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
            fallback={fallback}
          />
        ) : (
          fallback
        )}
      </Link>

      <div className="info w-full px-4 pt-12 pb-12 md:w-3/6 lg:px-12">
        <h2 className="mb-6 text-3xl font-semibold">
          <Link href={detailHref} className="text-nasa-blue hover:underline">
            {apod.title}
          </Link>
        </h2>
        <p className="mb-8 text-base/loose font-normal text-grey-light">
          {truncateText(apod.explanation, CARD_EXPLANATION_LENGTH)}
        </p>
        <ApodMeta apod={apod} dictionary={dictionary} locale={locale} className="lg:flex-wrap" />
        <ApodActions apod={apod} dictionary={dictionary} detailHref={detailHref} />
      </div>
    </article>
  )
}
