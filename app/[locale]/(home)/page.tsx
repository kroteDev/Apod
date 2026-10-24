import type { Metadata } from "next"
import { ApodCard } from "@/app/components/apod/apod-card"
import { ApodDetail } from "@/app/components/apod/apod-detail"
import { getApodPage } from "@/app/lib/apod"
import { buildApodMetadata } from "@/app/lib/apod-metadata"
import { getDictionary } from "@/helpers/internationalization/get-dictionary"
import { toIsoDate } from "@/utils/iso-date"

const HOME_PAGE_SIZE = 25

interface HomeProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const result = await getApodPage({ per_page: HOME_PAGE_SIZE })
  const featured = result.isSuccess() ? result.value.items[0] : undefined

  return buildApodMetadata(featured ?? null)
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params
  const dictionary = await getDictionary(locale)
  const result = await getApodPage({ per_page: HOME_PAGE_SIZE })

  if (result.isError()) {
    throw result.value
  }

  const [featured, ...rest] = result.value.items

  if (!featured) {
    return (
      <section className="mx-auto w-full max-w-5xl flex-1 bg-white px-4 py-14 shadow-lg md:px-8">
        <p className="text-grey-dark">{dictionary.home_page.empty}</p>
      </section>
    )
  }

  return (
    <section className="flex-1">
      <ApodDetail apod={featured} dictionary={dictionary} locale={locale} />

      {rest.length > 0 && (
        <section className="mx-auto container px-4 md:px-8">
          <header className="my-28">
            <h2 className="text-4xl font-semibold text-nasa-blue md:text-7xl">{dictionary.home_page.page_title}</h2>
          </header>

          {rest.map((apod) => (
            <ApodCard key={toIsoDate(apod.date)} apod={apod} dictionary={dictionary} locale={locale} />
          ))}
        </section>
      )}
    </section>
  )
}
