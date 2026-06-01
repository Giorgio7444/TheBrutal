<template>
  <div class="space-y-4">
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
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Quote from '@editorjs/quote'
import { normalizeEditorContent } from '@/lib/utils'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Object],
    default: '',
  },
})

const emit = defineEmits(['update:title', 'update:modelValue'])

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
const currentData = ref(normalizeEditorContent(props.modelValue))
let editor = null
let lastSerialized = serializeContent(currentData.value)

const emitTitle = () => {
  emit('update:title', localTitle.value)
}

const emitContent = async () => {
  if (!editor) return currentData.value

  const data = await editor.save()
  currentData.value = {
    ...data,
    cover: currentData.value.cover || '',
  }
  lastSerialized = serializeContent(currentData.value)
  emit('update:modelValue', currentData.value)
  return currentData.value
}

const getText = () => extractPlainText(currentData.value)

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

onBeforeUnmount(async () => {
  try {
    if (editor?.destroy) {
      await editor.destroy()
    }
  } catch {
  } finally {
    editor = null
  }
})

defineExpose({
  save,
  getText,
})
</script>
