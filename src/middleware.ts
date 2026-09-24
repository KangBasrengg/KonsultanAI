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

  // Passive cleanup to prevent memory leak safely across serverless/worker runtimes
  if (rateLimitMap.size > 200) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (now - v.lastReset > RATE_LIMIT_WINDOW_MS * 2) {
        rateLimitMap.delete(k)
      }
    }
  }

  const entry = rateLimitMap.get(key)

  if (!entry || now - entry.lastReset > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(key, { count: 1, lastReset: now })
    return true
  }

  entry.count++
  return entry.count <= maxRequests
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

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
      return response
    }
  }

  // --- Auth Protection for protected page routes ---
  const isProtectedRoute = protectedRoutes.some(r => pathname.startsWith(r))
  const isAdminRoute = adminRoutes.some(r => pathname.startsWith(r))

  if (isProtectedRoute || isAdminRoute) {
    // Create a Supabase client that can read and forward refreshed cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Redirect unauthenticated users to home with login trigger and forward cookies
      const redirectUrl = new URL('/?login=true', request.url)
      const redirectResponse = NextResponse.redirect(redirectUrl)
      response.cookies.getAll().forEach(c => redirectResponse.cookies.set(c.name, c.value))
      return redirectResponse
    }

    // For admin routes, verify role
    if (isAdminRoute) {
      const { data: profile } = await supabase
        .from('users')
        .select('role, has_analytics_access, institution_type')
        .eq('id', user.id)
        .single()

      let isAllowed = profile?.role === 'admin'
      
      if (pathname.startsWith('/admin/analytics')) {
        isAllowed = isAllowed || profile?.role === 'government' || profile?.has_analytics_access || profile?.institution_type === 'pemerintah'
      }

      if (!isAllowed) {
        const redirectResponse = NextResponse.redirect(new URL('/', request.url))
        response.cookies.getAll().forEach(c => redirectResponse.cookies.set(c.name, c.value))
        return redirectResponse
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    // Match all protected page routes and API routes
    // Exclude static files, images, and metadata files
    '/((?!_next/static|_next/image|favicon.ico|icon.png|sitemap.xml|robots.txt).*)',
  ],
}
