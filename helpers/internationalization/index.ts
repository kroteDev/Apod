export const supportedLocales = ['pt-BR', 'en-US'] as const

export type Locale = (typeof supportedLocales)[number]

export const defaultLocale: Locale = 'pt-BR'

export function isSupportedLocale(value: string): value is Locale {
  return (supportedLocales as readonly string[]).includes(value)
}

export function isLocaleLike(value: string): boolean {
  return /^[a-z]{2}(-[A-Z]{2})?$/.test(value)
}
