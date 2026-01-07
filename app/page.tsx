import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import NoteCard from '@/components/NoteCard'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createServerClient()
  
  const { data: notes } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">📖 Public Diary</h1>
          <div className="flex gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Catatan Publik untuk Semua
          </h2>
          <p className="text-gray-600 text-lg">
            Tempat berbagi cerita, curhat, dan pemikiran secara anonim
          </p>
        </div>

        <div className="space-y-4">
          {notes && notes.length > 0 ? (
            notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isOwner={user?.id === note.user_id}
                showDelete={false}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg">Belum ada catatan. Jadilah yang pertama!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
