import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, isLocaleLike, isSupportedLocale, supportedLocales } from '@/helpers/internationalization'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const firstSegment = pathname.split('/')[1] ?? ''

  if (isSupportedLocale(firstSegment)) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  const rest = pathname.slice(firstSegment.length + 1)
  const language = supportedLocales.find((locale) => locale.split('-')[0] === firstSegment)

  if (language) {
    url.pathname = `/${language}${rest}`
  } else if (isLocaleLike(firstSegment)) {
    url.pathname = `/${defaultLocale}${rest}`
  } else {
    url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
  }

  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
