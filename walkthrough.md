# Migrasi Firebase → Supabase

## Perubahan yang Dilakukan

### File yang Diubah
| File | Perubahan |
|---|---|
| [supabase.js](file:///d:/Coding/Astro/birthday18th/src/lib/supabase.js) | Env vars diganti ke `PUBLIC_` prefix agar bisa diakses di client-side |
| [.env](file:///d:/Coding/Astro/birthday18th/.env) & [.env.local](file:///d:/Coding/Astro/birthday18th/.env.local) | Env var names diupdate ke `PUBLIC_SUPABASE_URL` dan `PUBLIC_SUPABASE_KEY` |
| [FormMakeAWish.astro](file:///d:/Coding/Astro/birthday18th/src/components/FormMakeAWish.astro) | Firebase `addDoc` → Supabase `.insert()` |
| [MakeAWish.astro](file:///d:/Coding/Astro/birthday18th/src/components/MakeAWish.astro) | Firebase `onSnapshot` → Supabase `.select()` + Realtime subscription |
| [FormGallery.astro](file:///d:/Coding/Astro/birthday18th/src/components/FormGallery.astro) | Firebase `addDoc` → Supabase `.insert()` |
| [Gallery.astro](file:///d:/Coding/Astro/birthday18th/src/components/Gallery.astro) | Firebase `onSnapshot` → Supabase `.select()` + Realtime subscription |

### File yang Dihapus
- `src/lib/firebase.ts` — tidak lagi diperlukan

### Package
- `firebase` di-uninstall dari `package.json`

---

## ⚠️ Yang Perlu Kamu Lakukan di Supabase Dashboard

Buka [Supabase Dashboard](https://supabase.com/dashboard) → SQL Editor, lalu jalankan SQL berikut untuk membuat tabel:

### 1. Tabel `wishes`

```sql
CREATE TABLE wishes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  comment TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON wishes
  FOR SELECT USING (true);

-- Allow public insert
CREATE POLICY "Allow public insert" ON wishes
  FOR INSERT WITH CHECK (true);

-- Allow public update (for likes)
CREATE POLICY "Allow public update" ON wishes
  FOR UPDATE USING (true);
```

### 2. Tabel `gallery`

```sql
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender TEXT NOT NULL,
  caption TEXT,
  image TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON gallery
  FOR SELECT USING (true);

-- Allow public insert
CREATE POLICY "Allow public insert" ON gallery
  FOR INSERT WITH CHECK (true);

-- Allow public update (for likes)
CREATE POLICY "Allow public update" ON gallery
  FOR UPDATE USING (true);
```

### 3. Aktifkan Realtime (Opsional, untuk live update)

Pergi ke **Database → Replication** di Supabase Dashboard, lalu aktifkan **Realtime** untuk tabel `wishes` dan `gallery`. Atau jalankan:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE wishes;
ALTER PUBLICATION supabase_realtime ADD TABLE gallery;
```

---

## Perbedaan Utama Firebase vs Supabase

| Fitur | Firebase | Supabase |
|---|---|---|
| Timestamp | `serverTimestamp()` | `new Date().toISOString()` (atau default `now()` di DB) |
| Field naming | `createdAt` (camelCase) | `created_at` (snake_case) |
| Realtime | `onSnapshot()` otomatis | `supabase.channel().on('postgres_changes')` + initial fetch |
| Like increment | `increment(1)` atomic | Fetch current → update (read-then-write) |
| Document ID | Auto-generated string | UUID via `gen_random_uuid()` |
