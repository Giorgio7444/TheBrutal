<template>
  <section class="flex h-full min-h-0 flex-col border-r border-secondary/20 bg-primary">
    <div class="shrink-0 border-b border-secondary/20 px-6 py-5">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-secondary/60">Media</p>
          <h2 class="mt-2 font-sans text-2xl font-bold text-secondary">Immagini del post</h2>
        </div>

        <button
          type="button"
          class="rounded-full border border-secondary/20 bg-primary px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-secondary/5 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="isUploading || disabled"
          @click="triggerFilePicker"
        >
          {{ isUploading ? 'Caricamento...' : 'Aggiungi immagini' }}
        </button>
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
      <div v-if="!images.length" class="flex h-full min-h-[18rem] items-center justify-center rounded-2xl border border-dashed border-secondary/20 bg-secondary/5 px-6 text-center text-secondary/60">
        Aggiungi una o più immagini per costruire la galleria del post.
      </div>

      <div v-else class="space-y-3">
        <article
          v-for="(image, index) in images"
          :key="image.id"
          class="group flex min-h-[120px] w-full items-stretch gap-3 rounded-2xl border border-secondary/20 bg-primary p-3 shadow-sm transition-colors hover:border-tertiary/40"
          draggable="true"
          @dragstart="startDrag(index)"
          @dragend="endDrag"
          @dragover.prevent
          @drop.prevent="dropOn(index)"
        >
          <div class="flex h-[120px] w-[120px] shrink-0 overflow-hidden rounded-xl border border-secondary/20 bg-secondary/5">
            <img :src="image.url" :alt="image.alt || image.name" class="h-full w-full object-cover" />
          </div>

          <div class="min-w-0 flex-1 py-1">
            <p class="truncate text-base font-medium text-secondary">{{ image.name }}</p>
            <p class="mt-3 text-xs uppercase tracking-[0.25em] text-secondary/40">Slide {{ index + 1 }}</p>
          </div>

          <div class="flex shrink-0 flex-col items-stretch gap-2">
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-full border border-secondary/20 text-secondary/70 transition-colors hover:bg-secondary/5 hover:text-secondary"
              aria-label="Trascina per riordinare"
              title="Trascina per riordinare"
            >
              ≡
            </button>
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-full border border-red-200 text-red-700 transition-colors hover:bg-red-50"
              aria-label="Elimina immagine"
              @click="removeImage(image.id)"
            >
              ×
            </button>
          </div>
        </article>
      </div>
    </div>

    <input ref="fileInput" type="file" accept="image/*" class="hidden" multiple :disabled="disabled" @change="handleFileSelection" />
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useArticlesStore } from '@/stores/articles'

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:images', 'error'])
const articlesStore = useArticlesStore()

const fileInput = ref(null)
const isUploading = ref(false)
const draggedIndex = ref(null)
const localImages = computed({
  get: () => normalizeImages(props.images),
  set: (value) => {
    emit('update:images', normalizeImages(value))
  },
})

const normalizeImages = (value) => {
  return Array.isArray(value)
    ? value
        .map((image, index) => ({
          id: image.id || `${image.url || image.name || 'image'}-${index}`,
          url: image.url || '',
          name: image.name || image.caption || image.url?.split('/').pop() || `immagine-${index + 1}`,
          alt: image.alt || image.name || image.caption || '',
          caption: image.caption || '',
        }))
        .filter((image) => image.url)
    : []
}

const triggerFilePicker = () => {
  if (props.disabled || isUploading.value) return
  fileInput.value?.click()
}

const moveImage = (fromIndex, toIndex) => {
  if (toIndex < 0 || toIndex >= localImages.value.length) return

  const nextImages = [...localImages.value]
  const [item] = nextImages.splice(fromIndex, 1)
  nextImages.splice(toIndex, 0, item)
  localImages.value = nextImages
}

const removeImage = (imageId) => {
  localImages.value = localImages.value.filter((image) => image.id !== imageId)
}

const startDrag = (index) => {
  draggedIndex.value = index
}

const endDrag = () => {
  draggedIndex.value = null
}

const dropOn = (targetIndex) => {
  if (draggedIndex.value === null || draggedIndex.value === targetIndex) return
  moveImage(draggedIndex.value, targetIndex)
  draggedIndex.value = null
}

const addImageFiles = async (files) => {
  if (!files.length || props.disabled) return

  isUploading.value = true

  try {
    const uploadedImages = []

    for (const file of files) {
      const url = await articlesStore.uploadImage(file)
      uploadedImages.push({
        id: `${url}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        url,
        name: file.name,
        alt: file.name,
        caption: '',
      })
    }

    localImages.value = [...localImages.value, ...uploadedImages]
  } catch (err) {
    console.error('Image upload error:', err)
    emit('error', 'Impossibile caricare una o più immagini.')
  } finally {
    isUploading.value = false
  }
}

const handleFileSelection = async (event) => {
  const files = Array.from(event.target.files || [])
  await addImageFiles(files)
  if (fileInput.value) fileInput.value.value = ''
}
</script>