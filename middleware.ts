import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  if (!request.cookies.get('visitor_id')) {
    response.cookies.set('visitor_id', uuidv4(), {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: false,
      sameSite: 'lax',
    })
  }
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
