<template>
  <div class="min-h-screen bg-primary px-4 py-10 sm:px-6 lg:px-8">
    <article class="mx-auto w-full max-w-4xl">
      <div v-if="loading" class="rounded-2xl border border-secondary/20 bg-primary p-8 text-secondary/70">
        Caricamento post...
      </div>

      <div v-else-if="errorMessage" class="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {{ errorMessage }}
      </div>

      <template v-else-if="post">
        <p class="mb-4 text-sm uppercase tracking-[0.3em] text-tertiary">Blog</p>
        <h1 class="font-sans text-5xl font-bold text-secondary">{{ post.title }}</h1>
        <p class="mt-4 text-sm text-secondary/70">{{ formatDate(post.createdAt) }}</p>

        <div class="prose mt-10 max-w-none" v-html="renderedContent" />
      </template>

      <div v-else class="rounded-2xl border border-secondary/20 bg-primary p-8 text-secondary/70">
        Post non trovato.
      </div>
    </article>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import edjsHTML from 'editorjs-html'
import DOMPurify from 'dompurify'
import { db } from '@/lib/firebase'
import { formatDate, normalizeEditorContent, normalizeFirestoreDate } from '@/lib/utils'

const route = useRoute()
const post = ref(null)
const loading = ref(true)
const errorMessage = ref('')

const parser = edjsHTML()


const renderedContent = computed(() => {
  const content = normalizeEditorContent(post.value?.content)
  const rendered = parser.parse(content)
  const html = Array.isArray(rendered) ? rendered.flat(Infinity).join('') : String(rendered || '')
  return DOMPurify.sanitize(html)
})

const loadPost = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const snapshot = await getDoc(doc(db, 'posts', route.params.id))
    if (!snapshot.exists() || snapshot.data().status !== 'published') {
      post.value = null
      return
    }

    post.value = {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: normalizeFirestoreDate(snapshot.data().createdAt),
    }
  } catch (err) {
    console.error('Load blog post error:', err)
    errorMessage.value = 'Impossibile caricare il post.'
  } finally {
    loading.value = false
  }
}

onMounted(loadPost)
</script>