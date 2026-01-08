interface NoteCardProps {
  note: {
    id: string
    created_at: string
    content: string
    user_email: string
    username?: string | null
    is_public?: boolean
  }
  isOwner: boolean
  showDelete: boolean
  onDelete?: (id: string) => void
}

export default function NoteCard({ note, isOwner, showDelete, onDelete }: NoteCardProps) {
  const date = new Date(note.created_at).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  // Tampilkan username, jika tidak ada gunakan email
  const displayName = note.username || note.user_email

  return (
    <div className="group bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-purple-200 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">@{displayName}</p>
              {isOwner && note.is_public === false && (
                <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                  🔒 Pribadi
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 ml-10">{date}</p>
        </div>
        {showDelete && isOwner && onDelete && (
          <button
            onClick={() => onDelete(note.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg text-sm font-semibold"
          >
            🗑️ Hapus
          </button>
        )}
      </div>
      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed pl-10">{note.content}</p>
    </div>
  )
}
