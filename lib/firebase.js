import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export async function saveQueryToFirestore(data) {
  if (!db) {
    console.error("Database belum siap.");
    return;
  }

  try {
    const safeData = Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = value === undefined ? null : value;
      return acc;
    }, {});

    await addDoc(collection(db, "deathify_logs"), {
      ...safeData,
      timestamp: Date.now(),
    });
    console.log("✅ Data berhasil disimpan ke deathify_logs");
  } catch (error) {
    console.error("❌ Gagal menyimpan log:", error);
  }
}

export { db, app };