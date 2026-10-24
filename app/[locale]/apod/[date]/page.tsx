import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ApodActions } from "@/app/components/apod/apod-actions"
import { ApodFigure } from "@/app/components/apod/apod-figure"
import { ApodVideo } from "@/app/components/apod/apod-video"
import { getApodByDate } from "@/app/lib/apod"
import { InvalidDataError, NotFoundError } from "@/domain/shared/errors"
import { getDictionary } from "@/helpers/internationalization/get-dictionary"
import { formatApodDate } from "@/utils/format-date"

const SITE_TITLE = "KröteDev APOD"

interface ApodPageProps {
  params: Promise<{ locale: string; date: string }>
}

export async function generateMetadata({ params }: ApodPageProps): Promise<Metadata> {
  const { date } = await params
  const result = await getApodByDate(date)

  if (result.isError()) {
    return { title: SITE_TITLE }
  }

  const apod = result.value
  const title = `${SITE_TITLE} - ${apod.title}`
  const image = apod.media_type === "image" ? apod.media_url : apod.thumbnail_url

  return {
    title,
    description: apod.explanation,
    openGraph: {
      title,
      description: apod.explanation,
      images: image ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: apod.explanation,
      images: image ?? undefined,
    },
  }
}

export default async function ApodPage({ params }: ApodPageProps) {
  const { locale, date } = await params
  const result = await getApodByDate(date)

  if (result.isError()) {
    if (result.value instanceof NotFoundError || result.value instanceof InvalidDataError) {
      notFound()
    }

    throw result.value
  }

  const apod = result.value
  const dictionary = await getDictionary(locale)
  const mediaTypeLabel = apod.media_type === "video" ? dictionary.apod.media_type_video : dictionary.apod.media_type_image

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 bg-white px-4 py-14 shadow-lg md:px-8">
      {apod.media_type === "video" ? (
        <ApodVideo apod={apod} dictionary={dictionary} />
      ) : (
        <ApodFigure apod={apod} dictionary={dictionary} locale={locale} />
      )}

      <div className="mx-auto mb-14 w-full">
        <h1 className="mb-6 text-4xl font-semibold text-black">{apod.title}</h1>
        <p className="mb-8 text-base/loose font-normal text-grey-light">{apod.explanation}</p>

        <dl className="metadata">
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
      </div>

      <ApodActions apod={apod} dictionary={dictionary} />
    </main>
  )
}
