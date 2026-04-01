import { initializeApp, getApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, initializeFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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
