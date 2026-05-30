import { NextResponse } from 'next/server'
import { getSessionData } from '@/lib/session'

const BACKEND_URL = process.env.BACKEND_API_URL

export async function PATCH(request, { params }) {
  const { token, isLoggedIn } = await getSessionData()
  if (!isLoggedIn) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const res = await fetch(
      `${BACKEND_URL}/api/admin/spin/segments/${id}/toggle-winnable`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('[TOGGLE WINNABLE]', error)
    return NextResponse.json({ message: 'Failed to toggle winnable' }, { status: 500 })
  }
}
