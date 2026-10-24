'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useDictionary } from "@/app/providers/dictionary-provider"
import { Bars3Icon } from "@/app/components/icons/bars-3"
import { XMarkIcon } from "@/app/components/icons/x-mark"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { supportedLocales } from "@/helpers/internationalization"

export function Header({ locale }: { locale: string }) {
  const dictionary = useDictionary()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPathname, setMenuPathname] = useState(pathname)

  if (pathname !== menuPathname) {
    setMenuPathname(pathname)
    setMenuOpen(false)
  }

  const linkClass = "block px-4 py-3 font-bold uppercase text-white hover:underline md:inline-block"

  return (
    <header className="border-b-4 border-nasa-blue-light bg-nasa-blue px-4 py-3 text-white">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-x-4">
        <Link href={`/${locale}`} className="flex h-12 w-40 items-center text-xl font-bold uppercase">
          {dictionary.site_info.title}
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          aria-label={menuOpen ? dictionary.main_nav.close_menu : dictionary.main_nav.open_menu}
          className="p-2 md:hidden"
        >
          {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>

        <nav
          id="main-menu"
          className={`flex w-full flex-col overflow-hidden transition-[max-height,opacity,visibility] duration-300 ease-in-out md:ml-auto md:w-auto md:max-h-none md:flex-row md:items-center md:overflow-visible md:opacity-100 md:visible ${
            menuOpen ? "visible max-h-96 opacity-100" : "invisible max-h-0 opacity-0"
          }`}
        >
          <Link href="https://nasa.gov/" target="_blank" rel="noreferrer" className={linkClass}>
            {dictionary.main_nav.nasa}
          </Link>
          <Link href="https://apod.nasa.gov/apod" target="_blank" rel="noreferrer" className={linkClass}>
            {dictionary.main_nav.apod}
          </Link>
          <Link href={`/${locale}/about`} className={linkClass}>
            {dictionary.main_nav.about}
          </Link>
          {supportedLocales
            .filter((supported) => supported !== locale)
            .map((supported) => (
              <Link
                key={supported}
                href={`/${supported}${pathname.slice(locale.length + 1)}`}
                className={linkClass}
              >
                {supported}
              </Link>
            ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
