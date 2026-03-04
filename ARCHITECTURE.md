# 🏗️ Architettura e Struttura Componenti

Questo documento descrive l'architettura dell'applicazione Estetica Digitale e come i componenti interagiscono.

## 📊 Architettura Generale

```
┌─────────────────────────────────────────────────────┐
│                    App.vue (Root)                    │
│ ┌─────────────────────────────────────────────────┐ │
│ │                  AppNavbar.vue                   │ │
│ ├─────────────────────────────────────────────────┤ │
│ │              Router View (Page)                  │ │
│ │  ┌──────────────────────────────────────────┐  │ │
│ │  │        Views (HomeView, etc)             │  │ │
│ │  │  - Fetch da store (Pinia)                │  │ │
│ │  │  - Render components                     │  │ │
│ │  └──────────────────────────────────────────┘  │ │
│ ├─────────────────────────────────────────────────┤ │
│ │                  AppFooter.vue                   │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
          ↓ Data Flow (Pinia Stores)
┌─────────────────────────────────────────────────────┐
│            Supabase (Backend)                        │
│  - Auth (OAuth Google/GitHub)                       │
│  - Database (PostgreSQL)                            │
│  - Storage (Immagini)                               │
└─────────────────────────────────────────────────────┘
```

## 🎯 Data Flow

### 1. Autenticazione
```
AuthView → Store (auth.js)
  ↓
OAuth Provider (Google/GitHub)
  ↓
Supabase Auth
  ↓
Session restored
  ↓
AppNavbar updated (show user menu)
```

### 2. Creazione Articolo
```
EditorView (form) → User input
  ↓
handlePublish() → Store (articles.js)
  ↓
uploadCoverImage() → Supabase Storage
uploadImage() → Supabase Storage (in editor)
  ↓
createArticle() → Supabase Database
  ↓
Router → ArticleView con ID
```

### 3. Lettura Feed
```
HomeView (onMounted)
  ↓
fetchPublishedArticles() → Store (articles.js)
  ↓
Supabase Query (with JOIN profiles, like count)
  ↓
articles.value = data
  ↓
Render grid di ArticleCard components
```

## 📦 Componenti Structure

### Layout Components
```
AppNavbar.vue
├── Logo (router-link to home)
├── Nav links
├── Dark mode toggle
└── User menu (if authenticated)
    ├── Avatar + Username
    └── Dropdown (Profile, Logout)

AppFooter.vue
├── About section
├── Quick links
└── Social media
```

### Page/View Components
```
HomeView.vue
├── Hero section
├── Tag filter bar
└── Articles grid
    └── ArticleCard (repeated)

ArticleView.vue
├── Header (title, tags, author)
├── Cover image
├── Content (v-html)
├── Like button
├── Actions (edit/delete)
└── Author card

EditorView.vue
├── Title input
├── Excerpt textarea
├── Cover upload
├── TiptapEditor
├── Tags input
└── Action buttons (draft/publish)

ProfileView.vue
├── Profile header
│   ├── Avatar
│   ├── Username
│   └── Bio (editable if own)
└── Articles list
    └── ArticleCard (repeated)

AuthView.vue
├── Header
├── OAuth buttons (Google, GitHub)
├── Divider
└── Email form
```

### UI Components
```
ArticleCard.vue
├── Cover image or placeholder
├── Tags (first 2)
├── Title
├── Excerpt
├── Footer
│   ├── Author (avatar + username)
│   ├── Date
│   └── Like count

UserAvatar.vue
├── Image (if exists)
└── Fallback (initials)

TagBadge.vue
└── Styled badge with tag name
```

### Editor Components
```
TiptapEditor.vue
├── EditorToolbar
└── ProseMirror editor (Tiptap)

EditorToolbar.vue
├── Text formatting buttons
├── Structure buttons (heading, quote)
├── List buttons
└── Link/Image buttons
```

## 🔄 State Management (Pinia)

### auth.js Store
```javascript
State:
  - user (current user object)
  - profile (user profile data)
  - loading (boolean)
  - error (string)
  - isAuthenticated (computed)

Actions:
  - initializeAuth() → restore session
  - signInWithGoogle()
  - signInWithGithub()
  - signOut()
  - updateProfile()
  - uploadAvatar()
```

