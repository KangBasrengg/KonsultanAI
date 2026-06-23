import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  // Singleton pattern: reuse the same client across the entire app.
  // This prevents useCallback/useEffect dependency instability when
  // components call createClient() in their render body.
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return client as ReturnType<typeof createBrowserClient>
}
