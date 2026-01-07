export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Cek Email Anda!</h1>
        <p className="text-gray-600 mb-6">
          Kami telah mengirimkan link verifikasi ke email Anda. Silakan cek inbox (atau folder
          spam) dan klik link untuk mengaktifkan akun.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
          <p className="font-semibold mb-2">Tips:</p>
          <ul className="text-left space-y-1">
            <li>• Cek folder spam/junk jika tidak menemukan email</li>
            <li>• Link verifikasi berlaku dalam 24 jam</li>
            <li>• Setelah verifikasi, Anda bisa langsung login</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
