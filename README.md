<img src="assets/logo.png" width="64" height="64" alt="">

# Waktu Kontraksi

Timer kontraksi persalinan berbasis SvelteKit. Ketuk **Mulai Kontraksi** saat kontraksi mulai terasa, lalu **Selesai Kontraksi** saat berakhir. Jarak dihitung dari waktu mulai satu kontraksi ke waktu mulai kontraksi berikutnya.

Riwayat dan timer aktif disimpan di `localStorage` browser. Membuka ulang halaman di browser yang sama akan memulihkan keduanya selama data situs masih tersedia.

Bahasa Indonesia adalah bahasa bawaan di `/` dan versi bahasa Inggris tersedia di `/en`. Ketuk **EN** di bagian atas untuk beralih ke bahasa Inggris, atau **ID** untuk kembali. Pilihan bahasa diingat di browser ini.

## Menjalankan di komputer

```sh
npm ci
npm run dev
```

Untuk memeriksa tipe dan membuat keluaran statis di `build/`:

```sh
npm run check
npm run build
```

## Konfigurasi URL produksi & SEO

URL kanonis untuk tag Open Graph (`og:image`, `og:url`), `canonical`, `hreflang`, `sitemap.xml`, `robots.txt`, `llms.txt`, dan `/.well-known/ard.json` dapat diatur melalui variabel lingkungan `PUBLIC_SITE_URL` saat build (bawaan: `https://waktu-kontraksi.pages.dev`):

```sh
PUBLIC_SITE_URL=https://domain-anda.com npm run build
```

Untuk membuat ulang gambar Open Graph (`static/og-image.png`, `static/og-image-en.png`) dan ikon aplikasi:

```sh
npm run og:generate
```
