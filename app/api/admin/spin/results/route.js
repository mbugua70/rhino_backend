import { NextResponse } from 'next/server'
import { getSessionData } from '@/lib/session'

const BACKEND_URL = process.env.BACKEND_API_URL

export async function GET(request) {
  const { token, isLoggedIn } = await getSessionData()
  if (!isLoggedIn) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || 1
    const limit = searchParams.get('limit') || 10

    const res = await fetch(
      `${BACKEND_URL}/api/admin/spin/results?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('[SPIN RESULTS]', error)
    return NextResponse.json({ message: 'Failed to fetch results' }, { status: 500 })
  }
}
