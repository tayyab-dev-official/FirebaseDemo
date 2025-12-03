// Dependecies
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
// ------------------------------------------------------
// Firebase Config (Vite)
// ------------------------------------------------------
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
}

if (!firebaseConfig.apiKey) {
    console.warn("⚠️ Missing Firebase environment variables. Check .env file.")
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

