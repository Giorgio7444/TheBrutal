import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Italian Spotlight — Post Brutalismo Digitale' },
  },
  {
    path: '/designers',
    name: 'Designers',
    component: () => import('@/views/DesignersView.vue'),
    meta: { title: 'Designers — Italian Spotlight' },
  },
  {
    path: '/articles',
    redirect: '/designers',
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/views/CategoriesView.vue'),
    meta: { title: 'Categorie — Italian Spotlight' },
  },
  {
    path: '/details/:id',
    name: 'Details',
    component: () => import('@/views/DetailView.vue'),
    meta: { title: 'Details — Italian Spotlight' },
  },
  {
    path: '/article/:id',
    redirect: (to) => ({ path: `/details/${to.params.id}`, query: to.query, hash: to.hash }),
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
    path: '/admin/posts',
    name: 'AdminPosts',
    component: () => import('@/views/admin/PostList.vue'),
    meta: { requiresAdmin: true, title: 'Post admin — Italian Spotlight' },
  },
  {
    path: '/admin/edit-post/:id',
    name: 'AdminEditPost',
    component: () => import('@/views/admin/EditPost.vue'),
    meta: { requiresAdmin: true, title: 'Modifica post — Italian Spotlight' },
  },
  {
    path: '/admin/new-post',
    name: 'AdminNewPost',
    component: () => import('@/views/admin/NewPost.vue'),
    meta: { requiresAdmin: true, title: 'Nuovo post — Italian Spotlight' },
  },
  {
    path: '/profile/:username',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { title: 'Profilo — Italian Spotlight' },
  },
  {
    path: '/profile',
  name: 'ProfileMe',
  redirect: async () => {
    // Aspetta che Firebase sia pronto
    const currentUser = await new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe()
        resolve(user)
      })
    })

    if (!currentUser?.uid) {
      return { path: '/auth', query: { reason: 'login_required', redirect: '/profile' } }
    }

    const snapshot = await getDoc(doc(db, 'profiles', currentUser.uid))
    const username = snapshot.exists() ? snapshot.data()?.username : null

    if (!username) {
      return { path: '/auth' }
    }

    return { path: `/profile/${username}` }
  },
},
  {
    path: '/login',
    alias: '/auth',
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
    path: '/bookshelf',
    name: 'Bookshelf',
    component: () => import('@/views/BookshelfView.vue'),
    meta: { title: 'Bookshelf' },
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('@/views/blog/PostList.vue'),
    meta: { title: 'Blog — Italian Spotlight' },
  },
  {
    path: '/blog/:id',
    name: 'BlogDetail',
    component: () => import('@/views/blog/PostDetail.vue'),
    meta: { title: 'Post — Italian Spotlight' },
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



const isAdmin = async () => {
  const currentUser = auth.currentUser

  if (!currentUser?.uid) {
    return false
  }

  const snapshot = await getDoc(doc(db, 'profiles', currentUser.uid))
  return snapshot.exists() && snapshot.data()?.admin === true
}

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAdmin) {
    const canAccessAdminArea = await isAdmin()

    if (!canAccessAdminArea) {
      next({ path: '/login', query: { redirect: to.fullPath, reason: 'admin_required' } })
      return
    }
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ path: '/login', query: { redirect: to.fullPath, reason: 'login_required' } })
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
