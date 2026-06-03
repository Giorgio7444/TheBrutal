<template>
  <section class="flex h-full min-h-0 flex-col bg-secondary">
    <div class="min-h-0 flex-1 overflow-y-auto pr-4 sm:pr-4">
      <div v-if="!images.length" class="flex h-full h-[60vh] mb-4 items-center justify-center bg-primary/10 px-6 text-center text-primary/80">
        Add one or more images to build the post gallery.
      </div>

      <div v-else class="h-[60vh] overflow-y-auto">
        <article
          v-for="(image, index) in images"
          :key="image.id"
          class="group flex min-h-[120px] w-full items-stretch p-4 gap-3 transition-colors hover:bg-primary/20"
          draggable="true"
          @dragstart="startDrag(index)"
          @dragend="endDrag"
          @dragover.prevent
          @drop.prevent="dropOn(index)"
        >
          <div class="flex h-[120px] w-[120px] shrink-0 overflow-hidden">
            <img :src="image.url" :alt="image.alt || image.name" class="h-full w-full object-cover" />
          </div>

          <div class="min-w-0 flex-1">
            <p class="text-xs uppercase text-tertiary">Slide {{ index + 1 }}</p>
            <p class="truncate text-primary font-bold">{{ image.name }}</p>
          </div>

          <div class="flex shrink-0 flex-col items-stretch gap-2">
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center text-secondary bg-primary font-bold text-xl transition-colors hover:bg-tertiary"
              aria-label="Trascina per riordinare"
              title="Trascina per riordinare"
            >
              ≡
            </button>
            <button
              type="button"
              class="flex h-7 w-7 items-center justify-center text-secondary bg-red-500 font-bold text-xl transition-colors hover:bg-red-600"
              aria-label="Elimina immagine"
              @click="removeImage(image.id)"
            >
              ×
            </button>
          </div>
        </article>
      </div>

    <div class="bg-secondary w-full mt-3 bg-primary">
      <div>
      <button
          type="button"
          class="inline-flex items-center justify-center py-[3.6%] px-4 bg-primary w-full h-full font-xs text-secondary transition-colors hover:bg-tertiary"
          :disabled="isUploading || disabled"
          @click="triggerFilePicker"
        >
          {{ isUploading ? 'Caricamento...' : 'Aggiungi immagini' }}
        </button>
      </div>
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