<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950">
    <!-- Loading State -->
    <div v-if="articlesStore.loading" class="flex items-center justify-center min-h-screen">
      <div class="inline-flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-neutral-200 dark:border-neutral-800 border-t-teal-600 dark:border-t-teal-600 rounded-full animate-spin" />
        <p class="text-neutral-600 dark:text-neutral-400">Caricamento articolo...</p>
      </div>
    </div>

    <!-- Article Content -->
    <article v-else-if="article" class="py-20 px-4">
      <div class="mx-auto max-w-3xl">
        <!-- Header -->
        <div class="mb-12">
          <div class="flex flex-wrap gap-2 mb-6">
            <TagBadge
              v-for="tag in article.tags"
              :key="tag"
              :tag="tag"
            />
          </div>

          <h1 class="font-sans text-5xl md:text-6xl font-bold text-neutral-950 dark:text-white mb-6">
            {{ article.title }}
          </h1>

          <!-- Author Info -->
          <div class="flex items-center gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
            <UserAvatar
              :avatar-url="article.profiles?.avatar_url"
              :username="article.profiles?.username"
              size="md"
            />
            <div>
              <router-link
                :to="`/profile/${article.profiles?.username}`"
                class="font-sans text-2xl font-bold text-neutral-950 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                {{ article.profiles?.username }}
              </router-link>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">
                {{ formatDate(article.created_at) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Cover Image -->
        <div v-if="article.cover_url" class="mb-12 rounded-lg overflow-hidden">
          <img
            :src="article.cover_url"
            :alt="article.title"
            class="w-full h-auto"
          />
        </div>

        <!-- Content -->
        <div
          class="prose dark:prose-invert prose-neutral max-w-none mb-12"
          v-html="sanitizedContent"
        />

        <!-- Like & Actions -->
        <div class="flex items-center gap-4 py-6 border-t border-neutral-200 dark:border-neutral-800">
          <button
            @click="toggleLike"
            :disabled="!authStore.isAuthenticated || isPlaceholder"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
              isPlaceholder ? 'opacity-60 cursor-not-allowed' : '',
              isLiked
                ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            ]"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {{ likeCount }}
          </button>

          <button
            v-if="isAuthor"
            @click="editArticle"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
              <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
            Modifica
          </button>

          <button
            v-if="isAuthor"
            @click="deleteArticle"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900 transition-colors ml-auto"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z" />
            </svg>
            Elimina
          </button>
        </div>

        <!-- Author Card -->
        <div class="mt-16 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
          <div class="flex items-start gap-4">
            <UserAvatar
              :avatar-url="article.profiles?.avatar_url"
              :username="article.profiles?.username"
              size="lg"
            />
            <div class="flex-1">
              <router-link
                :to="`/profile/${article.profiles?.username}`"
                class="font-sans text-2xl font-bold text-neutral-950 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                {{ article.profiles?.username }}
              </router-link>
              <p class="text-neutral-600 dark:text-neutral-400 mt-2">
                {{ article.profiles?.bio || 'Nessuna biografia disponibile' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>

    <!-- Not Found -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h2 class="font-sans text-3xl font-bold text-neutral-950 dark:text-white mb-4">
          Articolo non trovato
        </h2>
        <router-link
          to="/"
          class="px-4 py-2 rounded-lg bg-teal-600 dark:bg-teal-600 text-white hover:bg-teal-700 dark:hover:bg-teal-700 transition-colors inline-block"
        >
          Torna alla home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DOMPurify from 'dompurify'
import { useAuthStore } from '@/stores/auth'
import { useArticlesStore } from '@/stores/articles'
import { formatDate } from '@/lib/utils'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import TagBadge from '@/components/ui/TagBadge.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const articlesStore = useArticlesStore()

const article = ref(null)
const isLiked = ref(false)
const likeCount = ref(0)
const isPlaceholder = ref(false)

const placeholderArticlesData = {
  'placeholder-1': {
    id: 'placeholder-1',
    title: 'Il Brutalismo Digitale: origini e significato',
    excerpt: 'Come il brutalismo architettonico ha ispirato un movimento estetico nel web design contemporaneo.',
    cover_url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&h=600&fit=crop',
    tags: ['Estetica', 'Teoria e Tecnica'],
    profiles: { username: 'marco_b', avatar_url: null, bio: 'Appassionato di architettura e design digitale.' },
    likes: [{ count: 24 }],
    created_at: '2026-02-15T10:30:00Z',
    content: '<p>Il brutalismo digitale affonda le sue radici nell\'architettura brutalista degli anni \'50 e \'60, un movimento che celebrava i materiali grezzi — in particolare il béton brut, il cemento a vista — come espressione di onestà strutturale.</p><h2>Dal cemento ai pixel</h2><p>Nel contesto del web design, il brutalismo digitale si manifesta attraverso layout volutamente grezzi, tipografia sovradimensionata, palette cromatiche aggressive e un rifiuto delle convenzioni estetiche del design "pulito" contemporaneo. Non si tratta di incapacità progettuale, ma di una scelta consapevole.</p><p>I siti brutalisti espongono la struttura della pagina, rendono visibili i meccanismi del codice e sfidano l\'utente a confrontarsi con un\'esperienza non mediata dall\'ornamento.</p><h2>Perché il brutalismo oggi?</h2><p>In un panorama dominato da template identici e interfacce prevedibili, il brutalismo digitale rappresenta un atto di resistenza. È la risposta a un web che ha sacrificato l\'identità sull\'altare dell\'usabilità standardizzata.</p><p>Designer come David Rudnick, Virgil Abloh e lo studio Metahaven hanno dimostrato che il brutalismo non è un\'estetica del passato, ma un linguaggio vivo che continua a evolversi e a provocare.</p><blockquote><p>"Il brutalismo non è brutto. È onesto."</p></blockquote><p>Questa onestà si traduce in siti che non nascondono la loro natura digitale, che non simulano materiali fisici e che abbracciano i vincoli — e le possibilità — del medium.</p>',
  },
  'placeholder-2': {
    id: 'placeholder-2',
    title: 'Tipografia raw: quando il carattere diventa struttura',
    excerpt: 'Un\'esplorazione dell\'uso tipografico nel design brutalista.',
    cover_url: 'https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?w=1200&h=600&fit=crop',
    tags: ['Tipografia', 'Composizione'],
    profiles: { username: 'lucia_design', avatar_url: null, bio: 'Type designer e ricercatrice visuale.' },
    likes: [{ count: 18 }],
    created_at: '2026-02-10T14:00:00Z',
    content: '<p>Nel design brutalista la tipografia non è un veicolo trasparente per il contenuto: è il contenuto stesso. I caratteri tipografici vengono usati come elementi architettonici, blocchi costruttivi che definiscono lo spazio della pagina.</p><h2>Oltre la leggibilità</h2><p>Il brutalismo tipografico sfida la gerarchia tradizionale. Un titolo può essere più piccolo del corpo testo. Un paragrafo può sovrapporsi a un\'immagine. Le dimensioni vengono portate all\'estremo — testo microscopico o lettere che occupano l\'intero viewport.</p><p>Questa rottura delle regole non è casuale. Ogni scelta è intenzionale, mirata a creare tensione visiva e a costringere il lettore a rallentare, a prestare attenzione.</p><h2>Monospace e grazia grezza</h2><p>I caratteri monospace sono diventati un simbolo del brutalismo digitale. La loro regolarità meccanica evoca il terminale, il codice sorgente, l\'infrastruttura nascosta del web. Usarli in un contesto editoriale significa esporre la macchina.</p><p>Ma anche i serif più classici, utilizzati a dimensioni estreme o con spaziature inusuali, possono acquisire una qualità brutalista. Non è il carattere in sé, ma come viene utilizzato.</p><blockquote><p>"La tipografia brutalista non decora. Costruisce."</p></blockquote>',
  },
  'placeholder-3': {
    id: 'placeholder-3',
    title: 'Anti-design: la bellezza dell\'imperfezione',
    excerpt: 'In un\'epoca di interfacce levigate, l\'anti-design propone una nuova forma di autenticità visiva.',
    cover_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=600&fit=crop',
    tags: ['Estetica', 'Ispirazione'],
    profiles: { username: 'giovanni_r', avatar_url: null, bio: 'Critico d\'arte e curatore digitale.' },
    likes: [{ count: 31 }],
    created_at: '2026-01-28T09:15:00Z',
    content: '<p>L\'anti-design non è l\'assenza di design. È un design che rifiuta le aspettative, che trova bellezza laddove la convenzione vede difetto. In un\'epoca in cui ogni interfaccia sembra uscita dallo stesso template, l\'imperfezione diventa distinzione.</p><h2>L\'estetica del glitch</h2><p>Il glitch — l\'errore digitale, la distorsione — è diventato uno dei linguaggi visivi più potenti del nostro tempo. Artisti come Rosa Menkman e Daniel Temkin hanno trasformato i malfunzionamenti tecnologici in forme d\'arte, rivelando la fragilità dei sistemi che consideriamo infallibili.</p><p>Nel web design brutalista, il glitch non è un bug: è una feature. Le immagini distorte, i layout che "si rompono", i colori che vibrano creano un\'estetica che è al contempo inquietante e affascinante.</p><h2>Wabi-sabi digitale</h2><p>Il concetto giapponese di wabi-sabi — la bellezza dell\'impermanenza, dell\'incompletezza, dell\'imperfezione — trova un parallelo inaspettato nel brutalismo digitale. Entrambi rifiutano la perfezione come ideale, abbracciando invece la verità del materiale e del processo.</p><p>Un sito brutalista che mostra i bordi grezzi dei suoi elementi, che non nasconde le cuciture del suo codice, sta praticando una forma di wabi-sabi digitale.</p>',
  },
  'placeholder-4': {
    id: 'placeholder-4',
    title: 'Griglie rotte: sperimentazione nel layout web',
    excerpt: 'Come i designer brutalisti utilizzano griglie asimmetriche e sovrapposizioni.',
    cover_url: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?w=1200&h=600&fit=crop',
    tags: ['Composizione', 'Design System'],
    profiles: { username: 'anna_web', avatar_url: null, bio: 'Front-end developer e sperimentatrice visuale.' },
    likes: [{ count: 12 }],
    created_at: '2026-01-20T16:45:00Z',
    content: '<p>La griglia è stata per decenni il fondamento del design grafico e web. Dal sistema di griglie svizzero agli attuali framework CSS, l\'ordine è sempre stato sinonimo di buon design. Il brutalismo digitale mette in discussione questa equazione.</p><h2>Rompere per costruire</h2><p>I layout brutalisti non abbandonano la griglia — la decostruiscono. Gli elementi si sovrappongono, escono dai margini, cambiano posizione in modo imprevedibile. Ma questa apparente casualità è il risultato di scelte precise.</p><p>La griglia rotta crea tensione. L\'occhio dell\'utente non sa dove posarsi, è costretto a esplorare la pagina in modo attivo anziché seguire un percorso predeterminato.</p><h2>CSS Grid e la libertà compositiva</h2><p>Paradossalmente, le tecnologie moderne come CSS Grid e Subgrid rendono più facile che mai creare layout "rotti". La griglia diventa uno strumento di libertà anziché di costrizione, permettendo sovrapposizioni, allineamenti eccentrici e composizioni che sarebbero state impossibili con i layout a float del passato.</p><blockquote><p>"La griglia non è una prigione. È un punto di partenza per la ribellione."</p></blockquote>',
  },
  'placeholder-5': {
    id: 'placeholder-5',
    title: 'Il colore come provocazione',
    excerpt: 'Analisi dell\'uso del colore nel brutalismo digitale.',
    cover_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&h=600&fit=crop',
    tags: ['Estetica', 'Teoria e Tecnica'],
    profiles: { username: 'paolo_k', avatar_url: null, bio: 'Color theorist e visual designer.' },
    likes: [{ count: 27 }],
    created_at: '2026-01-15T11:00:00Z',
    content: '<p>Mentre il design contemporaneo mainstream si rifugia in palette neutre e tonalità pastello, il brutalismo digitale usa il colore come un\'arma. Gialli acidi, rossi saturi, verdi fluorescenti: i colori brutalisti non calmano, provocano.</p><h2>Contro l\'armonia cromatica</h2><p>Le teorie tradizionali del colore — complementari, analoghi, triadici — vengono deliberatamente violate. Le combinazioni brutaliste sono dissonanti, creano tensione visiva e rifiutano la piacevolezza come obiettivo.</p><p>Questo non significa che il colore brutalista sia casuale. Come nella musica atonale, la dissonanza è calcolata. Ogni accostamento cromatico è scelto per il suo impatto emotivo e comunicativo.</p><h2>Il nero come manifesto</h2><p>Il nero totale — background #000000, testo bianco — è forse la scelta cromatica brutalista più essenziale. Eliminando ogni sfumatura, ogni gradiente, si ottiene il massimo contrasto possibile. È una dichiarazione: qui non ci sono compromessi.</p><p>Ma il nero brutalista può anche essere interrotto da esplosioni di colore, flash di neon che creano un effetto quasi fisico sullo schermo, ricordando le installazioni luminose di Dan Flavin o James Turrell.</p>',
  },
  'placeholder-6': {
    id: 'placeholder-6',
    title: 'Interfacce oneste: etica del design brutale',
    excerpt: 'Il brutalismo digitale come risposta ai dark patterns.',
    cover_url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1200&h=600&fit=crop',
    tags: ['Design System', 'Ispirazione'],
    profiles: { username: 'elena_ux', avatar_url: null, bio: 'UX researcher con focus sull\'etica del design.' },
    likes: [{ count: 45 }],
    created_at: '2026-01-08T13:30:00Z',
    content: '<p>In un web popolato da dark patterns — interfacce progettate per manipolare l\'utente — il brutalismo digitale offre un\'alternativa radicale: l\'onestà. Un\'interfaccia brutalista non nasconde nulla, non inganna, non manipola.</p><h2>Trasparenza strutturale</h2><p>Come un edificio brutalista espone la sua struttura in cemento, un sito brutalista espone i meccanismi della sua interfaccia. I link sono evidenti, i pulsanti fanno ciò che dicono, la navigazione è esplicita. Non ci sono trick, non ci sono trappole.</p><p>Questa trasparenza non è solo estetica — è etica. In un momento in cui la fiducia degli utenti nei confronti delle piattaforme digitali è ai minimi storici, mostrare la struttura diventa un atto di rispetto.</p><h2>Contro i dark patterns</h2><p>I dark patterns prosperano nell\'ambiguità: pulsanti che sembrano link, opzioni preselezionate, percorsi di uscita nascosti. Il brutalismo digitale è il loro opposto naturale. Quando ogni elemento è esposto e riconoscibile, la manipolazione diventa impossibile.</p><blockquote><p>"Un\'interfaccia onesta è un\'interfaccia che non ha paura di mostrarsi per quello che è."</p></blockquote><p>Il brutalismo ci ricorda che il design ha una responsabilità. Non solo estetica, ma sociale. Progettare con onestà significa rispettare l\'intelligenza e l\'autonomia di chi usa i nostri prodotti.</p>',
  },
}

const sanitizedContent = computed(() => {
  return article.value?.content ? DOMPurify.sanitize(article.value.content) : ''
})

const isAuthor = computed(() => {
  return authStore.isAuthenticated && authStore.user?.id === article.value?.author_id
})

onMounted(async () => {
  await loadArticle()
})

const loadArticle = async () => {
  const articleId = route.params.id

  // Check if it's a placeholder article
  if (placeholderArticlesData[articleId]) {
    isPlaceholder.value = true
    article.value = placeholderArticlesData[articleId]
    likeCount.value = article.value.likes?.[0]?.count || 0
    document.title = `${article.value.title} — The Brutal`
    return
  }

  isPlaceholder.value = false

  try {
    const data = await articlesStore.fetchArticleById(articleId)
    article.value = data
    likeCount.value = data.likes?.[0]?.count || 0
    document.title = `${data.title} — The Brutal`

    if (authStore.isAuthenticated) {
      isLiked.value = await articlesStore.checkIfLiked(data.id, authStore.user.id)
    }
  } catch (err) {
    console.error('Load article error:', err)
  }
}

const toggleLike = async () => {
  if (isPlaceholder.value) return
  if (!authStore.isAuthenticated) {
    router.push('/auth')
    return
  }

  try {
    const result = await articlesStore.toggleLike(article.value.id, authStore.user.id)
    isLiked.value = result
    likeCount.value += result ? 1 : -1
  } catch (err) {
    console.error('Toggle like error:', err)
  }
}

const editArticle = () => {
  router.push(`/editor/${article.value.id}`)
}

const deleteArticle = async () => {
  if (!confirm('Sei sicuro di voler eliminare questo articolo?')) return

  try {
    await articlesStore.deleteArticle(article.value.id)
    router.push('/')
  } catch (err) {
    console.error('Delete article error:', err)
  }
}
</script>
