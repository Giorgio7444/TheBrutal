<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-20">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="flex justify-center mb-4">
          <div class="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-700 dark:from-teal-500 dark:to-teal-600 rounded-lg flex items-center justify-center text-white font-serif text-xl font-bold">
            E
          </div>
        </div>
        <h1 class="font-serif text-3xl font-bold text-neutral-950 dark:text-white mb-2">
          Estetica Digitale
        </h1>
        <p class="text-neutral-600 dark:text-neutral-400">
          Accedi per iniziare a scrivere e condividere i tuoi articoli
        </p>
      </div>

      <!-- Error Alert -->
      <div
        v-if="authStore.error"
        class="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm"
      >
        {{ authStore.error }}
      </div>

      <!-- Auth Buttons -->
      <div class="space-y-3">
        <!-- Google -->
        <button
          @click="signInWithGoogle"
          :disabled="authStore.loading"
          class="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span class="font-medium text-neutral-950 dark:text-white">
            {{ authStore.loading ? 'Caricamento...' : 'Continua con Google' }}
          </span>
        </button>

        <!-- GitHub -->
        <button
          @click="signInWithGithub"
          :disabled="authStore.loading"
          class="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span class="font-medium text-neutral-950 dark:text-white">
            {{ authStore.loading ? 'Caricamento...' : 'Continua con GitHub' }}
          </span>
        </button>
      </div>

      <!-- Divider -->
      <div class="relative my-8">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-neutral-200 dark:border-neutral-800" />
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400">
            oppure
          </span>
        </div>
      </div>

      <!-- Email/Password Form -->
      <form @submit.prevent="handleEmailSignup" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-neutral-950 dark:text-white mb-2">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="tuo@email.com"
            required
            class="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-950 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-neutral-950 dark:text-white mb-2">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            class="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-950 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full px-4 py-3 rounded-lg bg-teal-600 dark:bg-teal-600 text-white hover:bg-teal-700 dark:hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ authStore.loading ? 'Caricamento...' : 'Accedi con Email' }}
        </button>
      </form>

      <!-- Info -->
      <p class="mt-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
        Accedendo accetti i nostri termini di servizio e l'informativa sulla privacy.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')

const signInWithGoogle = async () => {
  try {
    await authStore.signInWithGoogle()
  } catch (err) {
    console.error('Google sign in failed:', err)
  }
}

const signInWithGithub = async () => {
  try {
    await authStore.signInWithGithub()
  } catch (err) {
    console.error('GitHub sign in failed:', err)
  }
}

const handleEmailSignup = async () => {
  try {
    // Prova prima il login, se l'utente non esiste lo registra
    const { error: signInErr } = await authStore.signInWithEmail(email.value, password.value)
    if (!signInErr) {
      const redirect = route.query.redirect || '/'
      router.push(redirect)
    }
  } catch (err) {
    console.error('Email auth failed:', err)
  }
}
</script>
