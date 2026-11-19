<img src="assets/icon.svg" width="64" height="64" alt="">

# Waktu Kontraksi

Timer kontraksi berbasis SvelteKit. Ketuk **Mulai Kontraksi** saat kontraksi mulai terasa, lalu **Selesai Kontraksi** saat berakhir. Jarak dihitung dari waktu mulai satu kontraksi ke waktu mulai kontraksi berikutnya.

Riwayat dan timer aktif disimpan di `localStorage` browser. Membuka ulang halaman di browser yang sama akan memulihkan keduanya selama data situs masih tersedia.

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
