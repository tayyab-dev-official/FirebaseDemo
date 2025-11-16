import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Read Vite env values directly so Vite can replace them at build/dev time.
// These keys must be prefixed with `VITE_` in your `.env`.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
}

// Helpful debug output when running the dev server.
console.log('firebaseConfig:', firebaseConfig)
console.log('import.meta.env sample:', import.meta.env)

if (!firebaseConfig.apiKey) {
  console.warn(
    'Firebase config values are empty — ensure you have a .env with VITE_FIREBASE_* keys and restart the Vite dev server.'
  )
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const provider = new GoogleAuthProvider()
