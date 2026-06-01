<template>
  <div class="min-h-screen bg-primary lg:h-screen lg:overflow-hidden">
    <div class="flex min-h-screen flex-col lg:h-screen lg:flex-row">
      <PostImageManager
        v-model:images="images"
        class="lg:w-1/2"
        :disabled="authStore.loading || !authStore.isAuthenticated"
        @error="handleImageError"
      />

      <section class="flex min-h-0 flex-1 flex-col bg-primary lg:w-1/2">
        <div class="shrink-0 border-b border-secondary/20 px-6 py-5">
          <p class="text-sm uppercase tracking-[0.3em] text-secondary">Admin / Modifica post</p>
          <h1 class="mt-3 font-sans text-4xl font-bold text-secondary">Modifica post</h1>
        </div>

        <div v-if="loading" class="flex-1 px-4 py-4 sm:px-6">
          <div class="rounded-2xl border border-secondary/20 bg-primary p-8 text-secondary/70">
            Caricamento post...
          </div>
        </div>

        <div v-else-if="loadError" class="flex-1 px-4 py-4 sm:px-6">
          <div class="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {{ loadError }}
          </div>
        </div>

        <div v-else class="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <div class="rounded-2xl border border-secondary/20 bg-primary p-5 shadow-sm sm:p-8">
            <PostEditor
              ref="editorRef"
              v-model:title="title"
              v-model="content"
            />

            <div class="mt-6 flex flex-col gap-3 border-t border-secondary/20 pt-6 sm:flex-row">
              <button
                type="button"
                class="flex-1 rounded-lg border border-secondary/20 bg-primary px-6 py-3 font-medium text-secondary transition-colors hover:bg-secondary/5 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="isSaving"
                @click="savePost('draft')"
              >
                Salva bozza
              </button>
              <button
                type="button"
                class="flex-1 rounded-lg bg-tertiary px-6 py-3 font-medium text-secondary transition-colors hover:bg-tertiary/90 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="isSaving"
                @click="savePost('published')"
              >
                Pubblica
              </button>
            </div>

            <p v-if="feedbackMessage" class="mt-4 rounded-lg px-4 py-3 text-sm" :class="feedbackClass">
              {{ feedbackMessage }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore'
import PostEditor from '@/components/editor/PostEditor.vue'
import PostImageManager from '@/components/editor/PostImageManager.vue'
import { useAuthStore } from '@/stores/auth'
import { db } from '@/lib/firebase'
import { useArticlesStore } from '@/stores/articles'
import { useToast } from '@/composables/useToast'
import { getEditorTextBlocks, mergeEditorContentWithImages, normalizeEditorContent, normalizePostImages } from '@/lib/utils'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const articlesStore = useArticlesStore()
const authStore = useAuthStore()

const editorRef = ref(null)
const title = ref('')
const content = ref('')
const images = ref([])
const postData = ref(null)
const loading = ref(true)
const loadError = ref('')
const isSaving = ref(false)
const feedbackMessage = ref('')
const feedbackType = ref('success')

const feedbackClass = computed(() => {
  if (feedbackType.value === 'error') {
    return 'border border-red-200 bg-red-50 text-red-700'
  }

  return 'border border-tertiary/30 bg-tertiary/10 text-secondary'
})

const setFeedback = (type, message) => {
  feedbackType.value = type
  feedbackMessage.value = message
}

const handleImageError = (message) => {
  setFeedback('error', message)
  toast.error(message)
}

const loadPost = async () => {
  loading.value = true
  loadError.value = ''

  try {
    const snapshot = await getDoc(doc(db, 'posts', route.params.id))
    if (!snapshot.exists()) {
      throw new Error('Post non trovato')
    }

    postData.value = { id: snapshot.id, ...snapshot.data() }
    title.value = snapshot.data().title || ''
    const normalizedContent = normalizeEditorContent(snapshot.data().content)
    content.value = {
      ...normalizedContent,
      blocks: getEditorTextBlocks(normalizedContent),
      cover: snapshot.data().cover_url || normalizedContent.cover || '',
    }
    images.value = normalizePostImages(snapshot.data().content)
  } catch (err) {
    console.error('Load post error:', err)
    loadError.value = 'Impossibile caricare il post.'
  } finally {
    loading.value = false
  }
}

const savePost = async (status) => {
  if (isSaving.value || !postData.value) return

  const normalizedTitle = title.value.trim()
  if (!normalizedTitle) {
    setFeedback('error', 'Inserisci un titolo prima di salvare.')
    toast.error('Inserisci un titolo prima di salvare.')
    return
  }

  isSaving.value = true
  feedbackMessage.value = ''

  try {
    const contentData = await editorRef.value?.save?.()
    const mergedContent = mergeEditorContentWithImages(contentData, images.value)
    const plainText = editorRef.value?.getText?.() || ''
    const finalCoverUrl = images.value[0]?.url || mergedContent.cover || postData.value?.cover_url || ''

    await updateDoc(doc(db, 'posts', route.params.id), {
      title: normalizedTitle,
      content: mergedContent,
      excerpt: plainText.slice(0, 200),
      cover_url: finalCoverUrl,
      status,
      updatedAt: serverTimestamp(),
    })

setFeedback('success', status === 'draft' ? 'Bozza aggiornata con successo.' : 'Post pubblicato con successo.')
if (status === 'published') {
  await router.push({ name: 'AdminPosts' })
} else {
  toast.success('Bozza aggiornata con successo.')
}
  } catch (err) {
    console.error('Update post error:', err)
    setFeedback('error', 'Impossibile aggiornare il post.')
    toast.error('Impossibile aggiornare il post.')
  } finally {
    isSaving.value = false
  }
}

onMounted(loadPost)
</script>