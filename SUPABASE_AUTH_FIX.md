# Panduan Perbaikan Email Verification & OTP Expiry Issues

## 🔴 Masalah yang Teridentifikasi

1. **Email Link Invalid atau Expired (403 Error)**

   - Link verifikasi email Anda expire terlalu cepat
   - URL redirect mungkin tidak dikonfigurasi dengan benar di Supabase

2. **OTP Expired**

   - Waktu OTP terlalu singkat (default 15 menit di Supabase)
   - Kemungkinan time synchronization issue

3. **Kemungkinan Penyebab Utama:**
   - `NEXT_PUBLIC_SITE_URL` environment variable tidak dikonfigurasi
   - Fallback ke `window.location.origin` yang mungkin salah saat di server
   - Redirect URL di Supabase project tidak match dengan aplikasi

## ✅ Solusi Perbaikan

### LANGKAH 1: Konfigurasi Environment Variables

**Edit atau buat file `.env.local` di root project:**

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# PENTING: Tambahkan Site URL (sesuaikan dengan environment)
# Untuk development:
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Untuk production (Vercel):
# NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### LANGKAH 2: Konfigurasi Supabase Project

Di dashboard Supabase project Anda:

1. **Go to: Authentication → Providers → Email**

   - Pastikan Email provider ENABLED
   - Set "Email Verification Expiry" = 86400 (24 jam) atau lebih tinggi

2. **Go to: Authentication → URL Configuration**

   - **Redirect URL untuk callback:**

     - Development: `http://localhost:3000/auth/callback`
     - Production: `https://your-domain.com/auth/callback`
     - Production: `https://your-domain.com/auth/confirm`

   - **Site URL:**
     - Development: `http://localhost:3000`
     - Production: `https://your-domain.com`

3. **Go to: Authentication → Policies**
   - Pastikan "Email Verification Required" sesuai kebutuhan

### LANGKAH 3: Perbaiki Kode (Jika masih ada issue)

**Update: app/signup/page.tsx**

```typescript
emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm?next=/dashboard`,
```

**Update: app/verify-email/page.tsx**

```typescript
emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm?next=/dashboard`,
```

### LANGKAH 4: Verifikasi Routes

Pastikan kedua file ini ada dan benar:

1. **`app/auth/callback/route.ts`** - Untuk OAuth callback
2. **`app/auth/confirm/route.ts`** - Untuk Email verification link

Kedua file sudah benar di project Anda ✓

## 🚀 Testing Checklist

Setelah konfigurasi:

1. ✅ Bersihkan browser cache/cookies
2. ✅ Restart development server: `npm run dev`
3. ✅ Test signup dengan email baru
4. ✅ Cek apakah email masuk dalam 2 menit
5. ✅ Klik link di email
6. ✅ Seharusnya redirect ke dashboard (atau login jika sudah logout)
7. ✅ Jika error, cek email link yang diterima - bandingkan domain dengan `NEXT_PUBLIC_SITE_URL`

## 🔧 Troubleshooting

### Email tidak diterima sama sekali?

- Cek di folder SPAM/Junk
- Cek di Supabase dashboard → Logs apakah ada error saat send email
- Pastikan Email provider di Supabase sudah ENABLED

### Masih dapat error 403 Expired?

1. Buka Supabase dashboard → Log in dengan akun project
2. Go to: SQL Editor
3. Run query untuk check user:

```sql
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;
```

### Email link domain salah?

- Contoh link yang diterima: `http://localhost:3000/auth/confirm?token_hash=...`
- Jika domain tidak match dengan `NEXT_PUBLIC_SITE_URL`, update variable environment

## 📝 Daftar Environment Variables

Tambahkan ke `.env.local`:

```env
# ============ SUPABASE ============
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# ============ SITE CONFIGURATION ============
# HARUS dikonfigurasi dengan benar!
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## ⏰ Default Timing di Supabase

- Email verification link: 24 jam (bisa dikonfigurasi)
- OTP: 15 menit (tidak bisa diubah via UI, hubungi support)
- Session: 1 jam (refresh token: 7 hari)

Jika Anda ingin ubah timing OTP, hubungi Supabase support atau upgrade ke Supabase Pro.

## ✨ Best Practices

1. ✅ Selalu set `NEXT_PUBLIC_SITE_URL` yang sesuai dengan environment
2. ✅ Jangan rely pada `window.location.origin` saat generate email link
3. ✅ Test email verification flow di development SEBELUM production
4. ✅ Monitor Supabase logs untuk error saat proses verifikasi
5. ✅ Implementasikan "resend verification email" button (sudah ada di verify-email page)
