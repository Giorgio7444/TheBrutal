<template>
  <div class="flex flex-wrap gap-2 p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
    <!-- Bold -->
    <button
      :class="[
        'p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors',
        { 'bg-neutral-200 dark:bg-neutral-800': editor?.isActive('bold') }
      ]"
      @click="editor?.chain().focus().toggleBold().run()"
      title="Bold (Ctrl+B)"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6V4zm0 10h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6v-8z" />
      </svg>
    </button>

    <!-- Italic -->
    <button
      :class="[
        'p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors',
        { 'bg-neutral-200 dark:bg-neutral-800': editor?.isActive('italic') }
      ]"
      @click="editor?.chain().focus().toggleItalic().run()"
      title="Italic (Ctrl+I)"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 5v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V5z" />
      </svg>
    </button>

    <!-- Strikethrough -->
    <button
      :class="[
        'p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors',
        { 'bg-neutral-200 dark:bg-neutral-800': editor?.isActive('strike') }
      ]"
      @click="editor?.chain().focus().toggleStrike().run()"
      title="Strikethrough"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 14h18v-2H3v2zm0-8v3h5v3h4v-3h5V6H3z" />
      </svg>
    </button>

    <div class="w-full border-b border-neutral-200 dark:border-neutral-700 my-2" />

    <!-- H2 -->
    <button
      :class="[
        'px-2 py-1 text-sm font-bold rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors',
        { 'bg-neutral-200 dark:bg-neutral-800': editor?.isActive('heading', { level: 2 }) }
      ]"
      @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
      title="Heading 2"
    >
      H2
    </button>

    <!-- H3 -->
    <button
      :class="[
        'px-2 py-1 text-sm font-bold rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors',
        { 'bg-neutral-200 dark:bg-neutral-800': editor?.isActive('heading', { level: 3 }) }
      ]"
      @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
      title="Heading 3"
    >
      H3
    </button>

    <!-- Blockquote -->
    <button
      :class="[
        'p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors',
        { 'bg-neutral-200 dark:bg-neutral-800': editor?.isActive('blockquote') }
      ]"
      @click="editor?.chain().focus().toggleBlockquote().run()"
      title="Quote"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.5-2-7-2s-7 .75-7 2v10c0 1 0 2 2 2s4 0 4-1V7c0 1-2 2-4 2s-4-1-4-1v5c0 1 0 1 1 1s1 0 1 1v1c-1 1-2 1-4 1z" />
      </svg>
    </button>

    <!-- Code -->
    <button
      :class="[
        'p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors',
        { 'bg-neutral-200 dark:bg-neutral-800': editor?.isActive('code') }
      ]"
      @click="editor?.chain().focus().toggleCode().run()"
      title="Inline Code"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.4 16.6L4.8 12l4.6-4.6L6.6 6 0 12l6.6 6 2.8-2.4zm5.2 0l4.6-4.6-4.6-4.6 2.8-2.4L24 12l-6.6 6 2.8 2.4z" />
      </svg>
    </button>

    <!-- Bullet List -->
    <button
      :class="[
        'p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors',
        { 'bg-neutral-200 dark:bg-neutral-800': editor?.isActive('bulletList') }
      ]"
      @click="editor?.chain().focus().toggleBulletList().run()"
      title="Bullet List"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
      </svg>
    </button>

    <!-- Ordered List -->
    <button
      :class="[
        'p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors',
        { 'bg-neutral-200 dark:bg-neutral-800': editor?.isActive('orderedList') }
      ]"
      @click="editor?.chain().focus().toggleOrderedList().run()"
      title="Ordered List"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3.5 4.5h2V3h-2v1.5zm0 5h2V8h-2v1.5zm0 5h2v-1.5h-2V14.5zM8 3v2h13V3H8zm0 5v2h13V8H8zm0 5v2h13v-2H8z" />
      </svg>
    </button>

    <div class="w-full border-b border-neutral-200 dark:border-neutral-700 my-2" />

    <!-- Link -->
    <button
      :class="[
        'p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors',
        { 'bg-neutral-200 dark:bg-neutral-800': editor?.isActive('link') }
      ]"
      @click="setLink"
      title="Add Link"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
      </svg>
    </button>

    <!-- Image -->
    <button
      @click="triggerImageUpload"
      class="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
      title="Add Image"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
      </svg>
    </button>

    <!-- Clear Formatting -->
    <button
      @click="editor?.chain().focus().clearNodes().run()"
      class="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors ml-auto"
      title="Clear Formatting"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
      </svg>
    </button>
  </div>

  <input
    ref="imageInput"
    type="file"
    accept="image/*"
    style="display: none"
    @change="handleImageUpload"
  />
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  editor: Object,
})

const emit = defineEmits(['upload-image'])
const imageInput = ref(null)

const setLink = () => {
  const previousUrl = props.editor?.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)

  if (url === null) {
    return
  }

  if (url === '') {
    props.editor?.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  props.editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

const triggerImageUpload = () => {
  imageInput.value?.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    emit('upload-image', file)
  }
  imageInput.value.value = ''
}
</script>
