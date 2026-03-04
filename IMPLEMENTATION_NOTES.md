# 🔧 Note di Implementazione e Fix Comuni

## ⚠️ Problemi Comuni e Soluzioni

### 1. OAuth Redirect Non Funziona

**Problema**: "Invalid redirect_uri" o "Unauthorized client"

**Soluzione**:
```
Google Cloud Console:
1. Vai a Credentials
2. Modifica OAuth 2.0 Client ID
3. Aggiungi questi URIs:
   - http://localhost:5173
   - http://localhost:5173/auth
   - https://your-domain.com
   - https://your-supabase-project.supabase.co/auth/v1/callback?provider=google

GitHub Settings:
1. Vai a OAuth Apps
2. Authorization callback URL deve esattamente matchare
3. Usa: https://your-supabase-project.supabase.co/auth/v1/callback
```

### 2. Upload Immagine Non Funziona

**Problema**: "Bucket not found" o "403 Forbidden"

**Soluzione**:
```
Supabase Storage:
1. Vai a Storage
2. Verifica che i bucket esistano:
   - avatars
   - article-covers
   - article-images
3. Per ogni bucket:
   - Clicca bucket
   - Scegli Policies
   - Verifica che Public sia enabled
```

### 3. "RLS policy violation" nel Console

**Problema**: Errore 403 quando tenti azioni

**Soluzione**:
```
Controlla se:
1. Sei autenticato (authStore.isAuthenticated === true)
2. La policy della tabella permette l'azione
3. Per profile: verifica che auth.uid() === profile.id
4. Per articles: verifica che author_id === auth.uid()
```

### 4. Profilo Non Crea dopo Signup

**Problema**: L'utente si registra ma il profilo non esiste

**Soluzione**:
```
SQL Editor di Supabase:
1. Esegui: SELECT * FROM profiles;
2. Se vuoto, il trigger non è stato eseguito
3. Ri-esegui la migrazione SQL
4. Oppure crea manualmente:

INSERT INTO profiles (id, username)
VALUES ('uuid-from-auth', 'email@domain.com')
ON CONFLICT (id) DO NOTHING;
```

### 5. Dark Mode Non Persiste

**Problema**: La modalità scura si resetta al refresh

**Soluzione** (in AppNavbar.vue):
```javascript
// Aggiungi nel onMounted:
const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark')
  isDark.value = true
}
```

### 6. Transition Page Non Funziona

**Problema**: Le transizioni fade non si vedono

**Soluzione**:
```
Verifica in App.vue:
1. <router-view> ha v-slot="{ Component, route }"
2. :key="route.path" forza il remount
3. Transition name è "fade"
4. CSS è presente in App.vue
```

## 🐛 Debug Tips

### 1. Console Errors
```bash
# Apri browser DevTools (F12)
# Controlla Console per errori JS
# Controlla Network tab per failed requests
```

### 2. Supabase Logs
```
Dashboard Supabase → Logs
Visualizza query errors e auth events
```

### 3. Store State
```javascript
// In browser console:
console.log(useAuthStore())
console.log(useArticlesStore())

// Vedi reactive state in real-time
```

### 4. Network Requests
```
DevTools → Network tab
Filtra per "api.supabase.co"
Verifica status code (200/401/403)
```

## 📝 Implementazioni Future

### 1. Comment System
```vue
<!-- ArticleView.vue aggiungere -->
<section class="comments mt-12">
  <h3>Commenti</h3>
  <!-- Comment list -->
  <!-- Comment form -->
</section>

<!-- Store: articles.js aggiungere -->
const fetchComments = async (articleId) => { ... }
const addComment = async (articleId, text) => { ... }
```

### 2. Search Functionality
```javascript
// router/index.js aggiungere
{
  path: '/search',
  component: () => import('@/views/SearchView.vue'),
}

// articles.js store aggiungere
const searchArticles = async (query) => {
  return await supabase
    .from('articles')
    .select('*')
    .textSearch('content', query)
    .limit(20)
}
```

### 3. Follow System
```javascript
// DB aggiungere tabella
CREATE TABLE followers (
  follower_id UUID REFERENCES profiles(id),
  following_id UUID REFERENCES profiles(id),
  PRIMARY KEY (follower_id, following_id)
)

// Store aggiungere
const toggleFollow = async (userId) => { ... }
```

