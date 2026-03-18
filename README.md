# The Brutal — The Brutalist

Piattaforma editoriale per il Post-Brutalismo digitale. Progetto d'esame — LABA Brescia, Progettazione Multimediale.

## Setup

```bash
npm install
cp .env.example .env.local   # configura le variabili VITE_FIREBASE_*
npm run dev                   # http://localhost:5173
```

## Firebase

1. Crea un progetto su [console.firebase.google.com](https://console.firebase.google.com)
2. Abilita Authentication (Email/Password, Google, GitHub)
3. Crea un database Firestore in modalità produzione o test
4. Abilita Firebase Storage e usa queste cartelle: `avatars`, `article-covers`, `article-images`
5. Compila `.env.local` con i valori del tuo progetto Firebase

## Build

```bash
npm run build     # produzione
npm run preview   # anteprima locale
```

## Tech Stack

Vue 3 · Pinia · Vue Router · Tiptap · Firebase · Tailwind CSS · Vite
