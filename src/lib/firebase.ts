import { getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase Web config. These values are not secrets (they're public by
// design — security comes from Firestore/Storage rules), but we still
// allow overriding via env vars if you ever want a separate Firebase
// project for staging.
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyBBdK1o7LISQdi3_S0bMnDQJTCNIS9KTpU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "vivora-7ac32.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "vivora-7ac32",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "vivora-7ac32.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "524556003046",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:524556003046:web:1c67dd90a609c4f4393d27",
};

// Guard against re-initializing on hot reload / multiple imports.
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
