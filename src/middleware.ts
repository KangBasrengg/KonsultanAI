import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Routes that require authentication
const protectedRoutes = ['/konsultasi', '/pengaturan', '/chat', '/konsultasi-advokat']
// Routes that require admin role (checked client-side as well, but this prevents direct access)
const adminRoutes = ['/admin']

// Simple in-memory rate limiter for API routes
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30 // max requests per window for API
const RATE_LIMIT_CHAT_MAX = 10 // stricter limit for AI chat

function checkRateLimit(key: string, maxRequests: number): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || now - entry.lastReset > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(key, { count: 1, lastReset: now })
    return true
  }

  entry.count++
  return entry.count <= maxRequests
}

// Periodically clean up old entries to prevent memory leak
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now - entry.lastReset > RATE_LIMIT_WINDOW_MS * 2) {
      rateLimitMap.delete(key)
    }
  }
}, RATE_LIMIT_WINDOW_MS * 5)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // --- Rate Limiting for API routes ---
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown'

    const isChatApi = pathname === '/api/chat'
    const maxReqs = isChatApi ? RATE_LIMIT_CHAT_MAX : RATE_LIMIT_MAX_REQUESTS
    const rateLimitKey = `${ip}:${isChatApi ? 'chat' : 'api'}`

    if (!checkRateLimit(rateLimitKey, maxReqs)) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan. Silakan tunggu sebentar sebelum mencoba lagi.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    // Webhook endpoint should not require auth — pass through
    if (pathname.startsWith('/api/webhook/')) {
      return NextResponse.next()
    }
  }

  // --- Auth Protection for protected page routes ---
  const isProtectedRoute = protectedRoutes.some(r => pathname.startsWith(r))
  const isAdminRoute = adminRoutes.some(r => pathname.startsWith(r))

  if (isProtectedRoute || isAdminRoute) {
    // Create a Supabase client that can read cookies from the request
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            // We'll set these on the response below
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Redirect unauthenticated users to home with login trigger
      const redirectUrl = new URL('/?login=true', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // For admin routes, verify role
    if (isAdminRoute) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all protected page routes and API routes
    // Exclude static files, images, and metadata files
    '/((?!_next/static|_next/image|favicon.ico|icon.png|sitemap.xml|robots.txt).*)',
  ],
}
