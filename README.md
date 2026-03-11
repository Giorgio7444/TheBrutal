# The Brutal — Estetica Digitale

Piattaforma editoriale per il Post-Brutalismo digitale. Progetto d'esame — LABA Brescia, Progettazione Multimediale.

## Setup

```bash
npm install
cp .env.example .env.local   # configura VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm run dev                   # http://localhost:5173
```

## Supabase

1. Crea un progetto su [supabase.com](https://supabase.com)
2. Esegui `supabase/migrations/001_initial_schema.sql` nell'SQL Editor
3. Configura OAuth (Google/GitHub) e crea i bucket storage: `avatars`, `article-covers`, `article-images` (pubblici)

## Build

```bash
npm run build     # produzione
npm run preview   # anteprima locale
```

## Tech Stack

Vue 3 · Pinia · Vue Router · Tiptap · Supabase · Tailwind CSS · Vite
