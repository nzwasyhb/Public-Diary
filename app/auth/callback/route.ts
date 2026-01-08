import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Successfully verified! Redirect to dashboard
      return NextResponse.redirect(`${origin}${next}`)
    }
    
    console.error('Auth callback error:', error)
    
    // Handle specific errors
    if (error.message?.includes('expired') || error.message?.includes('invalid')) {
      return NextResponse.redirect(`${origin}/verify-email?error=expired`)
    }
  }

  // No code or other error - redirect to login
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
