import { NextResponse } from 'next/server'
import { getSessionData } from '@/lib/session'

export async function GET() {
  try {
    const { admin, isLoggedIn } = await getSessionData()
    if (!isLoggedIn) {
      return NextResponse.json({ isLoggedIn: false, admin: null }, { status: 401 })
    }
    return NextResponse.json({ isLoggedIn: true, admin })
  } catch (error) {
    console.error('[AUTH SESSION]', error)
    return NextResponse.json({ isLoggedIn: false, admin: null }, { status: 500 })
  }
}
