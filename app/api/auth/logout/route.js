import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function POST() {
  try {
    const session = await getSession()
    session.destroy()
    return NextResponse.json({ success: true, message: 'Logged out' })
  } catch (error) {
    console.error('[AUTH LOGOUT]', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
