<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-4">
    <div class="mx-auto max-w-4xl">
      <!-- Success Overlay (FEAT 1) -->
      <div v-if="publishedArticle" class="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-sm">
        <div class="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-neutral-950 dark:text-white mb-2" style="font-family: 'Playfair Display', serif;">
            Articolo pubblicato
          </h2>
          <p class="text-neutral-600 dark:text-neutral-400 mb-6">
            {{ publishedArticle.title }}
          </p>
          <div class="flex flex-col gap-3">
            <router-link
              :to="`/article/${publishedArticle.id}`"
              class="px-6 py-3 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors font-medium"
            >
              Visualizza articolo
            </router-link>
            <button
              @click="writeAnother"
              class="px-6 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-neutral-950 dark:text-white"
            >
              Scrivi un altro
            </button>
          </div>
        </div>
      </div>

      <!-- Loading Skeleton (BUG 8) -->
      <div v-if="isLoading" class="space-y-6 animate-pulse">
        <div class="h-10 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4"></div>
        <div class="h-20 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
        <div class="h-64 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
        <div class="h-40 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
      </div>

      <template v-else>
        <!-- Header -->
        <div class="mb-8">
          <h1 class="font-sans text-4xl font-bold text-neutral-950 dark:text-white mb-2">
            {{ isEditing ? 'Modifica articolo' : 'Scrivi un nuovo articolo' }}
          </h1>
          <p class="text-neutral-600 dark:text-neutral-400">
            Condividi le tue riflessioni e idee con la comunità
          </p>
        </div>

      <!-- Form -->
      <form @submit.prevent="handlePublish" class="space-y-6">
        <!-- Title -->
        <div>
          <input
            v-model="formData.title"
            type="text"
            placeholder="Titolo dell'articolo"
            class="w-full text-4xl font-sans font-bold text-neutral-950 dark:text-white bg-transparent placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none mb-4"
            required
          />
          <div class="h-1 bg-gradient-to-r from-teal-600 to-transparent" />
        </div>

        <!-- Excerpt -->
        <div>
          <textarea
            v-model="formData.excerpt"
            placeholder="Descrizione breve dell'articolo (apparirà nelle anteprime)"
            class="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-950 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all resize-none"
            rows="3"
          />
        </div>

        <!-- Cover Image -->
        <div>
          <label class="block text-sm font-medium text-neutral-950 dark:text-white mb-3">
            Immagine di copertina
          </label>
          <div class="relative">
            <div
              v-if="!formData.cover_url"
              class="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-8 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-colors"
              @click="triggerCoverUpload"
            >
              <svg class="w-12 h-12 mx-auto text-neutral-400 dark:text-neutral-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <p class="font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Clicca per caricare un'immagine
              </p>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">
                o trascina l'immagine qui
              </p>
            </div>
            <div v-else class="relative rounded-lg overflow-hidden">
              <img :src="formData.cover_url" alt="Cover" class="w-full h-64 object-cover" />
              <button
                type="button"
                @click="removeCover"
                class="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                aria-label="Rimuovi immagine di copertina"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                </svg>
              </button>
            </div>
          </div>
          <input
            ref="coverInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleCoverUpload"
          />
        </div>

        <!-- Editor -->
        <div>
          <label class="block text-sm font-medium text-neutral-950 dark:text-white mb-3">
            Contenuto
          </label>
          <TiptapEditor
            ref="editorRef"
            v-model="formData.content"
            @image-upload="handleImageUpload"
          />
          <p v-if="contentError" class="mt-2 text-sm text-red-600 dark:text-red-400">
            {{ contentError }}
          </p>
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-neutral-950 dark:text-white mb-3">
            Tag (separati da virgola)
          </label>
          <input
            v-model="tagsInput"
            type="text"
            placeholder="es. design, estetica, digitale"
            class="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-950 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
          />
          <div v-if="formData.tags.length > 0" class="flex flex-wrap gap-2 mt-3">
            <span
              v-for="tag in formData.tags"
              :key="tag"
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-sm"
            >
              {{ tag }}
              <button
                type="button"
                @click="removeTag(tag)"
                class="hover:text-teal-900 dark:hover:text-teal-200"
              >
                ×
              </button>
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            @click="saveDraft"
            class="flex-1 px-6 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors font-medium text-neutral-950 dark:text-white"
          >
            {{ isEditing ? 'Salva modifiche come bozza' : 'Salva come bozza' }}
          </button>
          <button
            type="submit"
            class="flex-1 px-6 py-3 rounded-lg bg-teal-600 dark:bg-teal-600 text-white hover:bg-teal-700 dark:hover:bg-teal-700 transition-colors font-medium"
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
import { isStorageEnabled } from '@/lib/firebase'
import TiptapEditor from '@/components/editor/TiptapEditor.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const articlesStore = useArticlesStore()
const toast = useToast()

const editorRef = ref(null)
const coverInput = ref(null)
const tagsInput = ref('')
const isLoading = ref(false)
const contentError = ref('')
const publishedArticle = ref(null)
const storageEnabled = isStorageEnabled
const storageWarning = 'Storage non configurato: upload immagini disabilitato'

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
        cover_url: article.cover_url || '',
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
  }
})

watch(() => tagsInput.value, (newVal) => {
  formData.value.tags = newVal
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
})

const triggerCoverUpload = () => {
  if (!storageEnabled) {
    toast.error(storageWarning)
    return
  }
  coverInput.value?.click()
}

const handleCoverUpload = async (event) => {
  if (!storageEnabled) {
    toast.error(storageWarning)
    if (coverInput.value) coverInput.value.value = ''
    return
  }
  const file = event.target.files?.[0]
  if (file) {
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('File troppo grande (max 5MB)')
      if (coverInput.value) coverInput.value.value = ''
      return
    }

    try {
      const url = await articlesStore.uploadCoverImage(file)
      formData.value.cover_url = url
    } catch (err) {
      console.error('Cover upload error:', err)
      toast.error('Errore nel caricamento dell\'immagine')
    }
  }
  coverInput.value.value = ''
}

const removeCover = () => {
  formData.value.cover_url = ''
}

const handleImageUpload = async (file) => {
  if (!storageEnabled) {
    toast.error(storageWarning)
    return
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    toast.error('File troppo grande (max 5MB)')
    return
  }

  try {
    const url = await articlesStore.uploadImage(file)
    if (editorRef.value?.editor) {
      editorRef.value.editor.chain().focus().setImage({ src: url }).run()
    }
  } catch (err) {
    console.error('Image upload error:', err)
    toast.error('Errore nel caricamento dell\'immagine')
  }
}

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

  // BUG 6: validate content length
  const plainText = editorRef.value?.editor?.getText()?.trim() || ''
  if (plainText.length <= 50) {
    contentError.value = 'Il contenuto deve essere di almeno 50 caratteri.'
    return
  }

  try {
    const articleData = {
      title: formData.value.title,
      excerpt: formData.value.excerpt,
      content: formData.value.content,
      cover_url: formData.value.cover_url,
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
      router.push(`/article/${result.id}`)
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
