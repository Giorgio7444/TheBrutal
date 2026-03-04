<template>
  <span
    class="inline-block px-3 py-1 rounded-full text-xs font-medium bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
  >
    #{{ tag }}
  </span>
</template>

<script setup>
defineProps({
  tag: {
    type: String,
    required: true,
  },
})
</script>
