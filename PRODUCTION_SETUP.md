# 🚀 PRODUCTION SETUP GUIDE - VERCEL + SUPABASE

## 📋 Asumsi:
- Development Anda sudah berhasil berjalan di `http://localhost:3001`
- Anda akan deploy ke **Vercel**
- Anda sudah punya **custom domain** (atau akan pakai default Vercel domain)

---

## 🔧 STEP 1: Setup di Vercel

### 1.1 Push Project ke GitHub
```bash
git init
git add .
git commit -m "Public Diary - Production Ready"
git remote add origin https://github.com/your-username/public-diary.git
git push -u origin main
```

### 1.2 Import ke Vercel
1. Go to https://vercel.com/dashboard
2. Click **"Add New..." → "Project"**
3. Select **GitHub** dan pilih repository `public-diary`
4. Click **"Import"**

### 1.3 Setup Environment Variables di Vercel
Di halaman "Configure Project":

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=https://public-diary-xxx.vercel.app
```

⚠️ **PENTING:**
- `NEXT_PUBLIC_SITE_URL` = default Vercel domain Anda
- Cari di halaman Project Settings → Domains
- Format: `https://[project-name]-[random].vercel.app`

### 1.4 Deploy
Click **"Deploy"** dan tunggu hingga selesai (biasanya 2-5 menit).

---

## 🌐 STEP 2: Konfigurasi Supabase untuk Production

### 2.1 Update URL Configuration di Supabase

**Go to: Authentication → URL Configuration**

**Site URL:**
```
https://public-diary-xxx.vercel.app
```
(Ganti dengan domain Vercel Anda)

**Redirect URLs:**
```
https://public-diary-xxx.vercel.app/auth/callback
https://public-diary-xxx.vercel.app/auth/confirm
https://public-diary-xxx.vercel.app/
https://public-diary-xxx.vercel.app/dashboard
https://public-diary-xxx.vercel.app/login
```

**SAVE/Update** perubahan.

### 2.2 Test di Production

1. Go to `https://public-diary-xxx.vercel.app`
2. Signup dengan email baru
3. Check email - seharusnya link ke domain Vercel
4. Click link dan verify
5. Seharusnya berhasil redirect ke dashboard

---

## 🎯 OPTIONAL: Setup Custom Domain

Jika Anda punya custom domain (misal: `mydiary.com`):

### 3.1 Update DNS

Di DNS provider Anda (GoDaddy, Namecheap, CloudFlare, dll):

1. Add **CNAME Record:**
   ```
   Name: (kosongkan atau @)
   Type: CNAME
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

2. Atau jika provider mendukung:
   ```
   Name: www
   Type: CNAME
   Value: cname.vercel-dns.com
   ```

### 3.2 Update di Vercel

1. Go to **Vercel Project → Settings → Domains**
2. Click **"Add Domain"**
3. Enter domain Anda: `mydiary.com` (tanpa https)
4. Vercel akan verify DNS - tunggu beberapa menit (bisa sampai 24 jam)
5. Setelah valid, Anda akan dapat auto SSL certificate

### 3.3 Update di Supabase

**Go to: Authentication → URL Configuration**

Update **Site URL** dan **Redirect URLs** dengan custom domain:

```
https://mydiary.com/auth/callback
https://mydiary.com/auth/confirm
https://mydiary.com/
```

### 3.4 Update di Vercel Environment Variables

Jika sudah punya custom domain, update:

```
NEXT_PUBLIC_SITE_URL=https://mydiary.com
```

Setelah update, Vercel akan **auto re-deploy** (cek Deployments tab).

---

## 📊 Summary: Development vs Production

| Aspek | Development | Production |
|-------|-------------|-----------|
| **Server** | `npm run dev` (localhost) | Vercel (auto) |
| **Port** | `3001` (atau 3000) | N/A (HTTPS) |
| **Domain** | `http://localhost:3001` | `https://public-diary-xxx.vercel.app` atau custom |
| **NEXT_PUBLIC_SITE_URL** | `http://localhost:3001` | `https://vercel-domain.com` |
| **Supabase Site URL** | `http://localhost:3001` | `https://vercel-domain.com` |
| **Database** | Sama (Supabase) | Sama (Supabase) |
| **Email Send** | Supabase (test mode OK) | Supabase (real emails) |

---

## 🔍 Checklist Production Deployment

### Pre-Deployment
- [ ] Development testing selesai & berjalan sempurna
- [ ] `.env.local` file lokal (jangan push ke git)
- [ ] Semua `console.log` development sudah di-remove/diubah
- [ ] Error handling sudah ditambah

