import { NextResponse } from 'next/server'
import { getSessionData } from '@/lib/session'

const BACKEND_URL = process.env.BACKEND_API_URL

export async function PATCH(request, { params }) {
  const { token, isLoggedIn } = await getSessionData()
  if (!isLoggedIn) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()
    const res = await fetch(
      `${BACKEND_URL}/api/admin/spin/segments/${id}/update-quantity`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    )
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('[UPDATE QUANTITY]', error)
    return NextResponse.json({ message: 'Failed to update quantity' }, { status: 500 })
  }
}
