# Randevu ve Reklamcılık Sistemi

Bu proje, psikologlar için bir randevu ve reklamcılık/blog sistemidir. Next.js, Express.js ve MongoDB kullanılarak geliştirilmiştir.

## Özellikler

### Genel Özellikler
- ✅ Modern ve responsive tasarım
- ✅ JWT tabanlı authentication
- ✅ Role-based authorization (Admin, Psikolog, Kullanıcı)
- ✅ MongoDB veritabanı
- ✅ RESTful API

### Psikolog Özellikleri
- Profil yönetimi (özgeçmiş, eğitim, deneyim)
- Fotoğraf yükleme
- Uzmanlık alanları
- Haftalık takvim/müsaitlik ayarları
- Seans ücret belirleme
- Rating/Değerlendirme sistemi

### Randevu Sistemi
- Online randevu alma
- Randevu durumu takibi (beklemede, onaylandı, tamamlandı, iptal)
- Online ve yüz yüze seans seçenekleri
- Email ve telefon ile iletişim

### Reklam/Blog Sistemi
- Blog yazıları ve duyurular
- Kategori sistemi (blog, haber, etkinlik, makale, duyuru)
- Öne çıkan içerikler
- Görüntülenme sayacı
- SEO meta bilgileri

### Admin Paneli
- Dashboard (istatistikler)
- Psikolog yönetimi
- Randevu yönetimi
- Reklam/Blog yönetimi
- Kullanıcı yönetimi

## Kurulum

### Gereksinimler
- Node.js 18+
- MongoDB (yerel veya cloud)

### Adımlar

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **Ortam değişkenlerini ayarlayın:**

`.env.local` dosyası oluşturun (`.env.example`'dan kopyalayabilirsiniz):

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/randevu-reklamcilik

# NextAuth / JWT
NEXTAUTH_SECRET=super-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

3. **MongoDB'yi başlatın:**
```bash
# Yerel MongoDB kullanıyorsanız
mongod
```

4. **Geliştirme sunucusunu başlatın:**
```bash
npm run dev
```

5. **Tarayıcıda açın:**
```
http://localhost:3000
```

## İlk Kurulum

### Admin Hesabı Oluşturma

1. Kayıt sayfasına gidin: `http://localhost:3000/register`
2. Admin bilgileriyle kayıt olun
3. MongoDB'de kullanıcının `role` alanını `admin` olarak güncelleyin:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

4. Admin paneline giriş yapın: `http://localhost:3000/admin`

## Proje Yapısı

```
example-project/
├── app/
│   ├── (routes)/          # Public routes
│   │   ├── home/          # Ana sayfa
│   │   ├── login/         # Giriş sayfası
│   │   ├── register/      # Kayıt sayfası
│   │   ├── psychologists/ # Psikolog listesi ve detay
│   │   └── contact/       # İletişim sayfası
│   ├── admin/             # Admin paneli
│   │   ├── psychologists/ # Psikolog yönetimi
│   │   ├── appointments/  # Randevu yönetimi
│   │   └── advertisements/# Reklam yönetimi
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication
│   │   ├── psychologists/ # Psikolog API
│   │   ├── appointments/  # Randevu API
│   │   └── advertisements/# Reklam API
│   └── css/               # Global stiller
├── components/            # React componentleri
│   ├── features/          # Feature componentleri
│   └── ui/                # UI componentleri
├── lib/                   # Utility fonksiyonları
│   ├── mongodb.js         # MongoDB bağlantısı
│   ├── auth.js            # Auth utilities
│   └── utils.js           # Genel utilities
├── middleware/            # Next.js middleware
├── models/                # MongoDB modelleri
│   ├── User.js
│   ├── Psychologist.js
│   ├── Appointment.js
│   └── Advertisement.js
└── public/                # Statik dosyalar
    ├── icons/
    └── images/
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Giriş yapma
- `POST /api/auth/logout` - Çıkış yapma
- `GET /api/auth/me` - Mevcut kullanıcı bilgisi

### Psychologists
- `GET /api/psychologists` - Tüm psikologları listele
- `GET /api/psychologists/:id` - Tek psikolog detayı
- `POST /api/psychologists` - Yeni psikolog oluştur (Admin)
- `PUT /api/psychologists/:id` - Psikolog güncelle (Admin/Owner)
- `DELETE /api/psychologists/:id` - Psikolog sil (Admin)

### Appointments
- `GET /api/appointments` - Randevuları listele
- `GET /api/appointments/:id` - Tek randevu detayı
- `POST /api/appointments` - Yeni randevu oluştur
- `PUT /api/appointments/:id` - Randevu güncelle
- `DELETE /api/appointments/:id` - Randevu sil (Admin)

### Advertisements
- `GET /api/advertisements` - Reklamları listele
- `GET /api/advertisements/:id` - Tek reklam detayı
- `POST /api/advertisements` - Yeni reklam oluştur (Admin)
- `PUT /api/advertisements/:id` - Reklam güncelle (Admin)
- `DELETE /api/advertisements/:id` - Reklam sil (Admin)

## Teknolojiler

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4
- **Backend:** Next.js API Routes, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcryptjs
- **Icons:** React Icons
- **Styling:** Tailwind CSS

## Geliştirme

```bash
# Geliştirme modu
npm run dev

# Production build
npm run build

# Production sunucusu
npm run start

# Linting
npm run lint
```

## Güvenlik

- Şifreler bcrypt ile hash'lenir
- JWT token'ları HttpOnly cookie'lerde saklanır
- API route'ları middleware ile korunur
- Role-based access control (RBAC)
- Input validation

## Lisans

MIT

## İletişim

Herhangi bir soru veya öneri için iletişime geçebilirsiniz.
