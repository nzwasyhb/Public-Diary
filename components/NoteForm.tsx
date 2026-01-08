'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface NoteFormProps {
  onSuccess: () => void
}

export default function NoteForm({ onSuccess }: NoteFormProps) {
  const [content, setContent] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User tidak terautentikasi')
      }

      // Ambil username dari profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

      const { error } = await supabase
        .from('notes')
        .insert({
          content,
          user_id: user.id,
          user_email: user.email || 'Anonymous',
          username: profile?.username || 'Anonymous',
          is_public: isPublic
        })

      if (error) throw error

      setContent('')
      setIsPublic(true)
      onSuccess()
    } catch (error: any) {
      setError(error.message || 'Gagal menambahkan catatan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg p-8 border border-purple-100">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="✨ Tulis curhatmu di sini... Apa yang kamu pikirkan hari ini?"
          required
          rows={6}
          className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 resize-none transition-all duration-200 text-gray-700 placeholder-gray-400"
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
          {content.length} karakter
        </div>
      </div>
      
      <div className="mt-5 p-4 bg-white rounded-xl border border-gray-200">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <span className="text-sm font-bold text-gray-800 block">
              {isPublic ? '🌍 Posting Publik' : '🔒 Simpan Pribadi'}
            </span>
            <span className="text-xs text-gray-500">
              {isPublic ? 'Semua orang bisa melihat catatan ini' : 'Hanya kamu yang bisa melihat catatan ini'}
            </span>
          </div>
        </label>
      </div>
      
      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-lg text-sm flex items-start gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {loading ? '⏳ Memposting...' : (isPublic ? '🚀 Posting Catatan' : '💾 Simpan Catatan Pribadi')}
      </button>
    </form>
  )
}
