<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950">
    <!-- Loading State -->
    <div v-if="articlesStore.loading" class="flex items-center justify-center min-h-screen">
      <div class="inline-flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-neutral-200 dark:border-neutral-800 border-t-teal-600 dark:border-t-teal-600 rounded-full animate-spin" />
        <p class="text-neutral-600 dark:text-neutral-400">Caricamento articolo...</p>
      </div>
    </div>

    <!-- Article Content -->
    <article v-else-if="article" class="py-20 px-4">
      <div class="mx-auto max-w-3xl">
        <!-- Header -->
        <div class="mb-12">
          <div class="flex flex-wrap gap-2 mb-6">
            <TagBadge
              v-for="tag in article.tags"
              :key="tag"
              :tag="tag"
            />
          </div>

          <h1 class="font-sans text-5xl md:text-6xl font-bold text-neutral-950 dark:text-white mb-6">
            {{ article.title }}
          </h1>

          <!-- Author Info -->
          <div class="flex items-center gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
            <UserAvatar
              :avatar-url="authorAvatarUrl"
              :username="authorName"
              size="md"
            />
            <div>
              <router-link :to="`/profile/${article.profiles?.username}`" class="font-sans text-2xl font-bold text-neutral-950 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                {{ authorName }}
              </router-link>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">
                {{ formatDate(article.created_at) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Cover Image -->
        <div v-if="article.cover_url" class="mb-12 rounded-none overflow-hidden">
          <img
            :src="article.cover_url"
            :alt="article.title"
            class="w-full h-auto"
          />
        </div>

        <!-- Content -->
        <div
          class="prose dark:prose-invert prose-neutral max-w-none mb-12"
          v-html="sanitizedContent"
        />

        <!-- Like & Actions -->
        <div class="flex items-center gap-4 py-6 border-t border-neutral-200 dark:border-neutral-800">
          <button
            @click="toggleLike"
            :disabled="!authStore.isAuthenticated || isPlaceholder || isLiking"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-none transition-colors',
              isPlaceholder || isLiking ? 'opacity-60 cursor-not-allowed' : '',
              isLiked
                ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            ]"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {{ likeCount }}
          </button>

          <button
            v-if="isAuthor"
            @click="editArticle"
            class="flex items-center gap-2 px-4 py-2 rounded-none bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
              <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
            Modifica
          </button>

          <button
            v-if="isAuthor"
            @click="deleteArticle"
            class="flex items-center gap-2 px-4 py-2 rounded-none bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900 transition-colors ml-auto"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z" />
            </svg>
            Elimina
          </button>
        </div>

        <!-- Author Card -->
        <div class="mt-16 p-6 rounded-none border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
          <div class="flex items-start gap-4">
            <UserAvatar
              :avatar-url="authorAvatarUrl"
              :username="authorName"
              size="lg"
            />
            <div class="flex-1">
              <router-link :to="`/profile/${article.profiles?.username}`" class="font-sans text-2xl font-bold text-neutral-950 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                {{ authorName }}
              </router-link>
              <p class="text-neutral-600 dark:text-neutral-400 mt-2">
                {{ article.profiles?.bio || 'Nessuna biografia disponibile' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>

    <!-- Not Found -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h2 class="font-sans text-3xl font-bold text-neutral-950 dark:text-white mb-4">
          Articolo non trovato
        </h2>
        <router-link to="/" class="px-4 py-2 rounded-lg bg-teal-600 dark:bg-teal-600 text-white hover:bg-teal-700 dark:hover:bg-teal-700 transition-colors inline-block">
          Torna alla home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DOMPurify from 'dompurify'
import { useAuthStore } from '@/stores/auth'
import { useArticlesStore } from '@/stores/articles'
import { formatDate } from '@/lib/utils'
import { placeholderArticlesData } from '@/data/placeholders'
import { useMetaTags } from '@/composables/useMetaTags'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import TagBadge from '@/components/ui/TagBadge.vue'

const route = useRoute()
const router = useRouter()
const metaTags = useMetaTags()
const authStore = useAuthStore()
const articlesStore = useArticlesStore()

const article = ref(null)
const isLiked = ref(false)
const likeCount = ref(0)
const isPlaceholder = ref(false)
const isLiking = ref(false)

const authorName = computed(() => article.value?.profiles?.display_name || article.value?.profiles?.username)

const authorAvatarUrl = computed(() => {
  const profile = article.value?.profiles
  return profile?.avatar_url || null
})

const sanitizedContent = computed(() => {
  return article.value?.content ? DOMPurify.sanitize(article.value.content) : ''
})

const isAuthor = computed(() => {
  return authStore.isAuthenticated && authStore.user?.id === article.value?.author_id
})

onMounted(async () => {
  await loadArticle()
})

const loadArticle = async () => {
  const articleId = route.params.id

  // Check if it's a placeholder article
  if (placeholderArticlesData[articleId]) {
    isPlaceholder.value = true
    article.value = placeholderArticlesData[articleId]
    likeCount.value = article.value.likes?.[0]?.count || 0
    document.title = `${article.value.title} — Italian Spotlight`
    metaTags.setMetaTags({
      title: `${article.value.title} — Italian Spotlight`,
      description: article.value.excerpt,
      image: article.value.cover_url,
      url: `https://the-brutal.web.app/article/${articleId}`,
      type: 'article',
    })
    return
  }

  isPlaceholder.value = false

  try {
    const data = await articlesStore.fetchArticleById(articleId)
    article.value = data
    likeCount.value = data.likes?.[0]?.count || 0
    document.title = `${data.title} — Italian Spotlight`
    metaTags.setMetaTags({
      title: `${data.title} — Italian Spotlight`,
      description: data.excerpt,
      image: data.cover_url,
      url: `https://the-brutal.web.app/article/${articleId}`,
      type: 'article',
    })

    if (authStore.isAuthenticated) {
      isLiked.value = await articlesStore.checkIfLiked(data.id, authStore.user.id)
    }
  } catch (err) {
    console.error('Load article error:', err)
  }
}

const toggleLike = async () => {
  if (isPlaceholder.value) return
  if (!authStore.isAuthenticated) {
    router.push('/auth')
    return
  }

  if (isLiking.value) return

  try {
    isLiking.value = true
    const result = await articlesStore.toggleLike(article.value.id, authStore.user.id)
    isLiked.value = result
    likeCount.value += result ? 1 : -1
  } catch (err) {
    console.error('Toggle like error:', err)
  } finally {
    isLiking.value = false
  }
}

const editArticle = () => {
  router.push(`/editor/${article.value.id}`)
}

const deleteArticle = async () => {
  if (!confirm('Sei sicuro di voler eliminare questo articolo?')) return

  try {
    await articlesStore.deleteArticle(article.value.id)
    router.push('/')
  } catch (err) {
    console.error('Delete article error:', err)
  }
}
</script>
