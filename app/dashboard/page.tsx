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
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">📖 Dashboard</h1>
          <div className="flex gap-3 items-center">
            <span className="text-gray-600">{user.email}</span>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Feed Publik
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Tulis Catatan Baru</h2>
          <NoteForm onSuccess={fetchNotes} />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Catatan Saya</h2>
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
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg">Belum ada catatan. Tulis yang pertama!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
