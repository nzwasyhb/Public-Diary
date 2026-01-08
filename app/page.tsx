import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import NoteCard from '@/components/NoteCard'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = await createServerClient()
  
  const { data: notes } = await supabase
    .from('notes')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
              📖
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Public Diary</h1>
          </div>
          <div className="flex gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg font-semibold"
                >
                  📖 Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2.5 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all shadow-md hover:shadow-lg font-semibold border-2 border-purple-200"
                >
                  🔑 Login
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg font-semibold"
                >
                  ✨ Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="text-7xl mb-4 animate-bounce">📝</div>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Catatan Publik untuk Semua
          </h2>
          <p className="text-gray-700 text-xl max-w-2xl mx-auto leading-relaxed">
            Tempat berbagi cerita, curhat, dan pemikiran secara anonim. 
            <span className="block mt-2 font-semibold text-purple-600">Ekspresikan dirimu dengan bebas! ❤️</span>
          </p>
        </div>

        <div className="space-y-5">
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
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-purple-100">
              <div className="text-6xl mb-4">🌟</div>
              <p className="text-gray-600 text-xl font-semibold mb-2">Belum ada catatan</p>
              <p className="text-gray-400">Jadilah yang pertama berbagi cerita!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
