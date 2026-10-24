import Link from "next/link"
import { getDictionary } from "@/helpers/internationalization/get-dictionary"

const APOD_ABOUT_URL = "https://apod.nasa.gov/apod/lib/about_apod.html"

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const dictionary = await getDictionary(locale)
  const about = dictionary.about_page

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 bg-white px-4 py-8 shadow-lg md:px-8">
      <h1 className="mb-7 text-3xl font-semibold uppercase text-nasa-blue">{about.page_title}</h1>

      <p className="mb-4 text-grey-dark">{about.description_1}</p>
      <p className="mb-4 text-grey-dark">{about.description_2}</p>
      <p className="mb-4 text-grey-dark">
        {about.description_3}
        <Link href={APOD_ABOUT_URL} target="_blank" rel="noreferrer" className="font-semibold text-nasa-blue hover:underline">
          {about.click_here}
        </Link>
      </p>
      <p className="text-grey-dark">
        {about.description_4}
        <Link href={APOD_ABOUT_URL} target="_blank" rel="noreferrer" className="font-semibold text-nasa-blue hover:underline">
          {about.click_here}
        </Link>
      </p>
    </main>
  )
}
