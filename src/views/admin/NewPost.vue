<template>
  <div class="min-h-screen bg-primary px-4 py-10 sm:px-6 lg:px-8">
    <div class="mx-auto w-full max-w-5xl">
      <div class="mb-8 space-y-3">
        <p class="text-sm uppercase tracking-[0.3em] text-secondary">
          Admin / Nuovo post
        </p>
        <h1 class="font-sans text-4xl font-bold text-secondary">
          Crea un nuovo post
        </h1>
        <p class="max-w-2xl text-secondary/70">
          Compila il titolo dentro l'editor, scrivi il contenuto e salva una bozza oppure pubblica subito il post.
        </p>
      </div>

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
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import PostEditor from '@/components/editor/PostEditor.vue'
import { useAuthStore } from '@/stores/auth'
import { useArticlesStore } from '@/stores/articles'
import { useToast } from '@/composables/useToast'
import { db } from '@/lib/firebase'

const router = useRouter()

const authStore = useAuthStore()
const articlesStore = useArticlesStore()
const toast = useToast()

const editorRef = ref(null)
const title = ref('')
const content = ref('')
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
    const coverFile = editorRef.value?.getCoverFile?.()
    let coverUrl = contentData?.cover || ''

    if (coverFile) {
      coverUrl = await articlesStore.uploadCoverImage(coverFile)
    }

    contentData.cover = coverUrl
    const plainText = editorRef.value?.getText?.() || ''
    const excerpt = plainText.slice(0, 200)

    const postData = {
      title: normalizedTitle,
      content: contentData,
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