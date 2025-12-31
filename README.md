# 💀 Deathify - Analisis Harapan Hidup Berbasis Statistik

Deathify adalah aplikasi web interaktif yang menghitung estimasi sisa waktu hidup seseorang berdasarkan data statistik demografi negara dan berbagai variabel gaya hidup pengguna. Proyek ini menggunakan integrasi database untuk menyajikan data harapan hidup yang akurat berdasarkan lokasi geografis.

![Dashboard Preview](dead1.png)

## 🚀 Fitur Utama

* **Identitas & Demografi:** Input data nama, usia, jenis kelamin, dan lokasi negara (Case Sensitive) sebagai basis data angka harapan hidup.
* **Variabel Gaya Hidup:** Faktor risiko yang dapat disesuaikan, seperti kebiasaan merokok, intensitas berkendara, hingga status hubungan.
* **Dashboard Hasil Analisis:**
    * **Estimasi Sisa Waktu:** Menampilkan prediksi sisa tahun hidup dalam angka yang besar.
    * **Detail Statistik & Risiko:** Penjelasan mendalam mengenai dampak setiap variabel, seperti persentase risiko kematian akibat rokok atau kecelakaan jalan raya.
    * **Peta Geo-Statistik:** Visualisasi lokasi pengguna secara real-time pada peta dunia.
* **Database Integrated:** Mengambil data spesifik negara (Rata-rata usia kematian, risiko penyakit, dll) langsung dari koleksi database.
* **Re-Roll:** Anda tidak puas dengan sisa umur anda? terlalu sedikit? Re-Roll saja dan good luck.

## 🛠 Tech Stack

* **Frontend:** HTML5, CSS3 (Glassmorphism UI), JavaScript.
* **Styling:** Tailwind CSS.
* **Database:** Google Firebase / Firestore.
* **Maps API:** OpenStreetMap / Leaflet.

## ⚙️ Cara Menjalankan Secara Lokal
Jika anda ingin menjalankan website ini secara lokal, atau membuat website yang mirip dengan ini, begini caranya:

### 1. Persiapan Database
Aplikasi ini membutuhkan database (Firestore) / MongoDB dengan struktur data tertentu agar dapat berfungsi. Menggunakan Firebase, ikuti langkah berikut:

1.  Buat project baru di **Google Firebase Console**.
2.  Aktifkan **Firestore Database**.
3.  Buat koleksi (collection) utama bernama `countries`.
4.  Cari data nilai kematian untuk setiap negara / hanya negara yang ingin kamu include. (bisa menggunakan WHO atau IHME)
5.  Tambahkan dokumen untuk setiap negara (contoh: `American Samoa`) dengan struktur field sebagai berikut:
    * `DeathAge`: (string) e.g., "72 years"
    * `DeathM` / `DeathF`: (string) Rata-rata kematian pria/wanita.
    * `DeathSmoke` / `DeathRoad` / `DeathAIDS_Pct`: (string) Persentase risiko kematian.
    * `AvgAge_Smoke` / `AvgAge_Road` / `AvgAge_AIDS`: (string) Rata-rata usia kematian pada kasus terkait.
    * `Lat` / `Lon`: (number) Koordinat geografis negara.

> **Catatan:** Pastikan penamaan field sesuai dengan screenshot struktur database yang disediakan di folder dokumen teknis agar aplikasi dapat memetakan data dengan benar.

### 2. Instalasi & Jalankan
1.  **Clone repositori ini:**
    ```bash
    git clone [https://github.com/username/deathify.git](https://github.com/username/deathify.git)
    cd deathify
    ```
2.  **Konfigurasi API:**
    Buka file konfigurasi database Anda (misal `firebase-config.js`) dan masukkan kredensial project Firebase yang telah Anda buat.
3.  **Jalankan aplikasi:**
    * Gunakan ekstensi **Live Server** di VS Code (klik kanan pada `index.html` > *Open with Live Server*).
    * Aplikasi akan berjalan di `http://127.0.0.1:5500`.

## 📋 Penggunaan
1.  Masukkan nama dan usia Anda.
2.  Masukkan nama negara sesuai dengan yang ada di database (contoh: **Indonesia** atau **American Samoa**).
3.  Pilih gaya hidup Anda pada kolom yang tersedia.
4.  Klik **"Mulai Analisis"** untuk melihat hasil kalkulasi statistik.

---
*Disclaimer: Aplikasi ini menggunakan perhitungan berdasarkan rata-rata statistik global untuk tujuan edukasi dan hiburan, bukan merupakan ramalan medis atau kepastian sisa umur seseorang.*
