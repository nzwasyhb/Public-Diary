# Public Diary 📖

Aplikasi full-stack untuk berbagi catatan dan curhat secara publik.

## 🚀 Features

- ✅ **Authentication System** - Sign up, Login, Logout dengan Supabase Auth
- ✅ **Public Feed** - Semua catatan tampil publik dan bisa dibaca siapa saja
- ✅ **User Dashboard** - Kelola catatan pribadi Anda
- ✅ **Row Level Security** - Keamanan tingkat database
- ✅ **Real-time Updates** - Catatan muncul langsung setelah posting

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Supabase (Authentication + PostgreSQL Database)
- **Deployment:** Vercel

## 📦 Installation

1. Clone repository:

```bash
git clone <your-repo-url>
cd Public-Diary
```

2. Install dependencies:

```bash
npm install
```

3. Setup environment variables:
   Create `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. Setup Supabase database:
   Follow instructions in [SETUP.md](./SETUP.md)

5. Run development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📝 Database Setup

See [SETUP.md](./SETUP.md) for complete database and deployment instructions.

## 🎯 How It Works

1. **Sign Up/Login** - Create account with email and password
2. **Write Notes** - Go to Dashboard and create your notes
3. **Public Feed** - All notes appear on home page for everyone to read
4. **Manage Notes** - Edit and delete only your own notes

## 🔒 Security

- Row Level Security (RLS) enforced at database level
- Only authenticated users can create notes
- Users can only delete their own notes
- Public read access for all notes

## 🚀 Deploy to Vercel

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

## 📄 License

MIT

## 👨‍💻 Author

Built with ❤️ using Next.js and Supabase
