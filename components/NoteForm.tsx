'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface NoteFormProps {
  onSuccess: () => void
}

export default function NoteForm({ onSuccess }: NoteFormProps) {
  const [content, setContent] = useState('')
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

      const { error } = await supabase
        .from('notes')
        .insert({
          content,
          user_id: user.id,
          user_email: user.email || 'Anonymous'
        })

      if (error) throw error

      setContent('')
      onSuccess()
    } catch (error: any) {
      setError(error.message || 'Gagal menambahkan catatan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Tulis curhatmu di sini..."
        required
        rows={6}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
      />
      
      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
      >
        {loading ? 'Memposting...' : 'Posting Catatan'}
      </button>
    </form>
  )
}
