<template>
  <div class="min-h-screen bg-primary py-12 px-4">
    <div class="mx-auto max-w-4xl">
      <!-- Success Overlay (FEAT 1) -->
      <div v-if="publishedArticle" class="fixed inset-0 z-50 flex items-center justify-center bg-secondary/60 backdrop-blur-sm">
        <div class="bg-primary border border-secondary/20 rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <div class="w-16 h-16 bg-tertiary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-tertiary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-secondary mb-2" style="font-family: 'Playfair Display', serif;">
            Articolo pubblicato
          </h2>
          <p class="text-secondary/70 mb-6">
            {{ publishedArticle.title }}
          </p>
          <div class="flex flex-col gap-3">
            <router-link :to="`/details/${publishedArticle.id}`" class="px-6 py-3 rounded-lg bg-tertiary text-secondary hover:bg-tertiary/90 transition-colors font-medium">
              Visualizza articolo
            </router-link>
            <button
              @click="writeAnother"
              class="px-6 py-3 rounded-lg border border-secondary/20 bg-primary hover:bg-secondary/5 transition-colors font-medium text-secondary"
            >
              Scrivi un altro
            </button>
          </div>
        </div>
      </div>

      <!-- Loading Skeleton (BUG 8) -->
      <div v-if="isLoading" class="space-y-6 animate-pulse">
        <div class="h-10 bg-secondary/20 rounded w-3/4"></div>
        <div class="h-20 bg-secondary/20 rounded"></div>
        <div class="h-64 bg-secondary/20 rounded"></div>
        <div class="h-40 bg-secondary/20 rounded"></div>
      </div>

      <template v-else>
        <!-- Header -->
        <div class="mb-8">
          <h1 class="font-sans text-4xl font-bold text-secondary mb-2">
            {{ isEditing ? 'Modifica articolo' : 'Scrivi un nuovo articolo' }}
          </h1>
          <p class="text-secondary/70">
            Condividi le tue riflessioni e idee con la comunità
          </p>
        </div>

      <!-- Form -->
      <form @submit.prevent="handlePublish" class="space-y-6">
        <!-- Excerpt -->
        <div>
          <textarea
            v-model="formData.excerpt"
            placeholder="Descrizione breve dell'articolo (apparirà nelle anteprime)"
            class="w-full px-4 py-3 rounded-lg border border-secondary/20 bg-primary text-secondary placeholder-secondary/40 focus:outline-none focus:ring-2 focus:ring-tertiary transition-all resize-none"
            rows="3"
          />
        </div>

        <!-- Editor -->
        <div>
          <label class="block text-sm font-medium text-secondary mb-3">
            Contenuto
          </label>
          <PostEditor
            ref="editorRef"
            v-model:title="formData.title"
            v-model="formData.content"
            :cover-url="formData.cover_url"
          />
          <p v-if="contentError" class="mt-2 text-sm text-red-600">
            {{ contentError }}
          </p>
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-secondary mb-3">
            Tag (separati da virgola)
          </label>
          <input
            v-model="tagsInput"
            type="text"
            placeholder="es. design, estetica, digitale"
            class="w-full px-4 py-2 rounded-lg border border-secondary/20 bg-primary text-secondary placeholder-secondary/40 focus:outline-none focus:ring-2 focus:ring-tertiary transition-all"
          />
          <div v-if="formData.tags.length > 0" class="flex flex-wrap gap-2 mt-3">
            <span
              v-for="tag in formData.tags"
              :key="tag"
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary/20 text-secondary text-sm"
            >
              {{ tag }}
              <button
                type="button"
                @click="removeTag(tag)"
                class="hover:text-tertiary"
              >
                ×
              </button>
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-4 pt-6 border-t border-secondary/20">
          <button
            type="button"
            @click="saveDraft"
            class="flex-1 px-6 py-3 rounded-lg border border-secondary/20 bg-primary hover:bg-secondary/5 transition-colors font-medium text-secondary"
          >
            {{ isEditing ? 'Salva modifiche come bozza' : 'Salva come bozza' }}
          </button>
          <button
            type="submit"
            class="flex-1 px-6 py-3 rounded-lg bg-tertiary text-secondary hover:bg-tertiary/90 transition-colors font-medium"
          >
            {{ isEditing ? 'Pubblica modifiche' : 'Pubblica articolo' }}
          </button>
        </div>
      </form>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useArticlesStore } from '@/stores/articles'
