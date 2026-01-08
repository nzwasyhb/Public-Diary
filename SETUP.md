# Public Diary - Database Setup

## Supabase Setup Instructions

### 1. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Save your project URL and anon key

### 2. Update Environment Variables
Update `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Create Database Table

Run this SQL in Supabase SQL Editor:

```sql
-- Create notes table
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL
);

-- Create index for faster queries
CREATE INDEX notes_user_id_idx ON notes(user_id);
CREATE INDEX notes_created_at_idx ON notes(created_at DESC);
```

### 4. Set Up Row Level Security (RLS)

Enable RLS and create policies:

```sql
-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read all notes (public feed)
CREATE POLICY "Anyone can read notes"
ON notes FOR SELECT
USING (true);

-- Policy: Only authenticated users can insert notes
CREATE POLICY "Authenticated users can insert notes"
ON notes FOR INSERT
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Policy: Users can only delete their own notes
CREATE POLICY "Users can delete own notes"
ON notes FOR DELETE
USING (auth.uid() = user_id);
```

### 5. Verify RLS Policies

Your table should have these policies:
- ✅ Public read access (SELECT)
- ✅ Authenticated insert (INSERT) - only for own notes
- ✅ Owner delete (DELETE) - only for own notes

### 6. Test Authentication

Make sure email authentication is enabled:
1. Go to Authentication > Providers
2. Enable Email provider
3. Configure email templates (optional)

## Deployment to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### 3. Test Your App
- Sign up with a new account
- Create a note in dashboard
- View it on public feed
- Delete your own notes
- Verify others can't delete your notes

## Security Notes

✅ **What's Secured:**
- Only authenticated users can create notes
- Users can only delete their own notes
- All notes are publicly readable
- Row Level Security enforces all rules at database level

✅ **Best Practices:**
- Never commit `.env.local` to git (already in .gitignore)
- Use Vercel environment variables for production
- Keep your Supabase anon key safe (it's safe to expose in client)
- The anon key has RLS protection, so it's secure for client-side use

## Troubleshooting

**Can't create notes?**
- Check if user is authenticated
- Verify RLS policies are created
- Check browser console for errors

**Can't see notes?**
- Verify SELECT policy allows public access
- Check if notes exist in database

**Can't delete notes?**
- Verify you own the note (user_id matches)
- Check DELETE policy is created

## Database Structure

```
notes
├── id (uuid, primary key)
├── created_at (timestamp)
├── content (text)
├── user_id (uuid, foreign key to auth.users)
└── user_email (text)
```
