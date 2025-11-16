import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// App's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpyq69TDCQFNwldUhTzQTMsUZNQ2m-s0U",
  authDomain: "keshf-moody.firebaseapp.com",
  projectId: "keshf-moody",
  storageBucket: "keshf-moody.firebasestorage.app",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
