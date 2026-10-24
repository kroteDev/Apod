import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Geist, Geist_Mono } from "next/font/google"
import { DictionaryProvider } from "@/app/providers/dictionary-provider"
import { Header } from "@/app/components/header"
import { Footer } from "@/app/components/footer"
import { isSupportedLocale, supportedLocales } from "@/helpers/internationalization"
import { getDictionary } from "@/helpers/internationalization/get-dictionary"
import { THEME_STORAGE_KEY } from "@/helpers/theme"
import "@/app/globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "KröteDev APOD",
  description: "KröteDev APOD - Astronomy Picture of the Day",
}

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!isSupportedLocale(locale)) {
    notFound()
  }

  const dictionary = await getDictionary(locale)

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="dark")document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-site-background">
        <DictionaryProvider value={dictionary}>
          <Header locale={locale} />
          {children}
          <Footer locale={locale} />
        </DictionaryProvider>
      </body>
    </html>
  )
}
