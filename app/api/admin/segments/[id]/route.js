import { NextResponse } from 'next/server'
import { getSessionData } from '@/lib/session'

const BACKEND_URL = process.env.BACKEND_API_URL

async function proxyRequest(method, path, body = null, token) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }
  if (body) options.body = JSON.stringify(body)
  const res = await fetch(`${BACKEND_URL}${path}`, options)
  const data = await res.json()
  return { data, status: res.status }
}

export async function PATCH(request, { params }) {
  const { token, isLoggedIn } = await getSessionData()
  if (!isLoggedIn) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()
    const { data, status } = await proxyRequest(
      'PATCH',
      `/api/admin/spin/segments/${id}`,
      body,
      token
    )
    return NextResponse.json(data, { status })
  } catch (error) {
    console.error('[SEGMENT PATCH]', error)
    return NextResponse.json({ message: 'Failed to update segment' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const { token, isLoggedIn } = await getSessionData()
  if (!isLoggedIn) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const { data, status } = await proxyRequest(
      'DELETE',
      `/api/admin/spin/segments/${id}`,
      null,
      token
    )
    return NextResponse.json(data, { status })
  } catch (error) {
    console.error('[SEGMENT DELETE]', error)
    return NextResponse.json({ message: 'Failed to delete segment' }, { status: 500 })
  }
}
