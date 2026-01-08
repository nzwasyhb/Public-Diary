'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import NoteCard from '@/components/NoteCard'
import NoteForm from '@/components/NoteForm'

interface Note {
  id: string
  created_at: string
  content: string
  user_id: string
  user_email: string
  username: string | null
  is_public: boolean
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [username, setUsername] = useState<string>('')
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkUser()
    fetchNotes()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
    } else {
      setUser(user)
      // Ambil username dari profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        setUsername(profile.username)
      }
    }
    setLoading(false)
  }

  const fetchNotes = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (data) setNotes(data)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)

    if (!error) {
      setNotes(notes.filter(note => note.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {username.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">📖 Dashboard</h1>
              <p className="text-xs text-gray-600">@{username || user.email}</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => router.push('/')}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg font-semibold text-sm"
            >
              🌍 Feed Publik
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg font-semibold text-sm"
            >
              👋 Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-800">✍️ Tulis Catatan Baru</h2>
          </div>
          <NoteForm onSuccess={fetchNotes} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-800">📚 Catatan Saya</h2>
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-md">
              <span className="text-sm font-bold text-purple-600">{notes.length} Catatan</span>
            </div>
          </div>
          <div className="space-y-4">
            {notes.length > 0 ? (
              notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isOwner={true}
                  showDelete={true}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-600 text-lg font-semibold mb-2">Belum ada catatan</p>
                <p className="text-gray-400 text-sm">Mulai tulis catatan pertamamu sekarang!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