### articles.js Store
```javascript
State:
  - articles (array)
  - loading (boolean)
  - error (string)
  - hasMore (boolean for pagination)
  - currentPage (number)

Actions:
  - fetchPublishedArticles(tags, page)
  - fetchArticleById(id)
  - fetchUserArticles(userId)
  - createArticle(data)
  - updateArticle(id, updates)
  - deleteArticle(id)
  - uploadCoverImage(file) → URL
  - uploadImage(file) → URL
  - toggleLike(articleId, userId)
  - checkIfLiked(articleId, userId)
```

## 🔀 Router

```
/                    → HomeView
/article/:id         → ArticleView
/editor              → EditorView (requires auth)
/editor/:id          → EditorView (edit, requires auth)
/profile/:username   → ProfileView
/auth                → AuthView
```

### Route Guards
```javascript
if (route.meta.requiresAuth && !isAuthenticated) {
  → redirect to /auth
}

if (route.name === 'Auth' && isAuthenticated) {
  → redirect to /
}
```

## 🗄️ Database Queries Pattern

### Query Pattern in Store
```javascript
const { data, error } = await supabase
  .from('table')
  .select('column1, column2, foreign_table(*)')
  .eq('condition', value)
  .order('column', { ascending: false })

if (error) throw error
return data
```

### RLS Pattern
```javascript
// On SELECT (read):
// - Policies check if user can see the row
// - Anonymous users can see published articles only

// On INSERT (create):
// - auth.uid() must match the row's user_id or author_id

// On UPDATE (edit):
// - User must be the owner of the row

// On DELETE:
// - User must be the owner of the row
```

## 📁 File Organization

```
components/
├── layout/           # Navbar, Footer
├── ui/              # Reusable UI pieces
└── editor/          # Editor related

stores/
├── auth.js          # Auth logic
└── articles.js      # Article CRUD + likes

views/
├── HomeView.vue     # Feed page
├── ArticleView.vue  # Read article
├── EditorView.vue   # Create/edit article
├── ProfileView.vue  # User profile
└── AuthView.vue     # Login page

lib/
└── supabase.js      # Supabase client init

router/
└── index.js         # Route definitions + guards
```

## 🔐 Security Layers

### 1. Authentication
- OAuth prevents fake accounts
- Session management by Supabase
- Token stored in secure cookie

### 2. Authorization
- RLS policies at database level
- Route guards at application level
- User can only modify own data

### 3. Data Validation
- Form validation before submit
- Backend validation in Supabase
- Error handling and user feedback

## ⚡ Performance Considerations

### Optimizations
1. **Lazy loading**: Route components loaded on demand
2. **Pagination**: Articles loaded in batches
3. **Indexes**: Database queries have indexes
4. **Caching**: Browser cache for static assets
5. **Image optimization**: Supabase Storage CDN

### Areas for Improvement
- Implement comment system (not yet)
- Add search functionality
- Implement user follow system
- Add notification system
- Add rich mentions support

## 🧪 Testing Recommendations

### Unit Tests (Vitest)
- Store actions (articles, auth)
- Component logic
- Utility functions

### Integration Tests
- Router navigation
- Store integration with components
- Supabase queries

### E2E Tests (Cypress)
- Full user flow (login → write → publish)
- Article reading
- Profile management

## 🚀 Deployment Checklist

- [ ] Build production: `npm run build`
- [ ] Test build: `npm run preview`
- [ ] Add .env variables to hosting platform
- [ ] Configure Supabase CORS
- [ ] Test OAuth redirects on production domain
- [ ] Verify storage buckets are public
- [ ] Monitor error logs
- [ ] Set up analytics

## 🔄 Maintenance Guide

### Adding New Features
1. Plan the user flow
2. Create store actions if needed
3. Create component
4. Add route if applicable
5. Update documentation

### Common Tasks

**Add new article field:**
1. Update SQL schema
2. Update store action
3. Update form component
4. Update display component

**Change styling:**
1. Update Tailwind config if needed
2. Update component classes
3. Test responsive design
4. Test dark mode

**Add new route:**
1. Create view component
2. Add route in router/index.js
3. Add navigation in AppNavbar
4. Add route guard if needed

---

Questo documento fornisce una panoramica completa dell'architettura. Per modifiche, consultare il codice specifico dei file.
