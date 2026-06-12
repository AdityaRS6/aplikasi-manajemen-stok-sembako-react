# Aplikasi Manajemen Stok dan Penjualan Toko Sembako Berbasis Web Menggunakan React

Project ini dibuat untuk tugas kuliah dengan studi kasus UMKM Toko Sembako. Aplikasi membantu admin atau pemilik toko dalam mengelola data barang, transaksi penjualan, stok masuk, riwayat transaksi, laporan penjualan, dan profil toko.

## Akun Login

- Username: `admin`
- Password: `admin123`

## Fitur Utama

1. Login admin menggunakan akun statis.
2. Proteksi halaman utama jika pengguna belum login.
3. Dashboard ringkasan stok dan penjualan.
4. CRUD data barang sembako.
5. Pencarian barang berdasarkan nama atau kode.
6. Filter barang berdasarkan kategori.
7. Status stok: Aman, Stok Menipis, dan Habis.
8. Transaksi penjualan dengan keranjang sederhana.
9. Pengurangan stok otomatis saat transaksi disimpan.
10. Riwayat transaksi dan detail transaksi.
11. Pencatatan stok masuk dari supplier.
12. Penambahan stok otomatis saat stok masuk disimpan.
13. Laporan penjualan harian dan bulanan.
14. Tombol cetak laporan menggunakan fitur print browser.
15. Profil toko.
16. Penyimpanan data menggunakan LocalStorage.
17. Tampilan responsive untuk laptop, tablet, dan HP.

## Teknologi yang Digunakan

- React
- Vite
- React Router
- Context API
- HTML5
- CSS3
- JavaScript ES6+
- LocalStorage
- Responsive Web Design

## Struktur Folder

```bash
aplikasi-manajemen-stok-sembako-react/
├── index.html
├── package.json
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── components/
    │   ├── ActionButton.jsx
    │   ├── EmptyState.jsx
    │   ├── Layout.jsx
    │   ├── Navbar.jsx
    │   ├── ProtectedRoute.jsx
    │   ├── Sidebar.jsx
    │   └── StatCard.jsx
    ├── context/
    │   └── AppContext.jsx
    ├── data/
    │   └── initialProducts.js
    ├── pages/
    │   ├── Dashboard.jsx
    │   ├── Login.jsx
    │   ├── NotFound.jsx
    │   ├── ProductForm.jsx
    │   ├── Products.jsx
    │   ├── Profile.jsx
    │   ├── Reports.jsx
    │   ├── Sales.jsx
    │   ├── StockIn.jsx
    │   └── Transactions.jsx
    ├── styles/
    │   └── global.css
    └── utils/
        └── helpers.js
```

## Cara Menjalankan Project

1. Pastikan Node.js sudah terpasang di laptop.
2. Buka folder project di VS Code.
3. Buka terminal di folder project.
4. Jalankan perintah berikut:

```bash
npm install
npm run dev
```

5. Buka alamat lokal yang muncul di terminal, biasanya:

```bash
http://localhost:5173
```

## Cara Build Project

Untuk membuat versi produksi:

```bash
npm run build
```

Untuk melihat hasil build:

```bash
npm run preview
```

## Alur Penggunaan Aplikasi

1. Login menggunakan akun admin.
2. Masuk ke Dashboard untuk melihat ringkasan stok dan transaksi.
3. Buka Data Barang untuk menambah, mengedit, menghapus, mencari, dan memfilter barang.
4. Buka Transaksi Penjualan untuk mencatat penjualan.
5. Setelah transaksi disimpan, stok barang otomatis berkurang.
6. Buka Riwayat Transaksi untuk melihat transaksi yang sudah disimpan.
7. Buka Stok Masuk untuk mencatat barang masuk dari supplier.
8. Setelah stok masuk disimpan, stok barang otomatis bertambah.
9. Buka Laporan Penjualan untuk melihat laporan dan mencetak laporan.
10. Buka Profil Toko untuk melihat informasi UMKM.

## Saran Pengembangan Backend

Aplikasi ini masih menggunakan LocalStorage sehingga cocok untuk demo tugas kuliah atau prototype. Untuk pengembangan berikutnya, aplikasi dapat dikembangkan menggunakan:

1. Node.js dan Express.js sebagai backend REST API.
2. MySQL, PostgreSQL, atau MongoDB sebagai database.
3. JWT untuk autentikasi admin.
4. Endpoint API untuk data barang, transaksi, stok masuk, dan laporan.
5. Validasi server-side agar data lebih aman.
6. Fitur multi-user jika toko memiliki lebih dari satu admin.
7. Export laporan ke PDF atau Excel.
8. Upload gambar produk.
9. Barcode scanner untuk transaksi kasir.
10. Backup database otomatis.

## Catatan

Data aplikasi tersimpan di LocalStorage browser. Jika browser dibersihkan atau tombol Reset Data Demo ditekan di halaman Profil Toko, data dapat kembali ke data awal.
