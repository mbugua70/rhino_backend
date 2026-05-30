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
  return { data, status: res.status, ok: res.ok }
}

export async function GET() {
  const { token, isLoggedIn } = await getSessionData()
  if (!isLoggedIn) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const { data, status } = await proxyRequest('GET', '/api/admin/spin/segments', null, token)
    return NextResponse.json(data, { status })
  } catch (error) {
    console.error('[SEGMENTS GET]', error)
    return NextResponse.json({ message: 'Failed to fetch segments' }, { status: 500 })
  }
}

export async function POST(request) {
  const { token, isLoggedIn } = await getSessionData()
  if (!isLoggedIn) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { data, status } = await proxyRequest('POST', '/api/admin/spin/segments', body, token)
    return NextResponse.json(data, { status })
  } catch (error) {
    console.error('[SEGMENTS POST]', error)
    return NextResponse.json({ message: 'Failed to create segment' }, { status: 500 })
  }
}
