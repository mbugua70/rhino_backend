import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

const BACKEND_URL = process.env.BACKEND_API_URL

export async function POST(request) {
  try {
    const body = await request.json()

    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok || !data.success) {
      return NextResponse.json(
        { success: false, message: data.message || 'Login failed' },
        { status: res.status }
      )
    }

    const session = await getSession()
    session.token = data.token
    session.admin = data.admin
    await session.save()

    return NextResponse.json({
      success: true,
      admin: data.admin,
    })
  } catch (error) {
    console.error('[AUTH LOGIN]', error)
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
