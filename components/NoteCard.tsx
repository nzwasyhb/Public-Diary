interface NoteCardProps {
  note: {
    id: string
    created_at: string
    content: string
    user_email: string
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-500">{note.user_email}</p>
          <p className="text-xs text-gray-400">{date}</p>
        </div>
        {showDelete && isOwner && onDelete && (
          <button
            onClick={() => onDelete(note.id)}
            className="text-red-600 hover:text-red-800 text-sm font-semibold"
          >
            Hapus
          </button>
        )}
      </div>
      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{note.content}</p>
    </div>
  )
}
