<template>
  <div class="min-h-screen bg-secondary lg:overflow-hidden">
    <div class="flex h-screen flex-col lg:h-[calc(100dvh-4.5rem)] lg:flex-row lg:items-start">
      <aside class="relative h-[45vh] overflow-hidden border-b border-secondary/20 bg-secondary/5 lg:h-[93vh] lg:w-[40vw] lg:shrink-0 lg:border-b-0 lg:border-r">
        <div v-if="loading" class="flex h-full items-center justify-center px-6 text-center text-primary/70">
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

          <div class="absolute inset-x-0 bottom-0 flex h-[100px] items-center bg-secondary px-4 backdrop-blur-sm sm:px-6">
            <div class="flex w-full items-center justify-between gap-4 text-secondary">
              <button
                type="button"
                class="flex h-11 w-11 items-center justify-center text-primary transition-colors hover:bg-tertiary hover:text-secondary"
                :disabled="slides.length < 2"
                aria-label="Immagine precedente"
                @click="prevSlide"
              >
                ←
              </button>

              <div class="min-w-[6rem] text-center font-mono text-lg tracking-[0.2em] text-primary">
                {{ activeSlideIndex + 1 }}/{{ slides.length }}
              </div>

              <button
                type="button"
                class="flex h-11 w-11 items-center justify-center text-primary transition-colors hover:bg-tertiary hover:text-secondary"
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

      <article class="flex flex-col min-h-0 w-full px-4 py-6 sm:px-6 lg:px-10 lg:py-10 h-[55vh] lg:h-auto lg:block">
        <div class="w-full flex flex-col min-h-0 flex-1 lg:block">
          <template v-if="post">
            <h1 class="flex text-primary w-full sm:text-5xl shrink-0">{{ post.title }}</h1>
            <p class="flex mb-4 text-sm w-full text-primary/70 shrink-0">{{ formatDate(post.createdAt) }}</p>

            <div class="w-full mt-16 text-primary flex-1 min-h-0 overflow-y-auto pr-2 lg:h-[51vh] lg:flex-none">
              <div v-html="renderedContent" class="w-full" />
            </div>
          </template>

          <div v-else-if="!loading && !errorMessage" class="rounded-2xl border border-secondary/20 bg-secondary p-8 text-primary">
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