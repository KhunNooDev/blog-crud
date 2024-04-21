import { NextResponse, NextRequest } from 'next/server'
import acceptLanguage from 'accept-language'
import { cookieName, fallbackLng, locales } from './i18n/settings'
import { withAuth } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const isAuthenticated = !!token

  let lng: string | undefined | null
  if (req.cookies.has(cookieName)) lng = acceptLanguage.get(req.cookies.get(cookieName)?.value)
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!lng) lng = fallbackLng
  // Redirect if lng in path is not supported
  if (!locales.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`)) && !req.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.pathname}`, req.url))
  }

  // Redirect authenticated users from sign-in/sign-up pages to the home page
  if (isAuthenticated && (req.nextUrl.pathname.includes('/sign-in') || req.nextUrl.pathname.includes('/sign-up'))) {
    return NextResponse.redirect(new URL('/', req.url))
  } else if (
    !isAuthenticated &&
    !(req.nextUrl.pathname.includes('/sign-in') || req.nextUrl.pathname.includes('/sign-up'))
  ) {
    // Redirect unauthenticated users to the sign-in page
    return NextResponse.redirect(new URL(`/${lng}/sign-in`, req.url))
  }
  const authMiddleware = await withAuth({
    pages: {
      signIn: req.nextUrl.pathname,
    },
  })

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') || '')
    const lngInReferer = locales.find(l => refererUrl.pathname.startsWith(`/${l}`))
    const response = NextResponse.next()
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
    return response
  }

  return await (authMiddleware as any)(req)
}

export const config = {
  // Do not run the middleware on the following paths
  matcher: ['/((?!api|_next/static|_next/image|manifest.json|assets|favicon.ico).*)'],
}