import { useToast } from '@/composables/useToast'
import PostEditor from '@/components/editor/PostEditor.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const articlesStore = useArticlesStore()
const toast = useToast()

const editorRef = ref(null)
const tagsInput = ref('')
const isLoading = ref(false)
const contentError = ref('')
const publishedArticle = ref(null)

const formData = ref({
  title: '',
  excerpt: '',
  content: '',
  cover_url: '',
  tags: [],
})

const isEditing = computed(() => !!route.params.id)

onMounted(async () => {
    isLoading.value = true
    try {
      const article = await articlesStore.fetchArticleById(route.params.id)
      if (article.author_id !== authStore.user.id) {
        router.push('/')
        return
      }
      formData.value = {
        title: article.title || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        cover_url: article.cover_url || article.content?.cover || '',
        tags: article.tags || [],
      }
      tagsInput.value = article.tags?.join(', ') || ''
    } catch (err) {
      console.error('Load article error:', err)
      toast.error('Errore nel caricamento dell\'articolo')
      router.push('/')
    } finally {
      isLoading.value = false
    }
})

watch(() => tagsInput.value, (newVal) => {
  formData.value.tags = newVal
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
})

const removeTag = (tag) => {
  const index = formData.value.tags.indexOf(tag)
  if (index > -1) {
    formData.value.tags.splice(index, 1)
    tagsInput.value = formData.value.tags.join(', ')
  }
}

const saveDraft = async () => {
  await publishArticle(false)
}

const handlePublish = async () => {
  await publishArticle(true)
}

const publishArticle = async (published) => {
  contentError.value = ''

  if (!formData.value.title.trim()) {
    toast.error('Inserisci un titolo')
    return
  }

  const contentData = await editorRef.value?.save?.()
  const coverFile = editorRef.value?.getCoverFile?.()
  let finalCoverUrl = formData.value.cover_url || ''

  if (coverFile) {
    finalCoverUrl = await articlesStore.uploadCoverImage(coverFile)
  }

  const plainText = editorRef.value?.getText?.()?.trim() || ''
  if (plainText.length <= 50) {
    contentError.value = 'Il contenuto deve essere di almeno 50 caratteri.'
    return
  }

  try {
    contentData.cover = finalCoverUrl
    const articleData = {
      title: formData.value.title,
      excerpt: formData.value.excerpt,
      content: contentData,
      cover_url: finalCoverUrl,
      tags: formData.value.tags,
      published,
      author_id: authStore.user.id,
    }

    let result
    if (isEditing.value) {
      result = await articlesStore.updateArticle(route.params.id, articleData)
      result = { ...result, id: route.params.id }
    } else {
      result = await articlesStore.createArticle(articleData)
    }

    if (published) {
      publishedArticle.value = { id: result.id, title: formData.value.title }
    } else {
      toast.success('Bozza salvata con successo')
      router.push(`/details/${result.id}`)
    }
  } catch (err) {
    console.error('Publish error:', err)
    if (err.message?.includes('unique') || err.message?.includes('duplicate')) {
      toast.error('Esiste già un articolo con questo titolo. Scegli un titolo diverso.')
    } else {
      toast.error('Errore nella pubblicazione dell\'articolo')
    }
  }
}

const writeAnother = () => {
  publishedArticle.value = null
  formData.value = { title: '', excerpt: '', content: '', cover_url: '', tags: [] }
  tagsInput.value = ''
}
</script>
