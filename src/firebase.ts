import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// App's Firebase configuration loaded from environment (Vite `import.meta.env`)
// Read Vite env vars in a type-safe way by narrowing to unknown first,
// then converting to string with fallback. This avoids `any` lint errors.
const rawEnv = import.meta as unknown as Record<string, unknown> & {
  env?: Record<string, unknown>;
};
const getEnv = (key: string) => {
  const v = rawEnv.env?.[key];
  return typeof v === "string" ? v : "";
};

const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY"),
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET"),
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
