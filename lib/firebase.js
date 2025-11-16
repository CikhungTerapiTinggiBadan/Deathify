import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";

// Config dari snippet Anda
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Inisialisasi Aman (Singleton Pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

/**
 * Fungsi ini membersihkan data sebelum dikirim ke Firestore.
 * Mengubah 'undefined' menjadi 'null' untuk mencegah crash.
 */
export async function saveQueryToFirestore(data) {
  if (!db) {
    console.error("Database belum siap.");
    return;
  }

  try {
    // Sanitasi Data: Ubah undefined jadi null
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