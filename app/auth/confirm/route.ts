import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/dashboard'

  console.log('[Auth Confirm] Processing verification:', { token_hash: !!token_hash, type, origin })

  if (token_hash && type) {
    const supabase = await createServerClient()

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        type: type as any,
        token_hash,
      })

      if (!error) {
        console.log('[Auth Confirm] Verification successful')
        // Redirect to dashboard on success
        return NextResponse.redirect(`${origin}${next}`)
      }

      console.error('[Auth Confirm] Token verification error:', error)

      // Handle specific error messages
      const errorMessage = error.message?.toLowerCase() || ''
      if (errorMessage.includes('expired')) {
        console.log('[Auth Confirm] Token expired')
        return NextResponse.redirect(`${origin}/verify-email?error=expired`)
      }
      if (errorMessage.includes('invalid')) {
        console.log('[Auth Confirm] Token invalid')
        return NextResponse.redirect(`${origin}/verify-email?error=invalid`)
      }

      // Generic error
      return NextResponse.redirect(`${origin}/verify-email?error=verification_failed`)
    } catch (err: any) {
      console.error('[Auth Confirm] Unexpected error:', err)
      return NextResponse.redirect(`${origin}/verify-email?error=error`)
    }
  }

  console.log('[Auth Confirm] No token or type provided')
  // No token or verification failed
  return NextResponse.redirect(`${origin}/login?error=verification_failed`)
}
