# Setup Guida - Supabase

Questa guida ti aiuterà a configurare il backend Supabase per Estetica Digitale.

## 1. Crea un Account Supabase

1. Vai a [https://supabase.com](https://supabase.com)
2. Clicca "Sign in" e crea un nuovo account o accedi
3. Clicca "New project" nella dashboard

## 2. Crea un Nuovo Progetto

- **Project Name**: estetica-digitale (o nome a tua scelta)
- **Database Password**: Genera una password sicura
- **Region**: Scegli la regione più vicina (es. Europe/Ireland)
- Clicca "Create new project"

Attendi 2-3 minuti per l'inizializzazione del progetto.

## 3. Esegui la Migrazione SQL

1. Accedi al progetto
2. Vai a "SQL Editor" nella sidebar sinistra
3. Clicca "+ New Query"
4. Copia il contenuto di `supabase/migrations/001_initial_schema.sql`
5. Incolla nel query editor
6. Clicca "Run" (tasto ▶️)

Vedrai 3 notifications di success per la creazione delle tabelle.

## 4. Configura Storage Buckets

1. Vai a "Storage" nella sidebar
2. Clicca "New bucket" e crea:
   - **Name**: `avatars` → Make it public → Create
   - **Name**: `article-covers` → Make it public → Create
   - **Name**: `article-images` → Make it public → Create

## 5. Configura Google OAuth

### 5.1 Google Cloud Console

1. Vai a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuovo progetto: "Estetica Digitale"
3. Abilita OAuth Consent Screen:
   - Vai a "APIs & Services" → "OAuth consent screen"
   - Scegli "External" user type
   - Compila form:
     - App name: "Estetica Digitale"
     - User support email: tua@email.com
     - Developer contact: tua@email.com
   - Clicca "Save and continue"
4. Crea OAuth 2.0 Client ID:
   - Vai a "Credentials"
   - Clicca "Create credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Authorized redirect URIs:
     - `http://localhost:5173` (per local dev)
     - `http://localhost:5173/auth/callback` (se Supabase lo richiede)
     - Copia l'URL redirect da Supabase (vedi passo 5.2)
   - Clicca "Create"
5. Copia `Client ID` e `Client Secret`

### 5.2 Supabase Auth

1. Nel progetto Supabase, vai a "Authentication" → "Providers"
2. Clicca su "Google"
3. Incolla:
   - **Client ID**: Copia da Google Cloud Console
   - **Client Secret**: Copia da Google Cloud Console
4. Copia l'URL redirect (es. `https://your-project.supabase.co/auth/v1/callback?provider=google`)
5. Torna a Google Cloud Console e aggiungi questo URL a "Authorized redirect URIs"
6. Clicca "Save" in Supabase

## 6. Configura GitHub OAuth

### 6.1 GitHub Settings

1. Vai a [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/apps)
2. Clicca "New OAuth App"
3. Compila:
   - **Application name**: "Estetica Digitale"
   - **Homepage URL**: `http://localhost:5173` (local) o tuo dominio
   - **Authorization callback URL**: Copia da Supabase (vedi sotto)
   - Clicca "Register application"
4. Copia `Client ID` e genera `Client Secret`

### 6.2 Supabase Auth

1. Nel progetto Supabase, vai a "Authentication" → "Providers"
2. Clicca su "GitHub"
3. Incolla:
   - **Client ID**: Copia da GitHub Settings
   - **Client Secret**: Copia da GitHub Settings
4. Clicca "Save"

## 7. Recupera Credenziali Supabase

1. Vai a "Settings" → "API"
2. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon public** → `VITE_SUPABASE_ANON_KEY`

## 8. Configura .env.local

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 9. Testa la Configurazione

```bash
npm run dev
```

1. Vai a `http://localhost:5173/auth`
2. Clicca "Continua con Google" o "Continua con GitHub"
3. Accedi e verifica il redirect
4. Controlla "Authentication" → "Users" in Supabase per vedere il nuovo utente

## 🐛 Troubleshooting

### "Invalid Client ID" su Google OAuth
- Verifica che l'URL redirect esatto sia aggiunto su Google Cloud Console
- Assicurati di aver creato OAuth 2.0 **Client ID** (non API Key)

### "Unauthorized" su GitHub OAuth
- Verifica che l'URL callback sia corretto
- Assicurati che l'app sia "Active" su GitHub Settings

### Upload immagine fallisce
- Controlla che i bucket siano **Public**
- Vai a "Storage" → seleziona bucket → "Policies" e verifica che sia abilitato SELECT/INSERT

### Profilo non si crea dopo signup
- Verifica che il trigger sia stato eseguito:
  - SQL Editor → esegui: `SELECT * FROM profiles;`
  - Se vuoto, ri-esegui la migrazione SQL

### "RLS policy violation" errori
- Assicurati di essere autenticato prima di eseguire azioni protette
- Controlla i logs in "Authentication" → "Logs"

## 📚 Risorse Utili

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
