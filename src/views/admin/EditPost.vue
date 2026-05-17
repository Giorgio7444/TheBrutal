<template>
  <div class="min-h-screen bg-primary px-4 py-10 sm:px-6 lg:px-8">
    <div class="mx-auto w-full max-w-5xl">
      <div class="mb-8 space-y-3">
        <p class="text-sm uppercase tracking-[0.3em] text-secondary">Admin / Modifica post</p>
        <h1 class="font-sans text-4xl font-bold text-secondary">Modifica post</h1>
      </div>

      <div v-if="loading" class="rounded-2xl border border-secondary/20 bg-primary p-8 text-secondary/70">
        Caricamento post...
      </div>

      <div v-else-if="loadError" class="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {{ loadError }}
      </div>

      <div v-else class="rounded-2xl border border-secondary/20 bg-primary p-5 shadow-sm sm:p-8">
        <PostEditor
          ref="editorRef"
          v-model:title="title"
          v-model="content"
          :cover-url="coverUrl"
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
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore'
import PostEditor from '@/components/editor/PostEditor.vue'
import { db } from '@/lib/firebase'
import { useArticlesStore } from '@/stores/articles'
import { useToast } from '@/composables/useToast'
import { normalizeEditorContent } from '@/lib/utils'

const route = useRoute()
const toast = useToast()
const articlesStore = useArticlesStore()

const editorRef = ref(null)
const title = ref('')
const content = ref('')
const coverUrl = ref('')
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
    content.value = normalizeEditorContent(snapshot.data().content)
    coverUrl.value = snapshot.data().cover_url || snapshot.data().content?.cover || ''
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
    const coverFile = editorRef.value?.getCoverFile?.()
    let finalCoverUrl = coverUrl.value

    if (coverFile) {
      finalCoverUrl = await articlesStore.uploadCoverImage(coverFile)
    }

    contentData.cover = finalCoverUrl
    const plainText = editorRef.value?.getText?.() || ''

    await updateDoc(doc(db, 'posts', route.params.id), {
      title: normalizedTitle,
      content: contentData,
      excerpt: plainText.slice(0, 200),
      cover_url: finalCoverUrl,
      status,
      updatedAt: serverTimestamp(),
    })

    setFeedback('success', status === 'draft' ? 'Bozza aggiornata con successo.' : 'Post pubblicato con successo.')
    if (status === 'draft') {
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