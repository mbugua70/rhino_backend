import { unsealData } from 'iron-session'
import { NextResponse } from 'next/server'

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'spin-admin-session'
const SESSION_SECRET = process.env.SESSION_SECRET

const PUBLIC_PATHS = ['/login', '/api/auth/login']

export async function middleware(request) {
  const { pathname } = request.nextUrl

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/api/admin')

  const cookieValue = request.cookies.get(SESSION_COOKIE_NAME)?.value

  let session = null
  if (cookieValue && SESSION_SECRET) {
    try {
      session = await unsealData(cookieValue, { password: SESSION_SECRET })
    } catch {
      session = null
    }
  }

  const isAuthenticated = !!(session?.token)

  // Redirect unauthenticated users trying to access protected paths
  if (isAdminPath && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from login
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Redirect root to /admin (or /login if not authed)
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(isAuthenticated ? '/admin' : '/login', request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/admin/:path*', '/api/admin/:path*'],
}
