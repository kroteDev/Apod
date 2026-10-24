'use client'

import { useDictionary } from "@/app/providers/dictionary-provider"

export default function NotFound() {
  const dictionary = useDictionary()

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 bg-white px-4 py-8 shadow-lg md:px-8">
      <h1 className="text-3xl font-semibold uppercase text-nasa-blue">{dictionary.apod.not_found}</h1>
    </main>
  )
}
