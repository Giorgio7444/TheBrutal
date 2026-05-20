import { initializeApp, getApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, initializeFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBRgb5BQLkco0d0kseS_QBemAi8hXMXJEY",
  authDomain: "thebrutal-b5a44.firebaseapp.com",
  projectId: "thebrutal-b5a44",
  storageBucket: "thebrutal-b5a44.firebasestorage.app",
  messagingSenderId: "327739332865",
  appId: "1:327739332865:web:66dd7a9f6f5b13accb6300"
}

const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'messagingSenderId', 'appId']
const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key])

if (missingKeys.length > 0) {
  console.warn(`[firebase] Missing config values: ${missingKeys.join(', ')}. Check .env.local`)
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

const firestoreForceLongPolling = import.meta.env.VITE_FIRESTORE_FORCE_LONG_POLLING === 'true'
const firestoreAutoDetectLongPolling = import.meta.env.VITE_FIRESTORE_AUTO_DETECT_LONG_POLLING !== 'false'
const firestoreUseFetchStreams = import.meta.env.VITE_FIRESTORE_USE_FETCH_STREAMS !== 'false'

let db
try {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: firestoreForceLongPolling,
    experimentalAutoDetectLongPolling: firestoreAutoDetectLongPolling,
    useFetchStreams: firestoreUseFetchStreams,
  })
} catch {
  db = getFirestore(app)
}

export const auth = getAuth(app)
export { db }
export const isStorageEnabled = Boolean(firebaseConfig.storageBucket)
export const storage = isStorageEnabled ? getStorage(app) : null
