<template>
  <div class="relative bg-secondary text-primary flex items-center justify-center opacity-100"
       style="height: 100dvh; overflow: hidden;">
      <div class="absolute top-[-1px] opacity-100"
           style="height: 87dvh;">
        <img :src="bgGif" class="h-full w-auto object-contain object-center"
             style="max-width: 100vw;">
      </div>

    <div class="bottonihome absolute flex justify-between gap-x-[5px] w-[50vw]"
         style="top: min(82dvh, 82dvh); bottom: unset;">
      <router-link
        v-for="link in homeLinks"
        :key="link.to"
        :to="link.to"
        class="flex items-center justify-center whitespace-nowrap text-primary hover:text-tertiary transition-colors">
        <div class="font-bold" style="font-size: clamp(12pt, 2vw, 2vw);"> {{ link.label }} </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import bgGif from '../../assets/bg.gif'

const homeLinks = [
  { to: '/designers', label: 'Designers' },
  { to: '/bookshelf', label: 'Bookshelf' },
  { to: '/manifesto', label: 'Manifesto' },
]
</script>
