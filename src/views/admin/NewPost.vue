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
          <p class="text-sm uppercase tracking-[0.3em] text-secondary">Admin / Nuovo post</p>
          <h1 class="mt-3 font-sans text-4xl font-bold text-secondary">Crea un nuovo post</h1>
          <p class="mt-3 max-w-2xl text-secondary/70">
            Compila il titolo, scrivi il contenuto e gestisci le immagini dalla colonna laterale.
          </p>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import PostEditor from '@/components/editor/PostEditor.vue'
import PostImageManager from '@/components/editor/PostImageManager.vue'
import { useAuthStore } from '@/stores/auth'
import { useArticlesStore } from '@/stores/articles'
import { useToast } from '@/composables/useToast'
import { db } from '@/lib/firebase'
import { mergeEditorContentWithImages } from '@/lib/utils'

const router = useRouter()

const authStore = useAuthStore()
const articlesStore = useArticlesStore()
const toast = useToast()

const editorRef = ref(null)
const title = ref('')
const content = ref('')
const images = ref([])
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

const savePost = async (status) => {
  if (isSaving.value) return

  const normalizedTitle = title.value.trim()
  if (!normalizedTitle) {
    setFeedback('error', 'Inserisci un titolo prima di salvare.')
    toast.error('Inserisci un titolo prima di salvare.')
    return
  }

  if (!authStore.user?.id) {
    setFeedback('error', "Utente non autenticato. Effettua di nuovo l'accesso.")
    toast.error('Utente non autenticato.')
    return
  }

  isSaving.value = true
  feedbackMessage.value = ''

  try {
    const contentData = await editorRef.value?.save?.()
    const mergedContent = mergeEditorContentWithImages(contentData, images.value)
    const plainText = editorRef.value?.getText?.() || ''
    const excerpt = plainText.slice(0, 200)
    const coverUrl = images.value[0]?.url || mergedContent.cover || ''

    const postData = {
      title: normalizedTitle,
      content: mergedContent,
      excerpt,
      cover_url: coverUrl,
      author_id: authStore.user.id,
      status,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    await addDoc(collection(db, 'posts'), postData)

    const message = status === 'draft' ? 'Bozza salvata con successo.' : 'Post pubblicato con successo.'
    setFeedback('success', message)
    if (status === 'draft') {
      toast.success(message)
    }
    await router.push({ name: 'AdminPosts' })
  } catch (err) {
    console.error('New post save error:', err)
    setFeedback('error', 'Impossibile salvare il post. Riprova.')
    toast.error('Impossibile salvare il post. Riprova.')
  } finally {
    isSaving.value = false
  }
}
</script>