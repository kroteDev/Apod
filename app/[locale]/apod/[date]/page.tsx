import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ApodDetail } from "@/app/components/apod/apod-detail"
import { getApodByDate } from "@/app/lib/apod"
import { buildApodMetadata } from "@/app/lib/apod-metadata"
import { InvalidDataError, NotFoundError } from "@/domain/shared/errors"
import { getDictionary } from "@/helpers/internationalization/get-dictionary"

interface ApodPageProps {
  params: Promise<{ locale: string; date: string }>
}

export async function generateMetadata({ params }: ApodPageProps): Promise<Metadata> {
  const { date } = await params
  const result = await getApodByDate(date)

  return buildApodMetadata(result.isSuccess() ? result.value : null)
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

  const dictionary = await getDictionary(locale)

  return (
    <main className="flex-1">
      <ApodDetail apod={result.value} dictionary={dictionary} locale={locale} />
    </main>
  )
}
