import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Italian Spotlight — Post Brutalismo Digitale' },
  },
  {
    path: '/articles',
    name: 'Articles',
    component: () => import('@/views/ArticlesView.vue'),
    meta: { title: 'Articoli — Italian Spotlight' },
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/views/CategoriesView.vue'),
    meta: { title: 'Categorie — Italian Spotlight' },
  },
  {
    path: '/article/:id',
    name: 'Article',
    component: () => import('@/views/ArticleView.vue'),
    meta: { title: 'Articolo — Italian Spotlight' },
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('@/views/EditorView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Scrivi un articolo — Italian Spotlight' },
  },
  {
    path: '/editor/:id',
    name: 'EditArticle',
    component: () => import('@/views/EditorView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Modifica articolo — Italian Spotlight' },
  },
  {
    path: '/profile/:username',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { title: 'Profilo — Italian Spotlight' },
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/AuthView.vue'),
    meta: { title: 'Accedi — Italian Spotlight' },
  },
  {
    path: '/manifesto',
    name: 'Manifesto',
    component: () => import('@/views/ManifestoView.vue'),
    meta: { title: 'Manifesto — Italian Spotlight' },
  },
  {
    path: '/excursus',
    name: 'Excursus',
    component: () => import('@/views/ExcursusView.vue'),
    meta: { title: 'Excursus — Italian Spotlight' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '404 — Italian Spotlight' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Scroll to top on navigation
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Evita blocchi indefiniti della navigazione se auth non si inizializza.
  if (authStore.loading) {
    await Promise.race([
      new Promise((resolve) => {
        const unsubscribe = authStore.$subscribe((_mutation, state) => {
          if (!state.loading) {
            unsubscribe()
            resolve()
          }
        })
      }),
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ])
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Auth', query: { redirect: to.fullPath, reason: 'login_required' } })
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'Home' })
  } else if (to.name === 'Auth' && authStore.isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

router.afterEach((to) => {
  // Set page title from route meta
  if (to.meta.title) {
    document.title = to.meta.title
  }
})

export default router
