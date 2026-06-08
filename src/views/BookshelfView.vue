<template>
    <div class="mx-auto w-full max-w-[90vw] pt-8">
    <div class="pb-4">
        <h1 class="flex items-center justify-center text-center text-primary uppercase">Bookshelf</h1>
        <p class="flex items-center justify-center text-center text-s uppercase text-primary/50">Libri tecnici, teorici, storici e pratici per capire la grafica</p>

    </div>
  </div>
  
  <main class="min-h-screen bg-secondary text-primary pt-12 pb-16">
    <div class="mx-auto w-[90vw]">
      <div class="grid gap-4 grid-cols-2 md:grid-cols-4">
      <BookLink
        v-for="(book, index) in books"
        :key="index"
        :title="book.title"
        :url="book.url"
        :index="index"
        :cover="book.cover"
      />
      </div>
    </div>
  </main>
</template>

<script setup>
import BookLink from '@/components/ui/BookLink.vue'

const books = [
  { title: 'La caffettiera del masochista',                     url: 'https://www.ibs.it/caffettiera-del-masochista-design-degli-libro-donald-a-norman/e/9788809986862', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F2.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'La filosofia del graphic design',                     url: 'https://www.ibs.it/filosofia-del-graphic-design-libro-vari/e/9788806252281', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F3.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'Manifesto alla carriera: Omaggio della grafica italiana', url: 'https://www.ibs.it/manifesto-alla-carriera-omaggio-della-libro-vari/e/9788892821170', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F4.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'Saggio sulla tipografia',                           url: 'https://www.ibs.it/saggio-sulla-tipografia-an-essay-libro-eric-gill/e/9788894911152', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F5.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'The History of Graphic Design Vol. 1',              url: 'https://www.ibs.it/the-history-of-graphic-design-libro-jens-muller/e/9783836588072', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F6.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'The History of Graphic Design Vol. 2',              url: 'https://www.ibs.it/the-history-of-graphic-design-libro-jens-muller/e/9783836570374', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F7.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'Thinking with Type',                                url: 'https://www.ibs.it/thinking-with-type-tipografia-progettazione-libro-ellen-lupton/e/9788885546646', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F8.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'Tipoteca, una storia italiana',                     url: 'https://www.ibs.it/tipoteca-storia-italiana-ediz-italiana-libro-vari/e/9788884350992', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F9.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'Grafika 80',                                        url: 'https://www.ibs.it/grafika-80-italian-new-wave-libro-matteo-torcinovich/e/9788899770211', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F10.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'Il mestiere di grafico',                            url: 'https://www.einaudi.it/catalogo-libri/arte-e-musica/arte/il-mestiere-di-grafico-albe-steiner-9788806103484/', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F11.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'La Bibbia del graphic design',                      url: 'https://giunti.it/products/la-bibbia-del-graphic-design-inglis-theo-9791281608528', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F12.webp?alt=media&token=79fe9ff3-649f-416c-b730-c126200dbfc2' },
  { title: 'Design e comunicazione visiva',                     url: 'https://www.ibs.it/design-comunicazione-visiva-contributo-a-libro-bruno-munari/e/9788858128787', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F13.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'Il canone Vignelli',                                url: 'https://www.ibs.it/canone-vignelli-ediz-illustrata-libro-massimo-vignelli/e/9788874900664', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F14.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'Grafica italiana dal 1945 a oggi',                  url: 'https://www.ibs.it/grafica-italiana-dal-1945-a-libro-carlo-vinti/e/9788809991910', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F15.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'La grafica italiana del novecento',                 url: 'https://www.ibs.it/grafica-italiana-dal-1945-a-ebook-carlo-vinti/e/9788809831193', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F16.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'Design for a Better World',                         url: 'https://aiap.it/prodotto/designing-for-better-world/', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F17.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: "La tirannia dell'alfabeto",                         url: 'https://aiap.it/prodotto/la-tirannia-dellalfabeto/', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F18.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'How Many Women Are in the Room',                    url: 'https://aiap.it/prodotto/how-many-women-are-in-the-room/', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F19.png?alt=media&token=a89be23d-448f-419a-8b33-f39b4ccd980e' },
  { title: 'Pino Tovaglia — Una storia lunga come',             url: 'https://aiap.it/prodotto/pino-tovaglia-una-storia-lunga-come/', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F20.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'Fortunato Depero and Depero Futurista, 1913–1927',  url: 'https://aiap.it/prodotto/fortunato-depero-and-depero-futurista-1913-1927/', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F21.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'Bob Noorda — Una vita nel segno della grafica',     url: 'https://aiap.it/prodotto/bob-noorda-una-vita-nel-segno-della-grafica/', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F22.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'Lampi di grafica',                                  url: 'https://aiap.it/prodotto/lampi-di-grafica/', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F23.png?alt=media&token=a35055d9-ae6a-4181-8561-b0de7c878e4b' },
  { title: '100 Poster',                                        url: 'https://aiap.it/prodotto/100-posters/', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F24.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: '100 Logos',                                         url: 'https://aiap.it/prodotto/100-logos/', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F25.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'Giochi di carattere',                               url: 'https://aiap.it/prodotto/giochi-di-carattere-2/', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F26.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'Millennials',                                       url: 'https://aiap.it/prodotto/millennials/', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F27.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'Calligrafando carte strappando',                    url: 'https://aiap.it/prodotto/calligrafando-carte-strappando/', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F28.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: 'Il mezzo secolo di Franco Balan',                   url: 'https://aiap.it/prodotto/il-mezzo-secolo-di-franco-balan/', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F29.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
  { title: "Comunicazione a misura d'uomo",                     url: 'https://aiap.it/prodotto/comunicazione-a-misura-duomo/', cover: 'https://firebasestorage.googleapis.com/v0/b/thebrutal-b5a44.firebasestorage.app/o/covers%2F30.jpg?alt=media&token=1c8b9e7c-9b3d-4f1e-8a6c-9c8e5b1a7f0e' },
]
</script>
