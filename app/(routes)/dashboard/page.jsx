'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
 const router = useRouter();
 const [user, setUser] = useState(null);
 const [profile, setProfile] = useState(null);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');

 useEffect(() => {
  fetchUserAndProfile();
 }, []);

 const fetchUserAndProfile = async () => {
  try {
   // Kullanıcı bilgilerini al
   const userRes = await fetch('/api/auth/me');
   if (!userRes.ok) {
    router.push('/login');
    return;
   }
   const userData = await userRes.json();

   // Psikolog değilse ana sayfaya yönlendir
   if (userData.user.role !== 'psychologist') {
    router.push('/');
    return;
   }

   setUser(userData.user);

   // Psikolog profilini al
   const profileRes = await fetch('/api/psychologists');
   const profileData = await profileRes.json();

   // Kullanıcının kendi profilini bul
   const myProfile = profileData.psychologists.find(
    p => p.email === userData.user.email
   );

   if (myProfile) {
    setProfile(myProfile);
   }
  } catch (error) {
   console.error('Error:', error);
   setError('Profil yüklenirken hata oluştu');
  } finally {
   setLoading(false);
  }
 };

 const handleUpdateProfile = async (e) => {
  e.preventDefault();
  setSaving(true);
  setError('');
  setSuccess('');

  try {
   const response = await fetch(`/api/psychologists/${profile._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
   });

   if (response.ok) {
    setSuccess('Profiliniz başarıyla güncellendi!');
    setTimeout(() => setSuccess(''), 3000);
   } else {
    setError('Profil güncellenirken hata oluştu');
   }
  } catch (error) {
   console.error('Update error:', error);
   setError('Bir hata oluştu');
  } finally {
   setSaving(false);
  }
 };

 const handleArrayInput = (field, value) => {
  const array = value.split(',').map(item => item.trim()).filter(item => item);
  setProfile({ ...profile, [field]: array });
 };

 if (loading) {
  return (
   <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
   </div>
  );
 }

 if (!profile) {
  return (
   <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
     <h1 className="text-2xl font-bold text-red-600 mb-4">Profil Bulunamadı</h1>
     <p className="text-gray-600">Lütfen tekrar kayıt olmayı deneyin.</p>
    </div>
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 pt-32 pb-12 px-4">
   <div className="max-w-4xl mx-auto">
    {/* Header */}
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
     <div className="flex items-center justify-between">
      <div>
       <h1 className="text-3xl font-bold text-gray-800">Psikolog Paneli</h1>
       <p className="text-gray-600 mt-2">Hoş geldiniz, {user?.name}</p>
      </div>
      <button
       onClick={() => router.push('/')}
       className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
      >
       Ana Sayfa
      </button>
     </div>
    </div>

    {/* Bildirimler */}
    {error && (
     <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
      {error}
     </div>
    )}
    {success && (
     <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6">
      {success}
     </div>
    )}

    {/* Profil Formu */}
    <form onSubmit={handleUpdateProfile} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
     <h2 className="text-2xl font-bold text-gray-800 mb-6">Profil Bilgileriniz</h2>

     {/* Temel Bilgiler */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
       <label className="block text-sm font-semibold text-gray-700 mb-2">
        Ad Soyad *
       </label>
       <input
        type="text"
        value={profile.name || ''}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
        required
       />
      </div>

      <div>
       <label className="block text-sm font-semibold text-gray-700 mb-2">
        Email *
       </label>
       <input
        type="email"
        value={profile.email || ''}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
        required
       />
      </div>

      <div>
       <label className="block text-sm font-semibold text-gray-700 mb-2">
        Telefon *
       </label>
       <input
        type="tel"
        value={profile.phone || ''}
        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
        required
       />
      </div>

      <div>
       <label className="block text-sm font-semibold text-gray-700 mb-2">
        Seans Ücreti (₺) *
       </label>
       <input
        type="number"
        value={profile.sessionFee || ''}
        onChange={(e) => setProfile({ ...profile, sessionFee: Number(e.target.value) })}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
        required
       />
      </div>
     </div>

     {/* Uzmanlık Alanları */}
     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Uzmanlık Alanları (virgülle ayırın)
      </label>
      <input
       type="text"
       value={profile.specialties?.join(', ') || ''}
       onChange={(e) => handleArrayInput('specialties', e.target.value)}
       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
       placeholder="Anksiyete, Depresyon, Travma"
      />
     </div>

     {/* Hakkında */}
     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Hakkınızda
      </label>
      <textarea
       value={profile.about || ''}
       onChange={(e) => setProfile({ ...profile, about: e.target.value })}
       rows={4}
       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none resize-none"
       placeholder="Kendinizden bahsedin..."
      />
     </div>

     {/* Eğitim */}
     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Eğitim (virgülle ayırın)
      </label>
      <input
       type="text"
       value={profile.education?.join(', ') || ''}
       onChange={(e) => handleArrayInput('education', e.target.value)}
       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
       placeholder="İstanbul Üniversitesi Psikoloji Bölümü"
      />
     </div>

     {/* Deneyim */}
     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Deneyim (virgülle ayırın)
      </label>
      <input
       type="text"
       value={profile.experience?.join(', ') || ''}
       onChange={(e) => handleArrayInput('experience', e.target.value)}
       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
       placeholder="10 yıl klinik deneyim"
      />
     </div>

     {/* Çalışma Günleri */}
     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Çalışma Günleri (virgülle ayırın)
      </label>
      <input
       type="text"
       value={profile.availableDays?.join(', ') || ''}
       onChange={(e) => handleArrayInput('availableDays', e.target.value)}
       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
       placeholder="Pazartesi, Salı, Çarşamba"
      />
     </div>

     {/* Çalışma Saatleri */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
       <label className="block text-sm font-semibold text-gray-700 mb-2">
        Başlangıç Saati
       </label>
       <input
        type="time"
        value={profile.availableHours?.start || '09:00'}
        onChange={(e) => setProfile({
         ...profile,
         availableHours: { ...profile.availableHours, start: e.target.value }
        })}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
       />
      </div>

      <div>
       <label className="block text-sm font-semibold text-gray-700 mb-2">
        Bitiş Saati
       </label>
       <input
        type="time"
        value={profile.availableHours?.end || '17:00'}
        onChange={(e) => setProfile({
         ...profile,
         availableHours: { ...profile.availableHours, end: e.target.value }
        })}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
       />
      </div>
     </div>

     {/* Profil Resmi URL */}
     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Profil Resmi URL (opsiyonel)
      </label>
      <input
       type="url"
       value={profile.image || ''}
       onChange={(e) => setProfile({ ...profile, image: e.target.value })}
       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
       placeholder="https://example.com/profil.jpg"
      />
     </div>

     {/* Kaydet Butonu */}
     <div className="pt-6 border-t">
      <button
       type="submit"
       disabled={saving}
       className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
      >
       {saving ? (
        <span className="flex items-center justify-center gap-2">
         <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
         </svg>
         Kaydediliyor...
        </span>
       ) : 'Profili Güncelle'}
      </button>
     </div>
    </form>

    {/* İstatistikler */}
    <div className="bg-white rounded-2xl shadow-xl p-8 mt-6">
     <h2 className="text-2xl font-bold text-gray-800 mb-6">İstatistikler</h2>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-linear-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
       <p className="text-sm text-gray-600 mb-1">Toplam Seans</p>
       <p className="text-3xl font-bold text-blue-600">{profile.totalSessions || 0}</p>
      </div>
      <div className="bg-linear-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
       <p className="text-sm text-gray-600 mb-1">Değerlendirme</p>
       <p className="text-3xl font-bold text-purple-600">{profile.rating || 0} ⭐</p>
      </div>
      <div className="bg-linear-to-br from-green-50 to-green-100 p-6 rounded-xl">
       <p className="text-sm text-gray-600 mb-1">Seans Ücreti</p>
       <p className="text-3xl font-bold text-green-600">₺{profile.sessionFee || 0}</p>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}

