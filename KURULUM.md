
## İlk Admin Hesabı Oluşturma

### Yöntem 1: Otomatik Kurulum Scripti (ÖNERİLEN)

En kolay yöntem! Tek admin kullanıcısı otomatik oluşturulur:

node scripts/seed-data.js

## Sistem Kullanımı

### Psikolog Kaydı

Psikologlar kendileri sistemden kayıt olabilir:

1. http://localhost:3000/register adresine gidin
2. "Psikolog olarak kayıt ol" seçeneğini işaretleyin
3. Formu doldurun (ad, email, şifre, telefon)
4. Kayıt olduktan sonra giriş yapın
5. Dashboard'dan profil bilgilerinizi tamamlayın

**Not:** Psikolog hesapları otomatik olarak onay beklemede (isApproved: false) oluşturulur. Admin panelinden onaylanması gerekir.

### Reklam/İçerik Yönetimi

Reklamlar sadece admin tarafından yönetilebilir:

1. Admin olarak giriş yapın (admin@example.com / admin123)
2. http://localhost:3000/admin/advertisements adresine gidin
3. "Yeni Reklam Ekle" butonuna tıklayın
4. Form doldurarak reklam oluşturun

#### API ile Reklam Ekleme:

```bash
POST /api/advertisements
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "Psikolojik Sağlığınızı Önemseyin",
  "slug": "psikolojik-sagliginizi-onemseyin",
  "content": "Psikolojik sağlık, genel sağlığımızın önemli bir parçasıdır...",
  "excerpt": "Kısa özet...",
  "category": "blog",
  "status": "published",
  "featured": true,
  "tags": ["sağlık", "psikoloji"]
}
```

## Yaygın Sorunlar ve Çözümleri

### MongoDB Bağlanamıyor

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Çözüm:** MongoDB'nin çalıştığından emin olun:
```bash
mongod
```

### Port Kullanımda

```
Error: Port 3000 is already in use
```

**Çözüm:** Farklı bir port kullanın:
```bash
PORT=3001 npm run dev
```

### JWT Secret Hatası

```
Error: NEXTAUTH_SECRET is not defined
```

**Çözüm:** `.env.local` dosyasında NEXTAUTH_SECRET tanımlayın

### CSS Yüklenmiyor

**Çözüm:** Tailwind CSS'in düzgün kurulduğundan emin olun:
```bash
npm install -D @tailwindcss/postcss tailwindcss
```

## Üretim (Production) Kurulumu

### 1. Build Oluşturun

```bash
npm run build
```

### 2. Üretim Sunucusunu Başlatın

```bash
npm run start
```

### 3. PM2 ile Çalıştırın (Önerilen)

```bash
npm install -g pm2
pm2 start npm --name "randevu-app" -- start
pm2 save
pm2 startup
```

### 4. Nginx ile Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Vercel'e Deploy

1. Projeyi GitHub'a yükleyin
2. Vercel'e gidin: https://vercel.com
3. "Import Project" tıklayın
4. GitHub repo'nuzu seçin
5. Ortam değişkenlerini ekleyin:
   - MONGODB_URI
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL
6. Deploy edin!

## Güvenlik Kontrol Listesi

- [ ] `.env.local` dosyası `.gitignore`'da
- [ ] Üretimde güçlü NEXTAUTH_SECRET kullanın
- [ ] MongoDB Atlas kullanıyorsanız IP whitelist ayarlayın
- [ ] HTTPS kullanın (Let's Encrypt veya Cloudflare)
- [ ] Rate limiting ekleyin
- [ ] CORS politikalarını ayarlayın
- [ ] Input validation yapın
- [ ] XSS ve CSRF koruması ekleyin

## Destek

Sorularınız için:
- GitHub Issues
- Email: destek@example.com

## Lisans

MIT

