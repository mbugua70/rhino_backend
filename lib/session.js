import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: process.env.SESSION_COOKIE_NAME || 'spin-admin-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
}

export { sessionOptions }

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession(cookieStore, sessionOptions)
}

export async function getSessionData() {
  const session = await getSession()
  return {
    token: session.token || null,
    admin: session.admin || null,
    isLoggedIn: !!session.token,
  }
}
