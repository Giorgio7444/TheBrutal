<template>
  <div class="min-h-screen bg-secondary px-4 py-10 sm:px-6 lg:px-8">
    <div class="mx-auto w-full max-w-[90vw]">
          <div class="pb-4">
            <p class="text-s uppercase text-primary/50">Title and image required</p>
            <h1 class="text-primary uppercase">New Post</h1>
        </div>
  <div class=" min-h-screen bg-secondary lg:overflow-hidden">
    <div class="flex min-h-screen flex-col lg:h-screen lg:flex-row">
      <PostImageManager
        v-model:images="images"
        class="lg:w-[40%]"
        :disabled="authStore.loading || !authStore.isAuthenticated"
        @error="handleImageError"
      />

      <section class="flex lg:w-[60%]">
        <div class="w-[100%]">
          <div class="bg-secondary">
            <PostEditor
              ref="editorRef"
              v-model:title="title"
              v-model="content"
            />

            <div class="mt-4 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                class="flex-1  border border-primary px-4 py-2 font-s text-primary transition-colors hover:border-tertiary disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="isSaving"
                @click="savePost('draft')"
              >
                Salva bozza
              </button>
              <button
                type="button"
                class="flex-1 bg-tertiary px-4 py-2 font-s text-secondary transition-colors hover:bg-tertiary/70 disabled:cursor-not-allowed disabled:bg-grey-500"
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

  return 'border border-tertiary/30 bg-tertiary/10 text-primary'
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