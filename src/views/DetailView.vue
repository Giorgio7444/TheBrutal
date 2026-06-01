<template>
  <div class="min-h-screen bg-secondary text-primary overflow-x-hidden">
    <div v-if="articlesStore.loading" class="flex items-center justify-center min-h-screen">
      <div class="inline-flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-secondary/20 border-t-tertiary rounded-full animate-spin" />
        <p class="text-primary/70">Caricamento articolo...</p>
      </div>
    </div>

    <div v-else-if="article" class="min-h-screen">
      <section class="fixed left-0 top-0 h-screen w-[50vw] overflow-hidden bg-black" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
        <div class="relative h-full w-full">
          <div v-if="articleImages.length > 0" class="relative h-full w-full">
            <Transition name="slide-fade" mode="out-in">
              <div :key="activeImage?.src || 'image'" class="absolute inset-0">
                <img
                  :src="activeImage.src"
                  :alt="activeImage.alt || article.title"
                  class="h-full w-full object-cover"
                />
              </div>
            </Transition>

            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

            <div class="absolute left-0 right-0 bottom-20 flex items-center justify-center gap-2 px-6">
              <div class="flex items-center gap-2">
                <button
                  v-for="(img, idx) in articleImages"
                  :key="img.src + idx"
                  type="button"
                  @click="activeImageIndex = idx"
                  :class="['w-16 h-10 overflow-hidden border', activeImageIndex === idx ? 'border-tertiary' : 'border-secondary/30']"
                  style="padding:0;"
                >
                  <img :src="img.src" :alt="img.alt" class="w-full h-full object-cover" />
                </button>
              </div>
            </div>

            <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 border-t border-secondary/20 bg-primary p-6 backdrop-blur-sm">
              <div class="max-w-[70%]">
                <p class="text-xs uppercase tracking-[0.3em] text-secondary/60">
                  {{ activeImageIndex + 1 }} / {{ articleImages.length }}
                </p>
                <p v-if="activeImage?.caption || activeImage?.alt" class="mt-2 text-sm text-secondary">
                  {{ activeImage.caption || activeImage.alt }}
                </p>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="prevImage"
                  :disabled="articleImages.length < 2"
                  class="h-11 w-11 border border-secondary/30 bg-primary text-secondary transition-colors hover:bg-tertiary disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Immagine precedente"
                >
                  <svg class="mx-auto h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  @click="nextImage"
                  :disabled="articleImages.length < 2"
                  class="h-11 w-11 border border-secondary/30 bg-primary text-secondary transition-colors hover:bg-tertiary disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Immagine successiva"
                >
                  <svg class="mx-auto h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div v-else class="flex h-full items-center justify-center p-8 text-center">
            <p class="text-primary/70">
              Nessuna immagine presente nel documento.
            </p>
          </div>
        </div>
      </section>

      <article class="ml-[50vw] min-h-screen w-[50vw] bg-secondary text-primary px-8 py-20 lg:px-12">
        <div class="mx-auto max-w-3xl">
          <div class="mb-12">
            <div class="flex flex-wrap gap-2 mb-6">
              <TagBadge
                v-for="tag in article.tags"
                :key="tag"
                :tag="tag"
              />
            </div>

            <div class="mb-6 flex items-start justify-between gap-4">
              <h1 class="font-bold text-primary">
                {{ article.title }}
              </h1>
              <button
                type="button"
                class="mt-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-secondary text-primary transition-colors hover:bg-tertiary hover:text-secondary disabled:cursor-not-allowed disabled:opacity-60"
                :aria-label="isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'"
                :disabled="!authStore.isAuthenticated || isPlaceholder"
                @click="toggleFavorite"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 17.3l-6.18 3.73 1.64-7.03L2 9.27l7.19-.62L12 2l2.81 6.65 7.19.62-5.46 4.73 1.64 7.03z" :class="isFavorite ? '' : 'opacity-35'" />
                </svg>
              </button>
            </div>

            <div class="flex items-center gap-4 pb-6 border-b border-primary/20">
              <UserAvatar
                :avatar-url="authorAvatarUrl"
                :username="authorName"
                size="md"
              />
              <div>
                <router-link :to="`/profile/${article.profiles?.username}`" class="font-sans text-2xl font-bold text-primary hover:text-tertiary transition-colors">
                  {{ authorName }}
                </router-link>
                <p class="text-sm text-primary">
                  {{ formatDate(article.created_at) }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="prose prose-invert mt-0 mb-12 max-w-none prose-headings:text-primary prose-p:text-primary prose-li:text-primary prose-strong:text-primary prose-blockquote:border-tertiary prose-blockquote:text-primary/80"
            v-html="sanitizedContent"
          />

          <div class="flex items-center gap-4 border-t border-primary/20 py-6">
            <button
              @click="toggleLike"
              :disabled="!authStore.isAuthenticated || isPlaceholder || isLiking"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-none transition-colors',
                isPlaceholder || isLiking ? 'opacity-60 cursor-not-allowed' : '',
                isLiked
                  ? 'bg-[#5f0a0a] text-primary'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
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
              class="flex items-center gap-2 rounded-none bg-primary/10 px-4 py-2 text-primary transition-colors hover:bg-primary/20"
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
              class="ml-auto flex items-center gap-2 rounded-none bg-[#5f0a0a] px-4 py-2 text-primary transition-colors hover:bg-[#7f1212]"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z" />
              </svg>
              Elimina
            </button>
          </div>

          <div class="mt-16 rounded-none border border-primary/20 bg-secondary p-6">
            <div class="flex items-start gap-4">
              <UserAvatar
                :avatar-url="authorAvatarUrl"
                :username="authorName"
                size="lg"
              />
              <div class="flex-1">
                <router-link :to="`/profile/${article.profiles?.username}`" class="font-sans text-2xl font-bold text-primary hover:text-tertiary transition-colors">
                  {{ authorName }}
                </router-link>
                <p class="mt-2 text-primary/70">
                  {{ article.profiles?.bio || 'Nessuna biografia disponibile' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h2 class="mb-4 font-sans text-3xl font-bold text-primary">
          Articolo non trovato
        </h2>
        <router-link to="/" class="inline-block rounded-lg bg-tertiary px-4 py-2 text-secondary transition-colors hover:bg-tertiary/90">
          Torna alla home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DOMPurify from 'dompurify'
import { useAuthStore } from '@/stores/auth'
import { useArticlesStore } from '@/stores/articles'
import { formatDate } from '@/lib/utils'
import { placeholderArticlesData } from '@/data/placeholders'
import { useMetaTags } from '@/composables/useMetaTags'
import { useToast } from '@/composables/useToast'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import TagBadge from '@/components/ui/TagBadge.vue'

const route = useRoute()
const router = useRouter()
const metaTags = useMetaTags()
const authStore = useAuthStore()
const articlesStore = useArticlesStore()
const toast = useToast()

const article = ref(null)
const isLiked = ref(false)
const likeCount = ref(0)
const isPlaceholder = ref(false)
const isLiking = ref(false)
const activeImageIndex = ref(0)
const isFavorite = ref(false)

const authorName = computed(() => article.value?.profiles?.display_name || article.value?.profiles?.username)

const authorAvatarUrl = computed(() => {
  const profile = article.value?.profiles
  return profile?.avatar_url || null
})

const articleImages = computed(() => {
  const blocks = Array.isArray(article.value?.content?.blocks) ? article.value.content.blocks : []

  return blocks
    .filter((block) => block?.type === 'image')
    .map((block) => {
      const data = block?.data || {}
      const src = data.file?.url || data.url || ''

      return {
        src,
        alt: data.alt || data.caption || article.value?.title || '',
        caption: data.caption || '',
      }
    })
    .filter((image) => image.src)
})

const activeImage = computed(() => {
  return articleImages.value[activeImageIndex.value] || null
})

// Autoplay and hover state
const isHovered = ref(false)
const autoplay = ref(true)
const autoplayInterval = ref(4000)
const autoplayTimer = ref(null)

const startAutoplay = () => {
  stopAutoplay()
  if (!autoplay.value || articleImages.value.length < 2) return
  autoplayTimer.value = setInterval(() => {
    if (!isHovered.value) {
      activeImageIndex.value = (activeImageIndex.value + 1) % articleImages.value.length
    }
  }, autoplayInterval.value)
}

const stopAutoplay = () => {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value)
    autoplayTimer.value = null
  }
}

onBeforeUnmount(() => {
  stopAutoplay()
})

const escapeHtml = (value) => {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const renderBlock = (block) => {
  const data = block?.data || {}

  if (block?.type === 'header') {
    const level = Math.min(Math.max(Number(data.level) || 2, 1), 6)
    return `<h${level}>${escapeHtml(data.text)}</h${level}>`
  }

  if (block?.type === 'list') {
    const tag = data.style === 'ordered' ? 'ol' : 'ul'
    const items = Array.isArray(data.items)
      ? data.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
      : ''
    return `<${tag}>${items}</${tag}>`
  }

  if (block?.type === 'quote') {
    const caption = data.caption ? `<cite>${escapeHtml(data.caption)}</cite>` : ''
    return `<blockquote><p>${escapeHtml(data.text)}</p>${caption}</blockquote>`
  }

  if (block?.type === 'image') {
    const src = data.file?.url || data.url || ''
    if (!src) return ''

    const caption = data.caption ? `<figcaption>${escapeHtml(data.caption)}</figcaption>` : ''
    const alt = escapeHtml(data.alt || data.caption || '')
    return `<figure><img src="${escapeHtml(src)}" alt="${alt}" />${caption}</figure>`
  }

  return `<p>${escapeHtml(data.text || '')}</p>`
}

const renderEditorContent = (content) => {
  if (!content) return ''

  if (typeof content === 'string') {
    return DOMPurify.sanitize(content)
  }

  if (typeof content === 'object' && Array.isArray(content.blocks)) {
    return DOMPurify.sanitize(content.blocks.map(renderBlock).join(''))
  }

  return ''
}

const sanitizedContent = computed(() => renderEditorContent(article.value?.content))

const isAuthor = computed(() => {
  return authStore.isAuthenticated && authStore.user?.id === article.value?.author_id
})

onMounted(async () => {
  await loadArticle()
  startAutoplay()
})

watch(
  () => article.value?.id,
  () => {
    activeImageIndex.value = 0
  }
)

watch(
  () => articleImages.value.length,
  (len) => {
    if (len > 1) startAutoplay()
    else stopAutoplay()
  }
)

const nextImage = () => {
  if (articleImages.value.length < 2) return
  activeImageIndex.value = (activeImageIndex.value + 1) % articleImages.value.length
}

const prevImage = () => {
  if (articleImages.value.length < 2) return
  activeImageIndex.value =
    (activeImageIndex.value - 1 + articleImages.value.length) % articleImages.value.length
}

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
      url: `https://the-brutal.web.app/details/${articleId}`,
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
      url: `https://the-brutal.web.app/details/${articleId}`,
      type: 'article',
    })

    if (authStore.isAuthenticated) {
      isLiked.value = await articlesStore.checkIfLiked(data.id, authStore.user.id)
      isFavorite.value = authStore.isFavoritePost(data.id)
    }
  } catch (err) {
    console.error('Load article error:', err)
  }
}

const toggleFavorite = async () => {
  if (isPlaceholder.value) return
  if (!authStore.isAuthenticated) {
    toast.info('Accedi per salvare i preferiti')
    router.push('/auth')
    return
  }

  try {
    const nextState = await authStore.toggleFavoritePost(article.value.id)
    isFavorite.value = nextState
    toast.success(nextState ? 'Aggiunto ai preferiti' : 'Rimosso dai preferiti')
  } catch (err) {
    console.error('Toggle favorite error:', err)
    toast.error('Impossibile aggiornare i preferiti')
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
