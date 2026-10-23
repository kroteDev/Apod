import Link from "next/link"
import { getDictionary } from "@/helpers/internationalization/get-dictionary"
import { supportedLocales } from "@/helpers/internationalization"

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const dictionary = await getDictionary(locale)

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-semibold text-nasa-blue">{dictionary.home_page.page_title}</h1>
      <p>
        {dictionary.site_info.title} - {dictionary.site_info.subtitle} ({locale})
      </p>
      <nav className="flex gap-4">
        {supportedLocales.map((supported) => (
          <Link key={supported} href={`/${supported}`} className="underline">
            {supported}
          </Link>
        ))}
      </nav>
    </main>
  )
}
