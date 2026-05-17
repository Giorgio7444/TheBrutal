<template>
  <div class="space-y-4">
    <div class="space-y-3">
      <label class="block text-sm font-medium text-secondary">
        Cover
      </label>
      <div class="relative">
        <div
          v-if="!displayCoverUrl"
          class="border-2 border-dashed border-secondary/30 rounded-lg p-8 text-center cursor-pointer hover:border-tertiary hover:bg-tertiary/10 transition-colors"
          @click="triggerCoverUpload"
        >
          <svg class="w-12 h-12 mx-auto text-secondary/50 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <p class="font-medium text-secondary mb-1">
            Clicca per caricare una cover
          </p>
          <p class="text-sm text-secondary/70">
            o trascina un'immagine qui
          </p>
        </div>
        <div v-else class="relative rounded-lg overflow-hidden">
          <img :src="displayCoverUrl" alt="Cover" class="w-full h-64 object-cover" />
          <button
            type="button"
            @click="triggerCoverUpload"
            class="absolute top-2 right-2 h-9 w-9 flex items-center justify-center bg-secondary/85 text-primary rounded-full hover:bg-secondary transition-colors"
            aria-label="Sostituisci cover"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      <input
        ref="coverInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleCoverUpload"
      />
    </div>

    <input
      v-model="localTitle"
      type="text"
      placeholder="Titolo articolo"
      class="w-full text-4xl font-sans font-bold text-secondary bg-transparent placeholder-secondary/40 focus:outline-none"
      @input="emitTitle"
    />

    <div class="h-1 bg-gradient-to-r from-tertiary to-transparent" />

    <div
      ref="holder"
      class="min-h-[28rem] rounded-lg border border-secondary/20 bg-primary px-4 py-4 text-secondary"
    />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import EditorJS from '@editorjs/editorjs'
import ImageTool from '@editorjs/image'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Quote from '@editorjs/quote'
import { useArticlesStore } from '@/stores/articles'
import { normalizeEditorContent } from '@/lib/utils'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  coverUrl: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Object],
    default: '',
  },
})

const emit = defineEmits(['update:title', 'update:modelValue'])
const articlesStore = useArticlesStore()

const serializeContent = (value) => {
  try {
    return JSON.stringify(value || null)
  } catch {
    return ''
  }
}

const extractPlainText = (data) => {
  const blocks = Array.isArray(data?.blocks) ? data.blocks : []

  return blocks
    .map((block) => {
      const blockData = block?.data || {}
      if (block.type === 'list') {
        if (!Array.isArray(blockData.items)) return ''
        return blockData.items
          .map((item) => (typeof item === 'string' ? item : item?.content || ''))
          .join(' ')
      }
      if (block.type === 'quote') {
        return `${blockData.text || ''} ${blockData.caption || ''}`.trim()
      }
      if (block.type === 'image') {
        return blockData.caption || blockData.alt || ''
      }
      return blockData.text || ''
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const holder = ref(null)
const localTitle = ref(props.title || '')
const coverInput = ref(null)
const coverFile = ref(null)
const coverPreviewUrl = ref('')
const displayCoverUrl = ref(props.coverUrl || '')
const currentData = ref(normalizeEditorContent(props.modelValue))
let editor = null
let lastSerialized = serializeContent(currentData.value)

const emitTitle = () => {
  emit('update:title', localTitle.value)
}

const triggerCoverUpload = () => {
  coverInput.value?.click()
}

const syncContentCover = () => {
  currentData.value = {
    ...normalizeEditorContent(currentData.value),
    cover: displayCoverUrl.value || '',
  }
  lastSerialized = serializeContent(currentData.value)
  emit('update:modelValue', currentData.value)
}

const handleCoverUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  coverFile.value = file

  if (coverPreviewUrl.value) {
    URL.revokeObjectURL(coverPreviewUrl.value)
  }

  coverPreviewUrl.value = URL.createObjectURL(file)
  displayCoverUrl.value = coverPreviewUrl.value
  syncContentCover()

  if (coverInput.value) coverInput.value.value = ''
}

const emitContent = async () => {
  if (!editor) return currentData.value

  const data = await editor.save()
  currentData.value = {
    ...data,
    cover: displayCoverUrl.value || '',
  }
  lastSerialized = serializeContent(currentData.value)
  emit('update:modelValue', currentData.value)
  return currentData.value
}

const getText = () => extractPlainText(currentData.value)

const getCoverFile = () => coverFile.value

const save = async () => {
  return await emitContent()
}

watch(
  () => props.title,
  (value) => {
    if (value !== localTitle.value) {
      localTitle.value = value || ''
    }
  }
)

watch(
  () => props.coverUrl,
  (value) => {
    if (!coverFile.value) {
      displayCoverUrl.value = value || currentData.value.cover || ''
      syncContentCover()
    }
  },
  { immediate: true }
)

watch(
  () => props.modelValue,
  async (value) => {
    const normalized = normalizeEditorContent(value)
    const serialized = serializeContent(normalized)

    if (serialized === lastSerialized) return

    currentData.value = normalized
    displayCoverUrl.value = normalized.cover || displayCoverUrl.value || ''
    lastSerialized = serialized

    if (editor) {
      await editor.render(normalized)
    }
  }
)

onMounted(async () => {
  editor = new EditorJS({
    holder: holder.value,
    data: currentData.value,
    autofocus: true,
    placeholder: 'Scrivi il contenuto qui...',
    tools: {
      header: Header,
      list: List,
      quote: Quote,
      image: {
        class: ImageTool,
        config: {
          uploader: {
            uploadByFile: async (file) => {
              const url = await articlesStore.uploadImage(file)
              return {
                success: 1,
                file: { url },
              }
            },
          },
        },
      },
    },
    onChange: async () => {
      try {
        await emitContent()
      } catch (err) {
        console.error('Editor save error:', err)
      }
    },
  })
})

onBeforeUnmount(() => {
  if (editor?.destroy) {
    editor.destroy()
  }

  if (coverPreviewUrl.value) {
    URL.revokeObjectURL(coverPreviewUrl.value)
  }

  editor = null
})

defineExpose({
  save,
  getText,
  getCoverFile,
})
</script>
