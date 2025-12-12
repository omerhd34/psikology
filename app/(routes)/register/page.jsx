'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
 const router = useRouter();
 const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user',
  phone: '',
  isPsychologist: false
 });
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  // Şifre kontrolü
  if (formData.password !== formData.confirmPassword) {
   setError('Şifreler eşleşmiyor');
   return;
  }

  if (formData.password.length < 6) {
   setError('Şifre en az 6 karakter olmalıdır');
   return;
  }

  setLoading(true);

  try {
   const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
     name: formData.name,
     email: formData.email,
     password: formData.password,
     role: formData.isPsychologist ? 'psychologist' : 'user',
     phone: formData.phone
    })
   });

   const data = await response.json();

   if (response.ok) {
    alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
    router.push('/login');
   } else {
    setError(data.error || 'Kayıt başarısız');
   }
  } catch (error) {
   console.error('Register error:', error);
   setError('Bir hata oluştu. Lütfen tekrar deneyin.');
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 ">
   <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 transform hover:scale-[1.02] transition-transform duration-300">
    <div className="text-center mb-8">
     <div className="inline-block p-4 bg-linear-to-r from-green-500 to-emerald-600 rounded-2xl mb-4">
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
     </div>
     <h1 className="text-4xl font-extrabold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
      Hesap Oluştur
     </h1>
     <p className="text-gray-600">Hemen ücretsiz kayıt olun</p>
    </div>

    {error && (
     <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-fade-in">
      <p className="font-medium">{error}</p>
     </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-4">
     {/* Kullanıcı Tipi Seçimi */}
     <div className="bg-linear-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-100">
      <label className="flex items-center cursor-pointer">
       <input
        type="checkbox"
        checked={formData.isPsychologist}
        onChange={(e) => setFormData({ ...formData, isPsychologist: e.target.checked })}
        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
       />
       <span className="ml-3 font-semibold text-gray-800">
        Psikolog olarak kayıt ol
       </span>
      </label>
      <p className="text-xs text-gray-600 mt-2 ml-8">
       Psikolog hesabı oluşturarak profilinizi yönetebilir ve randevu alabilirsiniz
      </p>
     </div>

     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       {formData.isPsychologist ? 'Tam Adınız (Dr. unvanınızla)' : 'Ad Soyad'}
      </label>
      <input
       type="text"
       value={formData.name}
       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all outline-none"
       placeholder={formData.isPsychologist ? "Dr. Ayşe Yılmaz" : "Adınız Soyadınız"}
       required
      />
     </div>

     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Email Adresiniz
      </label>
      <input
       type="email"
       value={formData.email}
       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all outline-none"
       placeholder="ornek@email.com"
       required
      />
     </div>

     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Şifre
      </label>
      <input
       type="password"
       value={formData.password}
       onChange={(e) => setFormData({ ...formData, password: e.target.value })}
       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all outline-none"
       placeholder="En az 6 karakter"
       required
      />
     </div>

     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Şifre Tekrar
      </label>
      <input
       type="password"
       value={formData.confirmPassword}
       onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all outline-none"
       placeholder="Şifrenizi tekrar girin"
       required
      />
     </div>

     {/* Telefon (Psikologlar için zorunlu) */}
     {formData.isPsychologist && (
      <div>
       <label className="block text-sm font-semibold text-gray-700 mb-2">
        Telefon Numarası *
       </label>
       <input
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all outline-none"
        placeholder="+90 5XX XXX XX XX"
        required={formData.isPsychologist}
       />
      </div>
     )}

     <button
      type="submit"
      disabled={loading}
      className="w-full bg-linear-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg mt-6"
     >
      {loading ? (
       <span className="flex items-center justify-center gap-2">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Kayıt yapılıyor...
       </span>
      ) : 'Hesap Oluştur'}
     </button>
    </form>

    <div className="mt-8 text-center space-y-4">
     <div className="relative">
      <div className="absolute inset-0 flex items-center">
       <div className="w-full border-t border-gray-200"></div>
      </div>
      <div className="relative flex justify-center text-sm">
       <span className="px-4 bg-white text-gray-500">veya</span>
      </div>
     </div>

     <p className="text-gray-600">
      Zaten hesabınız var mı?{' '}
      <Link href="/login" className="text-green-600 hover:text-green-700 font-bold hover:underline">
       Giriş Yapın
      </Link>
     </p>
    </div>

    <div className="mt-6 text-center">
     <Link href="/" className="text-sm text-gray-500 hover:text-green-600 transition-colors inline-flex items-center gap-1">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Ana Sayfaya Dön
     </Link>
    </div>
   </div>
  </div>
 );
}

