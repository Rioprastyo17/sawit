Tentu, ini adalah contoh `README.md` yang dibuat berdasarkan file-file yang Anda berikan:

# Proyek Website Kelapa Sawit

## Deskripsi

Proyek ini adalah aplikasi web yang dibangun dengan Next.js dan berfungsi sebagai alat bantu untuk petani atau pengusaha kelapa sawit. Aplikasi ini memiliki beberapa fitur utama, termasuk dasbor untuk memantau harga Tandan Buah Segar (TBS) kelapa sawit, serta pencatatan digital untuk kegiatan perkebunan.

-----

## Fitur Utama

  * **Pemantauan Harga TBS**: Aplikasi ini dilengkapi dengan *web scraper* otomatis yang mencari dan menyimpan harga TBS kelapa sawit terkini dari berbagai sumber berita.
  * **Pencatatan Digital**: Pengguna dapat membuat, melihat, dan mengelola catatan digital untuk berbagai aktivitas perkebunan seperti pemupukan, pemeliharaan, dan panen.
  * **Manajemen Pengguna**: Proyek ini mencakup sistem autentikasi dasar yang memungkinkan pengguna untuk mendaftar dan masuk.

-----

## Teknologi yang Digunakan

  * **Frontend**: Next.js, React, Recharts, Framer Motion
  * **Styling**: CSS Modules, Font Awesome
  * **Backend**: Next.js API Routes, Flask (untuk *web scraper*)
  * **Database**: SQLite dengan Prisma ORM
  * **Web Scraping**: Python dengan `requests`, `BeautifulSoup`, dan `newspaper3k`

-----

## Persyaratan

Pastikan Anda telah menginstal perangkat lunak berikut sebelum melanjutkan:

  * Node.js (versi 18 atau lebih tinggi)
  * npm atau yarn
  * Python (versi 3.8 atau lebih tinggi)
  * pip

-----

## Instalasi

1.  **Kloning Repositori**:

    ```bash
    git clone <URL_REPOSITORI_ANDA>
    cd <NAMA_DIREKTORI>
    ```

2.  **Instal Dependensi**:

    ```bash
    npm install
    ```

3.  **Siapkan Database**:
    Jalankan migrasi Prisma untuk membuat skema database.

    ```bash
    npx prisma migrate dev --name init
    ```

4.  **Siapkan Lingkungan Python**:
    Buat dan aktifkan lingkungan virtual.

    ```bash
    python -m venv .venv
    source .venv/bin/activate  # Untuk Linux/macOS
    .venv\Scripts\activate  # Untuk Windows
    ```

    Instal dependensi Python.

    ```bash
    pip install -r requirements.txt
    ```

-----

## Menjalankan Proyek

1.  **Jalankan Server API Python**:

    ```bash
    python api_server.py
    ```

    Server ini akan berjalan di `http://localhost:5000`.

2.  **Jalankan Aplikasi Next.js**:

    ```bash
    npm run dev
    ```

    Aplikasi Next.js akan berjalan di `http://localhost:3000`.

-----

## Struktur Proyek

```
/
├── api_server.py             # Server Flask untuk memicu scraper
├── scraper.py                # Skrip untuk web scraping harga TBS
├── prisma/
│   ├── dev.db                # Database SQLite
│   └── schema.prisma         # Skema database Prisma
├── public/                   # Aset statis
└── src/
    └── app/
        ├── (app)/            # Rute yang dilindungi autentikasi
        │   ├── catatan/       # Halaman manajemen catatan
        │   └── monitor/      # Halaman dasbor harga
        ├── api/                # Rute API Next.js
        └── layout.tsx          # Layout utama
```

-----

## API Endpoint

  * `POST /scrape`: Memulai proses *web scraping* untuk memperbarui harga TBS.
  * `GET, POST /api/notes`: Mengelola catatan digital (membuat dan mengambil data).
  * `GET /api/prices`: Mengambil data harga TBS dari database.

-----

## Skrip Tambahan

  * `scraper.py`: Skrip ini secara otomatis mencari berita terkait harga TBS kelapa sawit di Bing News, mengekstrak konten artikel, dan menyimpan harga yang ditemukan ke dalam database SQLite.

-----

## Skema Database

Skema database didefinisikan dalam `prisma/schema.prisma` dan mencakup model-model berikut:

  * **User**: Menyimpan informasi pengguna (email, kata sandi).
  * **Note**: Menyimpan catatan kegiatan perkebunan, dengan kategori dan status.
  * **PalmOilPrice**: Menyimpan data harga TBS harian beserta sumbernya.
