import { Locale, defaultLocale, isSupportedLocale } from '@/helpers/internationalization'
import type ptBR from '@/resources/dictionaries/pt_BR.json'

export type Dictionary = typeof ptBR

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  'pt-BR': () => import('@/resources/dictionaries/pt_BR.json').then((module) => module.default),
  'en-US': () => import('@/resources/dictionaries/en_US.json').then((module) => module.default),
}

export async function getDictionary(locale: string): Promise<Dictionary> {
  const key: Locale = isSupportedLocale(locale) ? locale : defaultLocale
  return dictionaries[key]()
}
