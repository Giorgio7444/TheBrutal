<template>
    <div class="mx-auto w-full max-w-[90vw] pt-8">
    <div class="pb-4">
        <h1 class="flex items-center justify-center text-center text-primary uppercase">Bookshelf</h1>
        <p class="flex items-center justify-center text-center text-s uppercase text-primary/50">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>

    </div>
  </div>
  
  <main class="min-h-screen bg-secondary text-primary pt-12 pb-16">
    <div class="mx-auto w-[90vw]">
      <div class="grid grid-cols-4 gap-4">
        <BookLink
          v-for="(book, index) in books"
          :key="index"
          :title="book.title"
          :url="book.url"
          :index="index"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import BookLink from '@/components/ui/BookLink.vue'

const books = [
  { title: 'Web Usability',                                     url: 'https://www.ibs.it/web-usability-20-usabilita-che-libro-jakob-nielsen-hoa-loranger/e/9788850329625' },
  { title: 'La caffettiera del masochista',                     url: 'https://www.ibs.it/caffettiera-del-masochista-design-degli-libro-donald-a-norman/e/9788809986862' },
  { title: 'Guardare, pensare, progettare',                     url: 'https://www.ibs.it/filosofia-del-graphic-design-libro-vari/e/9788806252281' },
  { title: 'Il progetto grafico delle riviste',                 url: 'https://www.ibs.it/libri/autori/william-owen' },
  { title: 'Manifesto alla carriera: Omaggio della grafica italiana', url: 'https://www.ibs.it/manifesto-alla-carriera-omaggio-della-libro-vari/e/9788892821170' },
  { title: 'Saggio sulla tipografia',                           url: 'https://www.ibs.it/saggio-sulla-tipografia-an-essay-libro-eric-gill/e/9788894911152' },
  { title: 'The History of Graphic Design Vol. 1',              url: 'https://www.ibs.it/the-history-of-graphic-design-libro-jens-muller/e/9783836588072' },
  { title: 'The History of Graphic Design Vol. 2',              url: 'https://www.ibs.it/the-history-of-graphic-design-libro-jens-muller/e/9783836570374' },
  { title: 'Thinking with Type',                                url: 'https://www.ibs.it/thinking-with-type-tipografia-progettazione-libro-ellen-lupton/e/9788885546646' },
  { title: 'Tipoteca, una storia italiana',                     url: 'https://www.ibs.it/tipoteca-storia-italiana-ediz-italiana-libro-vari/e/9788884350992' },
  { title: 'Grafika 80',                                        url: 'https://www.ibs.it/grafika-80-italian-new-wave-libro-matteo-torcinovich/e/9788899770211' },
  { title: 'Il mestiere di grafico',                            url: 'https://www.einaudi.it/catalogo-libri/arte-e-musica/arte/il-mestiere-di-grafico-albe-steiner-9788806103484/' },
  { title: 'La Bibbia del graphic design',                      url: 'https://giunti.it/products/la-bibbia-del-graphic-design-inglis-theo-9791281608528' },
  { title: 'Storia del design grafico',                         url: 'https://www.ibs.it/storia-design-grafico' },
  { title: 'Manuale di storia del design',                      url: 'https://www.ibs.it/manuale-storia-del-design' },
  { title: 'Design e comunicazione visiva',                     url: 'https://www.ibs.it/design-comunicazione-visiva-contributo-a-libro-bruno-munari/e/9788858128787' },
  { title: 'Il canone Vignelli',                                url: 'https://www.ibs.it/canone-vignelli-ediz-illustrata-libro-massimo-vignelli/e/9788874900664' },
  { title: 'Grafica italiana dal 1945 a oggi',                  url: 'https://www.ibs.it/grafica-italiana-dal-1945-a-libro-carlo-vinti/e/9788809991910' },
  { title: 'La grafica italiana del novecento',                 url: 'https://www.ibs.it/grafica-italiana-dal-1945-a-ebook-carlo-vinti/e/9788809831193' },
  { title: 'Design for a Better World',                         url: 'https://aiap.it/prodotto/designing-for-better-world/' },
  { title: 'Libri quotidiani',                                  url: 'https://aiap.it/prodotto/libri-quotidiani/' },
  { title: "La tirannia dell'alfabeto",                         url: 'https://aiap.it/prodotto/la-tirannia-dellalfabeto/' },
  { title: 'How Many Women Are in the Room',                    url: 'https://aiap.it/prodotto/how-many-women-are-in-the-room/' },
  { title: 'Image 20/30',                                       url: 'https://aiap.it/prodotto/image-20-30/' },
  { title: 'Pino Tovaglia — Una storia lunga come',             url: 'https://aiap.it/prodotto/pino-tovaglia-una-storia-lunga-come/' },
  { title: 'Fortunato Depero and Depero Futurista, 1913–1927',  url: 'https://aiap.it/prodotto/fortunato-depero-and-depero-futurista-1913-1927/' },
  { title: 'Bob Noorda — Una vita nel segno della grafica',     url: 'https://aiap.it/prodotto/bob-noorda-una-vita-nel-segno-della-grafica/' },
  { title: 'Lampi di grafica',                                  url: 'https://aiap.it/prodotto/lampi-di-grafica/' },
  { title: '100 Poster',                                        url: 'https://aiap.it/prodotto/100-posters/' },
  { title: '100 Logos',                                         url: 'https://aiap.it/prodotto/100-logos/' },
  { title: 'Giochi di carattere',                               url: 'https://aiap.it/prodotto/giochi-di-carattere-2/' },
  { title: 'Millennials',                                       url: 'https://aiap.it/prodotto/millennials/' },
  { title: 'Calligrafando carte strappando',                    url: 'https://aiap.it/prodotto/calligrafando-carte-strappando/' },
  { title: 'Il mezzo secolo di Franco Balan',                   url: 'https://aiap.it/prodotto/il-mezzo-secolo-di-franco-balan/' },
  { title: "Comunicazione a misura d'uomo",                     url: 'https://aiap.it/prodotto/comunicazione-a-misura-duomo/' },
]
</script>
