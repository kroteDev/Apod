import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Geist, Geist_Mono } from "next/font/google"
import { DictionaryProvider } from "@/app/providers/dictionary-provider"
import { Header } from "@/app/components/header"
import { Footer } from "@/app/components/footer"
import { defaultLocale, isSupportedLocale, supportedLocales } from "@/helpers/internationalization"
import { getDictionary } from "@/helpers/internationalization/get-dictionary"
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
    redirect(`/${defaultLocale}`)
  }

  const dictionary = await getDictionary(locale)

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
       
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
