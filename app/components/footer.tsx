import Link from "next/link"
import { getDictionary } from "@/helpers/internationalization/get-dictionary"

export async function Footer({ locale }: { locale: string }) {
  const dictionary = await getDictionary(locale)

  return (
    <footer className="mt-28 bg-linear-to-t from-gradient-1 to-gradient-2 px-4 pb-5 pt-8 text-white">
      <div className="container mx-auto flex flex-wrap justify-center gap-8 md:justify-between">
        <div>
          <h2 className="mb-5 text-lg font-bold">{dictionary.main_footer.follow_me}</h2>
          <ul className="space-y-3">
            <li>
              <Link href="https://www.facebook.com/krotedev" target="_blank" rel="noreferrer" title={`${dictionary.main_footer.follow_me} facebook`}>
                Facebook
              </Link>
            </li>
            <li>
              <Link href="https://www.instagram.com/krotedev/" target="_blank" rel="noreferrer" title={`${dictionary.main_footer.follow_me} instagram`}>
                Instagram
              </Link>
            </li>
            <li>
              <Link href="https://www.linkedin.com/in/bolliveira/" target="_blank" rel="noreferrer" title={`${dictionary.main_footer.follow_me} linkedin`}>
                LinkedIn
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-5 text-lg font-bold">{dictionary.main_footer.more_about_nasa}</h2>
          <ul className="space-y-3">
            <li>
              <Link href="https://www.nasa.gov/" target="_blank" rel="noreferrer" className="uppercase">
                {dictionary.main_footer.nasa}
              </Link>
            </li>
            <li>
              <Link href="https://apod.nasa.gov/apod/" target="_blank" rel="noreferrer" className="uppercase">
                {dictionary.main_footer.apod}
              </Link>
            </li>
            <li>
              <Link href="https://www.nasa.gov/offices/odeo/no-fear-act" target="_blank" rel="noreferrer">
                {dictionary.main_footer.no_fear_act}
              </Link>
            </li>
          </ul>
        </div>

        <p className="w-full text-center text-xs font-bold">
          {dictionary.main_footer.made_with_love}{" "}
          <Link href="https://www.krotedev.com.br" className="text-nasa-red" target="_blank" rel="noreferrer">
            KröteDev
          </Link>
        </p>
      </div>
    </footer>
  )
}
