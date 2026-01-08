# ⚡ CHECKLIST SETUP SUPABASE EMAIL VERIFICATION

## 📋 LANGKAH PERBAIKAN CEPAT (15 menit)

### ✅ STEP 1: Update `.env.local` File (WAJIB!)

Buat atau edit file `.env.local` di **root project** dengan:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **PENTING:**

- Ganti dengan credentials Supabase yang benar
- Untuk production, change `NEXT_PUBLIC_SITE_URL` ke domain Anda
- Jangan commit `.env.local` ke git (sudah ada di `.gitignore` hopefully)

---

### ✅ STEP 2: Konfigurasi Supabase Dashboard

**Login ke: https://supabase.com → Select Project → Authentication**

#### 2.1 Konfigurasi Email Provider

1. Go to **Providers → Email**
2. Pastikan **Status = ENABLED** (on/active)
3. Scroll down ke "Email Template Settings"
4. Pastikan email templates sudah default (jangan diubah)

#### 2.2 URL Configuration (PALING PENTING!)

1. Go to **URL Configuration** (masih di Authentication menu)
2. **Site URL:** Set ke `http://localhost:3000` (untuk development)
3. **Redirect URLs:** Tambahkan:

   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/auth/confirm
   http://localhost:3000/
   ```

   **Untuk Production di Vercel nanti:**

   ```
   https://your-domain.com/auth/callback
   https://your-domain.com/auth/confirm
   https://your-domain.com/
   ```

4. **SAVE/Update** perubahan

#### 2.3 Email Verification Time (Optional)

1. Go to **Policies**
2. Cek setting "Email Verification Expiry" atau sejenisnya
3. Set ke **24 jam** atau lebih (default biasanya 24 jam sudah cukup)

---

### ✅ STEP 3: Restart Development Server

```bash
# Stop server yang sedang berjalan (Ctrl+C)
# Lalu restart:
npm run dev
```

Pastikan di terminal terlihat: `▲ Next.js 16.1.1` dan server running di `http://localhost:3000`

---

### ✅ STEP 4: Test Email Verification Flow

1. **Bersihkan browser:**

   - Clear cookies/cache untuk `localhost:3000`
   - Atau gunakan **Incognito/Private mode**

2. **Test Signup:**

   - Go to `http://localhost:3000/signup`
   - Isi dengan email REAL yang bisa diakses (test email OK)
   - Isi password minimal 8 karakter
   - Isi username (3-30 karakter, alphanumeric + underscore)
   - Click "Daftar"
   - Seharusnya redirect ke `/verify-email`

3. **Cek Email:**

   - Check inbox (tunggu 30 detik - 2 menit)
   - Jika tidak ada, check **SPAM/Junk folder**
   - Email yang diterima seharusnya dari `noreply@xxx.supabase.co`

4. **Verifikasi:**
   - Buka link di email
   - Link format: `http://localhost:3000/auth/confirm?token_hash=xxx&type=signup`
   - Seharusnya berhasil dan redirect ke dashboard
   - Atau jika token expired, akan ke verify-email dengan error message

---

## 🔧 TROUBLESHOOTING

### ❌ Email tidak diterima sama sekali?

**Check #1: Supabase Email Delivery Logs**

1. Go to Supabase Dashboard → Home/Overview
2. Look for **Logs** atau **Email Logs**
3. Check apakah ada error saat sending email
4. Jika ada error, note error message-nya

**Check #2: Domain Email Sender**

- Default Supabase menggunakan `noreply@[project-id].supabase.co`
- Email mungkin ke spam karena tidak domain authentikasi SPF/DKIM
- Untuk production, configure Custom SMTP atau upgrade Supabase Pro

**Check #3: Firewall/ISP Block**

- Beberapa ISP block automated emails
- Test dengan email provider lain (Gmail, Outlook, dll)

---

### ❌ Dapat error "Link Invalid" atau "403"?

**Penyebab Paling Umum: URL Redirect Tidak Match**

1. Buka email link yang diterima → copy full URL
2. Contoh: `http://localhost:3000/auth/confirm?token_hash=abc123&type=signup`
3. Pastikan domain (`localhost:3000`) **MATCH** dengan `NEXT_PUBLIC_SITE_URL` di `.env.local`
4. Jika tidak match:
   - Update `.env.local` dengan yang benar
   - Restart server: `npm run dev`
   - Resend email verification

**Penyebab Lain: Token Expired**

- Default expiry: **24 jam**
- Jika sudah lebih dari 24 jam sejak signup, token sudah invalid
- Solution: Click "Kirim Ulang Email" di halaman verify-email
- Atau signup ulang dengan email baru

---

### ❌ Masih dapat "OTP Expired" padahal baru?

**Penyebab: Waktu Server Tidak Sinkron**

1. Check server time:

   ```bash
   # Windows PowerShell
   Get-Date

   # Linux/Mac Terminal
   date
   ```

2. Pastikan waktu komputer **akurat** (sync dengan NTP)

   - Windows: Settings → Time & Language → Set time automatically
   - Mac: System Preferences → Date & Time → Set date and time automatically
   - Linux: `sudo ntpdate -s time.nist.gov`

3. Jika masih error, contact **Supabase Support** - mungkin server issue mereka

---

## 📊 Debugging Checklist

Jika masih ada masalah, cek items ini:

- [ ] `.env.local` sudah ada dengan credentials yang benar
- [ ] `NEXT_PUBLIC_SITE_URL=http://localhost:3000` di `.env.local`
- [ ] Supabase Dashboard → URL Configuration sudah di-set dengan benar
- [ ] Redirect URLs mencakup `http://localhost:3000/auth/callback` dan `/auth/confirm`
- [ ] Development server sudah di-restart setelah update `.env.local`
- [ ] Browser cache sudah di-clear (atau test di Incognito mode)
- [ ] Email sudah di-check di folder SPAM/Junk
- [ ] Jam/waktu komputer sudah akurat
- [ ] Email provider di Supabase dashboard status = ENABLED
- [ ] Test dengan test email yang valid (jangan email yang sudah ada)

---

## 🚀 Vercel Production Setup (Nanti)

Saat deploy ke Vercel:

1. Go to **Vercel Project Settings → Environment Variables**
2. Add:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.com
   ```

3. Go to Supabase Dashboard → Authentication → URL Configuration
4. Update:

   - **Site URL:** `https://your-vercel-domain.com`
   - **Redirect URLs:** Tambahkan:
     ```
     https://your-vercel-domain.com/auth/callback
     https://your-vercel-domain.com/auth/confirm
     https://your-vercel-domain.com/
     ```

5. Re-deploy di Vercel

---

## 📚 File Changes Made

- ✅ `app/signup/page.tsx` - Improved redirect URL handling
- ✅ `app/verify-email/page.tsx` - Improved redirect URL handling
- ✅ `app/auth/confirm/route.ts` - Better error logging & handling
- ✅ `SUPABASE_AUTH_FIX.md` - Detailed explanation (this file)

---

**Selamat! Sekarang Anda siap test email verification. Jika masih ada issue, reference file `SUPABASE_AUTH_FIX.md` untuk penjelasan lebih detail.**
