import { NextResponse } from 'next/server'
import { getSessionData } from '@/lib/session'

const BACKEND_URL = process.env.BACKEND_API_URL

export async function GET(request) {
  const { token, isLoggedIn } = await getSessionData()
  if (!isLoggedIn) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const params = new URLSearchParams()
    for (const [key, value] of searchParams.entries()) {
      params.set(key, value)
    }

    const res = await fetch(`${BACKEND_URL}/api/admin/players?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('[LEVELS PLAYERS]', error)
    return NextResponse.json({ message: 'Failed to fetch levels players' }, { status: 500 })
  }
}
