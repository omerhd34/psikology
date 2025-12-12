'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

export default function ContactPage() {
 const [formData, setFormData] = useState({
  name: '',
  email: '',
  subject: '',
  message: ''
 });
 const [loading, setLoading] = useState(false);
 const [success, setSuccess] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // Simüle edilmiş form gönderimi
  setTimeout(() => {
   setSuccess(true);
   setFormData({ name: '', email: '', subject: '', message: '' });
   setLoading(false);

   setTimeout(() => {
    setSuccess(false);
   }, 3000);
  }, 1000);
 };

 return (
  <div className="min-h-screen bg-gray-50 ">

   {/* Hero */}
   <section className="relative bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20 overflow-hidden">
    {/* Dekoratif Arka Plan */}
    <div className="absolute inset-0 overflow-hidden">
     <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
     <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
    </div>

    <div className=" mx-auto px-4 text-center relative z-10">
     <h1 className="text-6xl font-extrabold mb-4 animate-fade-in drop-shadow-lg">İletişim</h1>
     <p className="text-2xl opacity-95">Bizimle iletişime geçin, size yardımcı olmaktan mutluluk duyarız</p>
    </div>
   </section>

   {/* Content */}
   <div className=" mx-auto px-4 py-16">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
     {/* İletişim Bilgileri */}
     <div>
      <h2 className="text-3xl font-bold mb-6">İletişim Bilgileri</h2>
      <div className="space-y-6">
       <div className="flex items-start gap-4 group">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
         <FaMapMarkerAlt className="text-2xl text-white" />
        </div>
        <div>
         <h3 className="font-semibold text-lg mb-1">Adres</h3>
         <p className="text-gray-600">
          Örnek Mahallesi, Örnek Sokak No:1<br />
          34000 İstanbul, Türkiye
         </p>
        </div>
       </div>

       <div className="flex items-start gap-4 group">
        <div className="bg-linear-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
         <FaPhone className="text-2xl text-white" />
        </div>
        <div>
         <h3 className="font-semibold text-lg mb-1">Telefon</h3>
         <p className="text-gray-600">
          +90 (212) 555 55 55<br />
          +90 (533) 555 55 55
         </p>
        </div>
       </div>

       <div className="flex items-start gap-4 group">
        <div className="bg-linear-to-br from-purple-500 to-purple-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
         <FaEnvelope className="text-2xl text-white" />
        </div>
        <div>
         <h3 className="font-semibold text-lg mb-1">Email</h3>
         <p className="text-gray-600">
          info@psikolojiportali.com<br />
          destek@psikolojiportali.com
         </p>
        </div>
       </div>
      </div>

      {/* Çalışma Saatleri */}
      <div className="mt-8 bg-linear-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100">
       <h3 className="font-bold text-2xl mb-4 text-gray-800">Çalışma Saatleri</h3>
       <div className="space-y-2 text-gray-600">
        <div className="flex justify-between">
         <span>Pazartesi - Cuma</span>
         <span className="font-semibold">09:00 - 18:00</span>
        </div>
        <div className="flex justify-between">
         <span>Cumartesi</span>
         <span className="font-semibold">10:00 - 16:00</span>
        </div>
        <div className="flex justify-between">
         <span>Pazar</span>
         <span className="font-semibold text-red-600">Kapalı</span>
        </div>
       </div>
      </div>
     </div>

     {/* İletişim Formu */}
     <div>
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
       <h2 className="text-4xl font-extrabold mb-8 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Mesaj Gönderin
       </h2>

       {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg animate-fade-in shadow-sm">
         <p className="font-medium">Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.</p>
        </div>
       )}

       <form onSubmit={handleSubmit} className="space-y-5">
        <div>
         <label className="block text-sm font-semibold text-gray-700 mb-2">Ad Soyad *</label>
         <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
          placeholder="Adınız Soyadınız"
          required
         />
        </div>

        <div>
         <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
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
         <label className="block text-sm font-semibold text-gray-700 mb-2">Konu *</label>
         <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
          placeholder="Mesaj konusu"
          required
         />
        </div>

        <div>
         <label className="block text-sm font-semibold text-gray-700 mb-2">Mesajınız *</label>
         <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none resize-none"
          rows="6"
          placeholder="Mesajınızı buraya yazın..."
          required
         ></textarea>
        </div>

        <button
         type="submit"
         disabled={loading}
         className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 font-bold text-lg flex items-center justify-center gap-2"
        >
         {loading ? (
          <span className="flex items-center gap-2">
           <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
           Gönderiliyor...
          </span>
         ) : (
          <>
           <FaPaperPlane /> Mesajı Gönder
          </>
         )}
        </button>
       </form>
      </div>
     </div>
    </div>
   </div>

  </div>
 );
}