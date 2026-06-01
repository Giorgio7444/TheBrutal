<template>
  <div class="min-h-screen bg-primary lg:overflow-hidden">
    <div class="flex h-screen flex-col lg:h-[calc(100dvh-4.5rem)] lg:flex-row lg:items-start">
      <aside class="relative h-[93vh] overflow-hidden border-b border-secondary/20 bg-secondary/5 lg:h-[93vh] lg:w-[40vw] lg:shrink-0 lg:border-b-0 lg:border-r">
        <div v-if="loading" class="flex h-full items-center justify-center px-6 text-center text-secondary/70">
          Caricamento post...
        </div>

        <div v-else-if="errorMessage" class="flex h-full items-center justify-center px-6 text-center text-red-700">
          {{ errorMessage }}
        </div>

        <div v-else-if="slides.length" class="relative h-full w-full overflow-hidden">
          <div
            v-for="(slide, index) in slides"
            :key="slide.id"
            class="absolute inset-0 transition-opacity duration-500 ease-out"
            :class="index === activeSlideIndex ? 'opacity-100' : 'pointer-events-none opacity-0'"
          >
            <img :src="slide.src" :alt="slide.alt" class="h-full w-full object-cover" />
          </div>

          <div class="absolute inset-x-0 bottom-0 flex h-[100px] items-center bg-primary px-4 backdrop-blur-sm sm:px-6">
            <div class="flex w-full items-center justify-between gap-4 text-secondary">
              <button
                type="button"
                class="flex h-11 w-11 items-center justify-center rounded-full border border-secondary/20 bg-primary text-secondary transition-colors hover:bg-secondary/5"
                :disabled="slides.length < 2"
                aria-label="Immagine precedente"
                @click="prevSlide"
              >
                ←
              </button>

              <div class="min-w-[6rem] text-center font-mono text-lg tracking-[0.2em] text-secondary">
                {{ activeSlideIndex + 1 }}/{{ slides.length }}
              </div>

              <button
                type="button"
                class="flex h-11 w-11 items-center justify-center rounded-full border border-secondary/20 bg-primary text-secondary transition-colors hover:bg-secondary/5"
                :disabled="slides.length < 2"
                aria-label="Immagine successiva"
                @click="nextSlide"
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div v-else class="flex h-full items-center justify-center px-8 text-center text-secondary/70">
          Nessuna immagine disponibile per lo slideshow.
        </div>
      </aside>

      <article class="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div class="mx-auto w-full max-w-3xl">
          <template v-if="post">
            <p class="mb-4 text-sm uppercase tracking-[0.3em] text-tertiary">Blog</p>
            <h1 class="font-sans text-4xl font-bold text-secondary sm:text-5xl">{{ post.title }}</h1>
            <p class="mt-4 text-sm text-secondary/70">{{ formatDate(post.createdAt) }}</p>

            <div class="prose prose-neutral mt-10 max-w-none prose-headings:font-sans prose-headings:text-secondary prose-p:text-secondary/90 prose-li:text-secondary/90 prose-blockquote:border-tertiary prose-blockquote:text-secondary/80">
              <div v-html="renderedContent" />
            </div>
          </template>

          <div v-else-if="!loading && !errorMessage" class="rounded-2xl border border-secondary/20 bg-primary p-8 text-secondary/70">
            Post non trovato.
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import edjsHTML from 'editorjs-html'
import DOMPurify from 'dompurify'
import { db } from '@/lib/firebase'
import { formatDate, getEditorImageBlocks, getEditorTextBlocks, normalizeEditorContent, normalizeFirestoreDate } from '@/lib/utils'

const route = useRoute()
const post = ref(null)
const loading = ref(true)
const errorMessage = ref('')
const activeSlideIndex = ref(0)

const parser = edjsHTML()

const slides = computed(() => {
  const content = normalizeEditorContent(post.value?.content)
  const imageBlocks = getEditorImageBlocks(content)

  const mappedImages = imageBlocks
    .map((block, index) => {
      const data = block?.data || {}
      const src = data.file?.url || data.url || ''

      return {
        id: `${src || index}-${index}`,
        src,
        alt: data.alt || data.caption || post.value?.title || '',
        caption: data.caption || post.value?.title || '',
      }
    })
    .filter((image) => image.src)

  if (mappedImages.length > 0) return mappedImages

  const fallbackCover = post.value?.cover_url || content.cover || ''
  return fallbackCover
    ? [
        {
          id: fallbackCover,
          src: fallbackCover,
          alt: post.value?.title || '',
          caption: post.value?.title || '',
        },
      ]
    : []
})

const renderedContent = computed(() => {
  const content = normalizeEditorContent(post.value?.content)
  const textBlocks = getEditorTextBlocks(content)
  const rendered = parser.parse({ ...content, blocks: textBlocks })
  const html = Array.isArray(rendered) ? rendered.flat(Infinity).join('') : String(rendered || '')
  return DOMPurify.sanitize(html)
})

const nextSlide = () => {
  if (slides.value.length < 2) return
  activeSlideIndex.value = (activeSlideIndex.value + 1) % slides.value.length
}

const prevSlide = () => {
  if (slides.value.length < 2) return
  activeSlideIndex.value = (activeSlideIndex.value - 1 + slides.value.length) % slides.value.length
}

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

watch(
  () => post.value?.id,
  () => {
    activeSlideIndex.value = 0
  }
)

watch(
  () => slides.value.length,
  () => {
    if (activeSlideIndex.value >= slides.value.length) {
      activeSlideIndex.value = 0
    }
  }
)

onMounted(loadPost)
</script>