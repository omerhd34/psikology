'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
 const router = useRouter();
 const [formData, setFormData] = useState({
  email: '',
  password: ''
 });
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
   const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
   });

   const data = await response.json();

   if (response.ok) {
    // Başarılı giriş - Hard redirect ile yönlendir
    if (data.user.role === 'admin') {
     window.location.href = '/admin';
    } else if (data.user.role === 'psychologist') {
     window.location.href = '/dashboard';
    } else {
     window.location.href = '/';
    }
   } else {
    setError(data.error || 'Giriş başarısız');
   }
  } catch (error) {
   console.error('Login error:', error);
   setError('Bir hata oluştu. Lütfen tekrar deneyin.');
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 ">
   <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 transform hover:scale-[1.02] transition-transform duration-300">
    <div className="text-center mb-8">
     <div className="inline-block p-4 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
     </div>
     <h1 className="text-4xl font-extrabold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
      Hoş Geldiniz
     </h1>
     <p className="text-gray-600">Hesabınıze giriş yapın</p>
    </div>

    {error && (
     <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 animate-fade-in">
      <p className="font-medium">{error}</p>
     </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-5">
     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Email Adresiniz
      </label>
      <input
       type="email"
       value={formData.email}
       onChange={(e) => setFormData({ ...formData, email: e.target.value })}
       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
       placeholder="ornek@email.com"
       required
      />
     </div>

     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Şifreniz
      </label>
      <input
       type="password"
       value={formData.password}
       onChange={(e) => setFormData({ ...formData, password: e.target.value })}
       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
       placeholder="••••••••"
       required
      />
     </div>

     <button
      type="submit"
      disabled={loading}
      className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
     >
      {loading ? (
       <span className="flex items-center justify-center gap-2">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Giriş yapılıyor...
       </span>
      ) : 'Giriş Yap'}
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
      Hesabınız yok mu?{' '}
      <Link href="/register" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
       Hemen Kayıt Olun
      </Link>
     </p>
    </div>

    <div className="mt-6 text-center">
     <Link href="/" className="text-sm text-gray-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1">
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

