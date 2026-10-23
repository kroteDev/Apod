'use client'

import { createContext, useContext, type PropsWithChildren } from 'react'
import type { Dictionary } from '@/helpers/internationalization/get-dictionary'

const DictionaryContext = createContext<Dictionary | null>(null)

export function DictionaryProvider({ value, children }: PropsWithChildren<{ value: Dictionary }>) {
  return <DictionaryContext.Provider value={value}>{children}</DictionaryContext.Provider>
}

export function useDictionary(): Dictionary {
  const dictionary = useContext(DictionaryContext)

  if (!dictionary) {
    throw new Error('useDictionary must be used inside DictionaryProvider')
  }

  return dictionary
}
