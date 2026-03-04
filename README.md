# Estetica Digitale

Piattaforma di publishing digitale per l'esplorazione e la condivisione di articoli sulla bellezza e l'estetica nel mondo digitale. **Progetto universitario di tesi per Progettazione Multimediale**.

## 🎨 Tech Stack

- **Vue 3** - Framework progressivo JavaScript (Composition API con `<script setup>`)
- **Vue Router 4** - Routing e navigazione
- **Pinia** - State management
- **Supabase** - Authentication, Database (PostgreSQL), Storage
- **Tiptap v2** - Rich text editor con supporto per immagini e link
- **Tailwind CSS v3** - Utility-first CSS framework
- **Vite** - Build tool e dev server velocissimo

## 📁 Struttura del Progetto

```
estetica-digitale/
├── src/
│   ├── assets/                 # Risorse statiche
│   ├── components/
│   │   ├── layout/             # Navbar, Footer
│   │   ├── ui/                 # ArticleCard, UserAvatar, TagBadge
│   │   └── editor/             # TiptapEditor, EditorToolbar
│   ├── views/
│   │   ├── HomeView.vue        # Feed principale con filtri tag
│   │   ├── ArticleView.vue     # Lettura articolo singolo
│   │   ├── EditorView.vue      # Creazione/modifica articoli
│   │   ├── ProfileView.vue     # Profilo utente
│   │   └── AuthView.vue        # Accesso OAuth
│   ├── stores/
│   │   ├── auth.js             # Store autenticazione (Pinia)
│   │   └── articles.js         # Store articoli e like (Pinia)
│   ├── lib/
│   │   └── supabase.js         # Inizializzazione Supabase
│   ├── router/
│   │   └── index.js            # Configurazione route e guards
│   ├── App.vue                 # Root component
│   └── main.js                 # Entry point
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Schema DB con RLS policies
├── tailwind.config.js          # Configurazione Tailwind
├── postcss.config.js           # Configurazione PostCSS
├── vite.config.js              # Configurazione Vite
├── jsconfig.json               # Path alias per @/
├── .env.example                # Template variabili ambiente
└── package.json                # Dipendenze e script
```

## 🚀 Quick Start

### 1. Prerequisiti

- Node.js 20+ o 22+
- npm o yarn
- Conto Supabase (https://supabase.com)

### 2. Installazione

```bash
# Clone/scarica il progetto
cd estetica-digitale

# Installa dipendenze
npm install

# Copia il template env e configura le credenziali
cp .env.example .env.local
```

### 3. Setup Supabase

1. Accedi a [Supabase](https://supabase.com) e crea un nuovo progetto
2. Esegui la migrazione SQL (`supabase/migrations/001_initial_schema.sql`) nella dashboard SQL editor
3. Configura OAuth:
   - **Google OAuth**: Copia URL di redirect in Google Cloud Console
   - **GitHub OAuth**: Copia URL di redirect in GitHub Settings
4. Copia `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` dal progetto Supabase nel file `.env.local`
5. Crea questi bucket di storage:
   - `avatars` (Public)
   - `article-covers` (Public)
   - `article-images` (Public)

### 4. Avvia dev server

```bash
npm run dev
```

Accedi a `http://localhost:5173`

## 🎯 Funzionalità Principali

### 🔐 Autenticazione
- OAuth con Google e GitHub via Supabase Auth
- Creazione automatica profilo utente al signup
- Session persistence
- Protezione rotte (redirects non autenticati a `/auth`)

### 📝 Editor Articoli
- Rich text editor (Tiptap) con: Bold, Italic, Heading, Blockquote, Code, Link, Image
- Upload immagini a Supabase Storage (copertina + contenuto)
- Salva come bozza o pubblica
- Modifica articoli propri
- Tag personali (visualizzati come chip)

### 📰 Feed Articoli
- Griglia responsiva (3 colonne desktop, 1 mobile)
- Filtri per tag
- Conteggio like
- Infinite scroll con "Carica altri articoli"
- Visualizza solo articoli pubblicati (drafts solo per autore)

### 👤 Profilo Utente
- Avatar + Username + Bio
- Lista articoli personali (pubblicati + bozze per profilo proprio)
- Modifica bio e username
- Link agli articoli dell'autore dalla scheda articolo

### ❤️ Like System
- Toggle like per articoli (solo utenti autenticati)
- Conteggio like in tempo reale
- Visualizzazione like count su card e articolo

### 🌓 Dark Mode
- Toggle light/dark mode in navbar
- Persistenza su localStorage
- Colori ottimizzati per entrambe le modalità

## 🎨 Design System

### Tipografia
- **Display/Headings**: Playfair Display (elegante, serif)
- **Body/UI**: DM Sans (moderna, sans-serif)
- **Dimensioni**: Articoli 18px con line-height 1.8

### Palette Colori
```
Background: #F8F6F1 (carta invecchiata)
Text Primary: #1A1A1A
Text Secondary: #6B6B6B
Accent: #2D5016 (verde editoriale profondo)
Accent Light: #E8F0E0
Border: #E0DDD8
```

### Layout
- Content max-width 680px (lettura confortevole)
- Grid 3 colonne desktop
- Spaziatura generosa e editorial
- Navbar sticky con blur effect

### Transizioni
- Page transitions: fade (200ms)
- Card hover: lift + shadow
- Smooth color transitions

## 📊 Database Schema

### `profiles`
```sql
- id (UUID, PK, FK auth.users)
- username (TEXT, unique)
- bio (TEXT, nullable)
- avatar_url (TEXT, nullable)
- created_at (TIMESTAMP)
```

### `articles`
```sql
- id (UUID, PK)
- author_id (UUID, FK profiles)
- title (TEXT)
- content (TEXT) -- HTML da Tiptap
- excerpt (TEXT)
- cover_url (TEXT)
- published (BOOLEAN)
- tags (TEXT[])
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### `likes`
```sql
- user_id (UUID, FK profiles)
- article_id (UUID, FK articles)
- PRIMARY KEY (user_id, article_id)
```

## 🔒 Row Level Security (RLS)

- **Profiles**: Chiunque legge, solo utente aggiorna la propria
- **Articles**: Chiunque legge pubblicate, autore legge anche bozze, solo autore crea/modifica/elimina
- **Likes**: Chiunque legge like su articoli pubblicati, solo utente autenticato inserisce/cancella propri like

## 📦 Build & Deploy

```bash
# Build per produzione
npm run build

# Preview build locale
npm run preview

# Deploy su Vercel/Netlify: collega repo GitHub
```

## 🛠 Comandi Disponibili

| Comando | Descrizione |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build per produzione |
| `npm run preview` | Preview build |

## 📝 Note di Sviluppo

- Tutti i componenti usano `<script setup>` (Composition API)
- Usa `@/` per import relativi da `src/`
- RLS è abilitato: le query falliscono silenziosamente se l'utente non ha permessi
- Image upload fallisce se bucket non è public
- OAuth URLs devono esattamente matchare redirect URLs su provider

## 👨‍🎓 Progetto Universitario

Tesi di Progettazione Multimediale e Comunicazione Digitale - LABA Brescia

**Tema**: Piattaforma di publishing digitale per la condivisione di articoli sulla bellezza e l'estetica nel contesto digitale, con focus su design system coerente e user experience intuitiva.

## 📄 Licenza

© 2026 - Progetto universitario


## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
