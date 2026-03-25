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
2. Registra una Web App nel progetto Firebase e copia i valori di configurazione
3. Crea `.env.local` da `.env.example` e inserisci i valori reali del progetto
4. Abilita Authentication (Email/Password, Google, GitHub)
5. Crea un database Firestore in modalità produzione o test

### Solo Firestore (senza Storage)

- L'app funziona anche senza Firebase Storage
- In questo caso upload avatar e immagini (copertina/editor) restano disabilitati

### GitHub Login (Firebase Auth)

1. In Firebase vai su Authentication > Sign-in method > GitHub
2. Prima crea una OAuth App in GitHub: Settings > Developer settings > OAuth Apps > New OAuth App
3. Imposta come Authorization callback URL:
	 - `https://<TUO_PROJECT_ID>.firebaseapp.com/__/auth/handler`
4. Copia Client ID e Client Secret in Firebase (provider GitHub)
5. Salva e abilita il provider GitHub
6. In Firebase Authentication > Settings > Authorized domains aggiungi il dominio di sviluppo se manca (es. `localhost`)

### Firestore Rules (base consigliata)

Usa regole minime per partire con utenti autenticati:

```txt
rules_version = '2';
service cloud.firestore {
	match /databases/{database}/documents {
		match /profiles/{userId} {
			allow read: if true;
			allow write: if request.auth != null && request.auth.uid == userId;
		}

		match /articles/{articleId} {
			allow read: if true;
			allow create: if request.auth != null;
			allow update, delete: if request.auth != null && request.auth.uid == resource.data.author_id;

			match /likes/{userId} {
				allow read: if true;
				allow write: if request.auth != null && request.auth.uid == userId;
			}
		}
	}
}
```

Dopo aver salvato `.env.local`, riavvia il server dev (`npm run dev`).

## Build

```bash
npm run build     # produzione
npm run preview   # anteprima locale
```

## Tech Stack

Vue 3 · Pinia · Vue Router · Tiptap · Firebase · Tailwind CSS · Vite