<template>
  <footer>
    <div class="mx-auto w-screen px-4 sm:px-6 lg:px-8 py-12 bg-primary border-t-2">

        <div>
          <h3 class="mr-6 ml-6 text-lg mb-4 text-secondary mt-[1vh] max-w-[40vw]">Italian Spotlight</h3>
          <div class="flex flex-col gap-4 items-start md:flex-row md:items-center md:justify-between">
            <p class="mr-6 ml-6 text-secondary text-sm">
              Italian Spotlight è un progetto che vuole nobilitare l'eccellenza italiana del visual design, puntando la luce sui designer che hanno reso grande il nostro paese.
            </p>

            <div class="flex flex-col-2 items-start w-full items-right">
              <div class="flex flex-col text-right">
            <p class="text-secondary text-sm">
                <a href="https://www.instagram.com/italian_spotlight/" 
              target="_blank" 
              rel="noopener" 
              class="text-secondary hover:text-secondary/50 transition-colors">
                IS Instagram
              </a>
            </p>

            <p class="text-secondary text-sm">
              <a href="https://italianspotlight.substack.com/?utm_campaign=profile_chips" 
              target="_blank" 
              rel="noopener" 
              class="font- text-secondary hover:text-secondary/50 transition-colors">
                IS Substack
              </a>
            </p>
          </div>

          <div class="flex flex-col text-right ml-6">
            <p class="text-secondary text-sm">
              <a href="https://www.instagram.com/veeswal/" 
              target="_blank" 
              rel="noopener" 
              class="text-secondary hover:text-secondary/50 transition-colors">
                Owner's IG
              </a>
            </p>

            <p class="text-secondary text-sm">
              <a href="mailto:italianspotlight@outlook.it" 
              class="text-secondary hover:text-secondary/50 transition-colors">
                Contact us
              </a>
            </p>
          </div>
        </div>  
      </div>
    </div>



  </div> 
  </footer>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
