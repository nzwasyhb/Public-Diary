'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

function VerifyEmailContent() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const isExpired = searchParams.get('error') === 'expired'

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const supabase = createClient()
      
      // Determine the redirect URL correctly
      const redirectUrl = typeof window !== 'undefined' 
        ? (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin)
        : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${redirectUrl}/auth/confirm?next=/dashboard`,
        },
      })

      if (error) throw error
      setMessage('✅ Email verifikasi baru telah dikirim! Cek inbox Anda.')
    } catch (error: any) {
      setError(error.message || 'Gagal mengirim ulang email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className={`mx-auto w-16 h-16 ${isExpired ? 'bg-red-100' : 'bg-green-100'} rounded-full flex items-center justify-center`}>
            {isExpired ? (
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
        </div>
        
        {isExpired ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Link Sudah Expired!</h1>
            <p className="text-gray-600 mb-6">
              Link verifikasi email sudah tidak berlaku. Silakan kirim ulang email verifikasi untuk melanjutkan.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Cek Email Anda!</h1>
            <p className="text-gray-600 mb-6">
              Kami telah mengirimkan link verifikasi ke email Anda. Silakan cek inbox (atau folder spam) dan klik link untuk mengaktifkan akun.
            </p>
          </>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700 mb-6">
          <p className="font-semibold mb-2">Tips:</p>
          <ul className="text-left space-y-1">
            <li>• Cek folder spam/junk jika tidak menemukan email</li>
            <li>• Link verifikasi berlaku dalam 1 jam</li>
            <li>• Setelah verifikasi, Anda bisa langsung login</li>
          </ul>
        </div>

        {/* Resend Verification Form */}
        <div className="border-t pt-6">
          <p className="text-sm text-gray-600 mb-4">Tidak menerima email?</p>
          <form onSubmit={handleResendVerification} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email Anda"
              required
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-2.5 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? '⏳ Mengirim...' : '📧 Kirim Ulang Email'}
            </button>
          </form>

          {message && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              ❌ {error}
            </div>
          )}
        </div>

        <div className="mt-6 text-sm">
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            ← Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