### Vercel Setup
- [ ] Repository sudah di-push ke GitHub
- [ ] Project sudah di-import ke Vercel
- [ ] Environment variables sudah di-set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SITE_URL` (dengan domain Vercel)
- [ ] Build logs tidak ada error
- [ ] Deploy berhasil (Status: Ready)

### Supabase Setup
- [ ] Authentication → URL Configuration di-update dengan Vercel domain
- [ ] Redirect URLs sudah lengkap
- [ ] Email provider masih ENABLED
- [ ] Database sudah siap (tables, RLS, etc)

### Testing
- [ ] Buka production URL di browser
- [ ] Test signup flow
- [ ] Test email verification
- [ ] Test login
- [ ] Test create note
- [ ] Test delete note
- [ ] Test public feed

### Monitoring
- [ ] Monitor Vercel logs untuk error
- [ ] Monitor Supabase logs untuk email delivery
- [ ] Set up error tracking (optional: Sentry, LogRocket, dll)

---

## 🐛 Troubleshooting Production

### ❌ Email tidak terkirim di production?

**Check #1: Supabase Email Logs**
1. Go to Supabase Dashboard → Home
2. Look for email delivery logs
3. Check apakah ada bounce/error

**Check #2: Domain Authentication**
- Default Supabase email dari `noreply@[project-id].supabase.co`
- Mungkin di-block oleh email provider
- **Solution:** Upgrade ke Supabase Pro untuk custom SMTP

**Check #3: Rate Limiting**
- Supabase punya rate limit untuk email
- Jika banyak user signup sekaligus, mungkin email tertunda
- Check di Supabase logs

### ❌ Redirect URL tidak match?

**Symptoms:**
- Error "Invalid redirect URL"
- Email link ke domain yang salah

**Solution:**
1. Buka email link yang diterima → check domain-nya
2. Compare dengan Supabase URL Configuration
3. Jika tidak match, update Supabase URL Configuration
4. Re-test dengan email baru

### ❌ Build failed di Vercel?

**Check:**
1. Go to Vercel → Project → Deployments → Failed deployment
2. Click untuk baca error logs
3. Common errors:
   - Missing environment variable → Update di Vercel Settings
   - TypeScript error → Fix error di kode
   - Package issue → Run `npm install` lokal lalu push ulang

### ❌ Masih dapat error setelah deploy?

**Debug Steps:**
1. Go to Vercel → Function Logs (real-time logs)
2. Trigger the error action (signup, verify, etc)
3. Check logs untuk error message
4. Fix dan re-deploy

**Atau untuk email:**
1. Go to Supabase → SQL Editor
2. Check user yang baru signup:
   ```sql
   SELECT id, email, email_confirmed_at, created_at 
   FROM auth.users 
   ORDER BY created_at DESC LIMIT 5;
   ```
3. Check apakah `email_confirmed_at` NULL (belum di-verify) atau ada value (sudah di-verify)

---

## 💡 Best Practices Production

1. **Monitor Email Delivery**
   - Setup alert jika email fail rate tinggi
   - Check Supabase logs secara berkala

2. **Version Control**
   - Tag setiap production deploy: `git tag v1.0.0`
   - Jangan force push ke main branch

3. **Environment Separation**
   - Gunakan separate Supabase project untuk dev/staging/production
   - Atau gunakan separate database per environment
   - Minimal gunakan separate auth token per environment

4. **Error Tracking**
   - Setup Sentry atau error tracking lain
   - Monitor error rate di production
   - Get notified jika ada error

5. **Backup & Recovery**
   - Regular database backup (Supabase auto-backup)
   - Keep `.env.local` backup di safe place
   - Document disaster recovery plan

6. **Performance**
   - Monitor Vercel analytics
   - Check slow queries di database
   - Optimize images & assets

7. **Security**
   - Use HTTPS (auto di Vercel & Supabase)
   - Keep dependencies updated
   - Regular security audit

---

## 📞 Quick Reference - Production URLs

**Untuk development:**
```
App: http://localhost:3001
Supabase Site URL: http://localhost:3001
```

**Untuk production (example):**
```
App: https://public-diary-xyz.vercel.app
Supabase Site URL: https://public-diary-xyz.vercel.app

Atau dengan custom domain:
App: https://mydiary.com
Supabase Site URL: https://mydiary.com
```

---

**Semoga deployment production lancar! Jika ada error, reference dokumentasi ini atau hubungi support Vercel/Supabase.**
