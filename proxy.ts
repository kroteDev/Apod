import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, isSupportedLocale, supportedLocales } from '@/helpers/internationalization'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const firstSegment = pathname.split('/')[1] ?? ''

  if (isSupportedLocale(firstSegment)) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  const language = supportedLocales.find((locale) => locale.split('-')[0] === firstSegment)

  // "/pt/..." -> "/pt-BR/...", otherwise "/..." -> "/pt-BR/..."
  url.pathname = language
    ? `/${language}${pathname.slice(firstSegment.length + 1)}`
    : `/${defaultLocale}${pathname === '/' ? '' : pathname}`

  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
