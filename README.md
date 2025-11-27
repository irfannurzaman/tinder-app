## Tinder-like App (Mobile + Backend)

Monorepo ini berisi:

- **tinder-mobile**: Aplikasi mobile Tinder-like (Expo + React Native + TypeScript)
- **BE**: Backend API Laravel 11 (PHP 8.2+) dengan SQLite/MySQL/PostgreSQL

---

## 1. Teknologi Utama

- **Mobile (tinder-mobile)**

  - Expo SDK 54, React Native, TypeScript
  - React Navigation (Native Stack + Bottom Tabs)
  - React Query (@tanstack/react-query)
  - AsyncStorage (device ID)
  - Atomic-ish component structure (atoms / molecules / organisms)

- **Backend (BE)**
  - Laravel 11, PHP 8.2+
  - Eloquent ORM
  - Scheduler (cronjob) + Artisan Command
  - Mail (notifikasi admin ketika likes ≥ 50)
  - L5-Swagger (dokumentasi API)

---

## 2. Struktur Folder

```text
.
├─ BE/                  # Laravel backend
│  ├─ app/
│  ├─ config/
│  ├─ database/
│  ├─ routes/
│  └─ ...
└─ tinder-mobile/       # Expo React Native app
   ├─ app/
   ├─ components/
   ├─ hooks/
   ├─ pages/
   ├─ services/
   └─ store/
```

---

## 3. Setup Backend (Laravel 11)

Masuk ke folder backend:

```bash
cd BE
```

### 3.1. Install Dependency

```bash
php composer.phar install
```

### 3.2. Konfigurasi `.env`

```bash
cp .env.example .env
php artisan key:generate
```

Atur koneksi database di `.env`, contoh (SQLite):

```env
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/ke/database.sqlite
```

Atau MySQL/PostgreSQL sesuai kebutuhan.

### 3.3. Migrasi & Seeder

```bash
php artisan migrate
php artisan db:seed
```

Seeder akan membuat beberapa `Person` dan `Picture` dummy.

### 3.4. Jalankan Server Backend

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

Pastikan IP/backend URL sama dengan yang dipakai di mobile (`services/api.ts`).

---

## 4. Endpoint API Utama

Prefix: `/api`

- `GET /api/people`

  - Query: `page`, `limit`
  - Header: `X-Device-ID` (di-set otomatis oleh mobile)
  - Response (paginated) daftar `Person` + `pictures`

- `POST /api/people/{id}/like`

  - Header: `X-Device-ID`
  - Body: kosong
  - Response: `{ success, message, match, like_count }`

- `POST /api/people/{id}/dislike`

  - Header: `X-Device-ID`

- `GET /api/people/liked`
  - Header: `X-Device-ID`
  - Query: `page`, `limit`
  - Response: daftar orang yang di-like oleh device tersebut

---

## 5. Cronjob: High Likes Notification

Command: `people:check-high-likes`

```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule): void
{
    $schedule->command('people:check-high-likes')->daily()->at('09:00');
}
```

Logika:

- Cari `Person` dengan `like_count >= 50` (`PersonService::getPeopleWithHighLikes`)
- Kirim email ke admin (`admin@example.com` atau `config('mail.admin_email')`)

Jalankan scheduler Laravel di server:

```bash
* * * * * php /path/to/artisan schedule:run >> /dev/null 2>&1
```

---

## 6. Setup Mobile (tinder-mobile)

Masuk ke folder mobile:

```bash
cd tinder-mobile
```

### 6.1. Install Dependency

```bash
npm install
```

Pastikan versi Node mengikuti rekomendasi Expo (lihat dokumentasi Expo SDK 54).

### 6.2. Konfigurasi API URL

File: `tinder-mobile/services/api.ts`

```ts
const API_BASE_URL = "http://192.168.1.17:8000/api";
```

Ganti `192.168.x.x` dengan IP lokal mesin backend yang bisa diakses dari device/emulator.

### 6.3. Jalankan App

```bash
npx expo start
```

Scan QR di Expo Go (Android/iOS) atau jalankan emulator.

---

## 7. Fitur Mobile

- **Splash → Main Tabs**

  - `SplashScreen` menunggu sebentar lalu menuju `MainTabs` (Bottom Tabs)

- **Home Tab**

  - Swipe deck Tinder-style (`SwipeDeck`)
    - Top card bisa di-swipe left/right (dislike/like)
    - Badge `LIKE` / `NOPE` muncul saat swipe
    - Action buttons sinkron dengan gesture
  - Pagination: fetch people per page dengan React Query Infinite Query

- **Liked Tab**

  - Menampilkan list orang yang sudah di-like (API: `GET /people/liked`)
  - Menggunakan `useLikedPeople` (`useInfiniteQuery`) + `FlatList` grid 2 kolom

- **State & Data**
  - React Query untuk fetch & cache
  - Device ID disimpan di `AsyncStorage` dan dikirim via header `X-Device-ID`

---

## 8. Catatan Pengembangan

- Jika mengubah struktur API di backend:

  - Sesuaikan mapping di `tinder-mobile/services/api.ts`
  - Perhatikan shape response (`data`, `page`, `limit`, `total`, `hasMore`)

- Jika swipe terasa glitch:
  - Logika swipe deck ada di `components/organisms/SwipeDeck/SwipeDeck.tsx`
  - Menggunakan kombinasi `useRef` + `useState` untuk menghindari flash card

---

## 9. Demo GIF

- **Preview aplikasi (GIF)**

  ![Demo aplikasi](demo.gif)

  - File GIF: `demo.gif` (di root project)
  - Berisi demo alur utama aplikasi (swipe, like/dislike, dan navigasi tab).

---

## 10. Perintah Penting

### Backend

```bash
# Jalankan server
php artisan serve

# Jalankan scheduler secara manual
php artisan schedule:run

# Jalankan cronjob high likes langsung
php artisan people:check-high-likes --threshold=50
```

### Mobile

```bash
npx expo start        # dev server
npx expo start -c     # clear cache
```

---

Jika ingin menambah fitur baru (mis. chat, profile), disarankan:

- Tambah endpoint di Laravel (controller + service + routes)
- Tambah hook React Query (`useXxx`) di `hooks/usePeople.ts` atau file hooks baru
- Gunakan pola yang sama dengan `usePeople` / `useLikedPeople`.
