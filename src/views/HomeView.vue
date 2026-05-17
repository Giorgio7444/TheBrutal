<template>
  <div class="relative min-h-screen overflow-hidden bg-secondary text-primary flex items-center justify-center opacity-100">
      <div class="absolute h-[90svh] top-[-1px] opacity-100">
        <img :src="bgGif" class="h-full w-auto max-w-none object-contain object-center">
      </div>
    

    <div class="bottonihome absolute top-[90vh] flex justify-between gap-x-[5px] w-[50vw]">
      <router-link
        v-for="link in homeLinks"
        :key="link.to"
        :to="link.to"
        class="flex items-center justify-center whitespace-nowrap text-primary hover:text-tertiary transition-colors">
        <div class="rounded-full bg-tertiary flex-shrink-0"></div>
        <div class="text-[2vw] font-bold"> {{ link.label }} </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import logoSvg from '../../assets/logo.svg'
import bgGif from '../../assets/bg.gif'

const homeLinks = [
  { to: '/designers', label: 'Designers' },
  { to: '/auth', label: 'Iscrizioni' },
  { to: '/manifesto', label: 'Manifesto' },
  { to: '/profile', label: 'Profilo' },
]
</script>