### 4. Notifications
```javascript
// DB aggiungere tabella
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  type TEXT,
  actor_id UUID,
  article_id UUID,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
)

// Real-time con Supabase subscriptions
const subscribeToNotifications = () => {
  return supabase
    .from('notifications')
    .on('INSERT', ...)
    .subscribe()
}
```

### 5. Rich Mentions
```javascript
// Aggiungere Tiptap extension
import Mention from '@tiptap/extension-mention'

// Nel editor:
.extend({
  addKeyboardShortcuts: () => ({
    '@': () => /* show mentions popup */,
  })
})
```

## 🔍 Code Review Checklist

### Performance
- [ ] Queries hanno indexes
- [ ] Componenti lazy-loaded dove appropriate
- [ ] No memory leaks (cleanup subscriptions)
- [ ] Immagini ottimizzate

### Security
- [ ] RLS policies configurate
- [ ] User input validated
- [ ] No secrets nel code
- [ ] HTTPS in produzione

### Accessibility
- [ ] Alt text su immagini
- [ ] Aria labels su buttons
- [ ] Color contrast sufficiente
- [ ] Keyboard navigation

### Maintainability
- [ ] Componenti modulari e reusable
- [ ] Naming consistente
- [ ] Comments su logic complessa
- [ ] Proper error handling

## 📊 Database Performance Tips

### Indexes già presenti
```sql
idx_articles_author_id        -- SELECT by author
idx_articles_published        -- SELECT published only
idx_articles_created_at DESC  -- ORDER BY date
idx_likes_article_id          -- SELECT likes per article
idx_likes_user_id             -- SELECT user's likes
```

### Per ottimizzare ulteriormente
```sql
-- Se aggiungi search su tags:
CREATE INDEX idx_articles_tags ON articles USING GIN(tags);

-- Se aggiungi search su content:
CREATE INDEX idx_articles_content 
  ON articles USING GIN(to_tsvector('english', content));
```

## 🚀 Production Deployment

### Before Going Live
```bash
# 1. Build
npm run build

# 2. Test build
npm run preview

# 3. Check for console errors
npm run build 2>&1 | grep -i error

# 4. Verify env vars
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# 5. Test OAuth with prod URLs
# Add production domain to OAuth providers
```

### Environment Variables for Production
```
# .env.production (create new file)
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_prod_anon_key

# Never commit .env files!
```

### Deployment Services
```
Vercel:
1. Connect GitHub repo
2. Add env vars in Settings
3. Deploy main branch

Netlify:
1. Connect GitHub repo
2. Set build command: npm run build
3. Set publish directory: dist
4. Add env vars

Firebase Hosting:
1. firebase init hosting
2. Configure rewrites for SPA
3. firebase deploy
```

## 📚 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview build

# Testing (when added)
npm run test             # Unit tests
npm run test:e2e         # E2E tests

# Linting (when added)
npm run lint             # Check for lint errors
npm run lint:fix         # Auto-fix lint errors

# Type checking (when converted to TypeScript)
npm run type-check       # Check types
```

## 📖 Documentation Files

- **README.md** - Quick start e feature overview
- **SUPABASE_SETUP.md** - Setup guida completa
- **USER_GUIDE.md** - Guida per gli utenti
- **ARCHITECTURE.md** - Architettura tecnica
- **IMPLEMENTATION_CHECKLIST.md** - Cosa è stato fatto
- **Questo file** - Note di implementazione

## 🤝 Contributing Guidelines

Se aggiungi features:

1. **Branch**: Crea branch con nome descrittivo
   ```bash
   git checkout -b feature/article-comments
   ```

2. **Commit**: Messaggi chiari
   ```bash
   git commit -m "Add: article comments section"
   ```

3. **PR**: Descrivi cosa cambierà

4. **Test**: Verifica che funzioni

5. **Documentation**: Aggiorna docs se necessario

## 🎓 Learning Resources

- [Vue 3 Docs](https://vuejs.org)
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tiptap Editor](https://www.tiptap.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL](https://www.postgresql.org/docs/)

---

Per altri dubbi, consulta i commenti nel codice o le guide specifiche.
