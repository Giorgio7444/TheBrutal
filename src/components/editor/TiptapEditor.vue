<template>
  <div class="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-950">
    <EditorToolbar
      :editor="editor"
      @upload-image="handleImageUpload"
    />
    <div
      v-if="editor"
      class="prose dark:prose-invert prose-neutral max-w-none p-6 focus-within:outline-none"
    >
      <EditorContent :editor="editor" />
    </div>
  </div>
</template>

<script setup>
import { watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import EditorToolbar from './EditorToolbar.vue'

const props = defineProps({
  modelValue: String,
})

const emit = defineEmits(['update:modelValue', 'image-upload'])

const editor = useEditor({
  extensions: [
    StarterKit,
    Image.configure({
      allowBase64: false,
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded-lg',
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-teal-600 dark:text-teal-400 underline hover:text-teal-700 dark:hover:text-teal-300',
      },
    }),
    Placeholder.configure({
      placeholder: 'Scrivi il contenuto del tuo articolo qui...',
    }),
  ],
  content: props.modelValue || '',
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

// Sync quando il contenuto esterno cambia (es. caricamento articolo in modifica)
watch(() => props.modelValue, (newVal) => {
  if (!editor.value) return
  const current = editor.value.getHTML()
  if (newVal !== current) {
    editor.value.commands.setContent(newVal || '', false)
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const handleImageUpload = async (file) => {
  emit('image-upload', file)
}

defineExpose({ editor })
</script>

<style>
.ProseMirror {
  outline: none;
}

.ProseMirror p.is-editor-empty:first-child::before {
  color: #999;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
