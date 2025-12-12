'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaCalendar, FaUsers, FaBullhorn, FaStar } from 'react-icons/fa';
import Container from '@/components/ui/Container';

export default function HomePage() {
 const [psychologists, setPsychologists] = useState([]);
 const [advertisements, setAdvertisements] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  fetchData();
 }, []);

 const fetchData = async () => {
  try {
   // Onaylı psikologları getir
   const psychRes = await fetch('/api/psychologists?approved=true&limit=6');
   const psychData = await psychRes.json();
   setPsychologists(psychData.data || []);

   // Öne çıkan reklamları getir
   const adRes = await fetch('/api/advertisements?featured=true&limit=3');
   const adData = await adRes.json();
   setAdvertisements(adData.data || []);
  } catch (error) {
   console.error('Fetch error:', error);
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="min-h-screen bg-gray-50">
   {/* Hero Section */}
   <section className="relative bg-blue-700 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 text-white pt-28 md:pt-32 pb-24 md:pb-28 overflow-hidden">
    {/* Dekoratif Arka Plan */}
    <div className="absolute inset-0 overflow-hidden">
     <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
     <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
    </div>

    <Container className="text-center relative z-10">
     <h2 className="text-6xl font-extrabold mb-6 animate-fade-in drop-shadow-lg">
      Profesyonel Psikolojik Destek
     </h2>
     <p className="text-2xl mb-10 max-w-3xl mx-auto opacity-95 leading-relaxed">
      Portföyümüzde bulunan uzman psikologlarımızdan online veya yüz yüze randevu alabilirsiniz
     </p>
     <div className="flex gap-4 justify-center flex-wrap">
      <Link
       href="/psychologists"
       className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-white/20 hover:scale-105 transform"
      >
       Psikologları İncele
      </Link>
      <Link
       href="/register"
       className="bg-linear-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transform transition-all"
      >
       Psikolog Ol
      </Link>
      <Link
       href="/contact"
       className="border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all hover:scale-105 transform"
      >
       İletişime Geç
      </Link>
     </div>
    </Container>
   </section>

   {/* Özellikler */}
   <section className="py-20">
    <Container>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-2 border border-gray-100">
       <div className="bg-linear-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
        <FaUsers className="text-4xl text-white" />
       </div>
       <h3 className="text-2xl font-bold mb-3 text-gray-800">Uzman Psikologlar</h3>
       <p className="text-gray-600 leading-relaxed">
        Alanında uzman, deneyimli psikologlarımız sizin için hazır
       </p>
      </div>
      <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-2 border border-gray-100">
       <div className="bg-linear-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
        <FaCalendar className="text-4xl text-white" />
       </div>
       <h3 className="text-2xl font-bold mb-3 text-gray-800">Kolay Randevu</h3>
       <p className="text-gray-600 leading-relaxed">
        Online sistem üzerinden kolayca randevu alabilirsiniz
       </p>
      </div>
      <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-2 border border-gray-100">
       <div className="bg-linear-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
        <FaBullhorn className="text-4xl text-white" />
       </div>
       <h3 className="text-2xl font-bold mb-3 text-gray-800">Blog & İçerikler</h3>
       <p className="text-gray-600 leading-relaxed">
        Psikoloji alanında faydalı blog yazıları ve içerikler
       </p>
      </div>
     </div>
    </Container>
   </section >

   {/* Psikologlar */}
   {
    !loading && psychologists.length > 0 && (
     <section className="py-20 bg-linear-to-b from-white to-gray-50">
      <Container>
       <div className="text-center mb-16">
        <h2 className="text-5xl font-extrabold mb-4 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
         Uzman Psikologlarımız
        </h2>
        <p className="text-gray-600 text-lg">Alanında uzman, deneyimli psikologlarımız ile tanışın</p>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {psychologists.map((psychologist) => (
         <div key={psychologist._id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
          <div className="p-8">
           <div className="flex items-center mb-6">
            <div className="relative">
             <img
              src={psychologist.profilePhoto}
              alt={psychologist.fullName}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all"
             />
             <div className="absolute -bottom-2 -right-2 bg-linear-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              Aktif
             </div>
            </div>
            <div className="ml-4">
             <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{psychologist.fullName}</h3>
             <p className="text-sm text-gray-600 font-medium">{psychologist.title}</p>
             <div className="flex items-center gap-1 mt-2">
              <FaStar className="text-yellow-400" />
              <span className="font-semibold text-gray-700">{psychologist.rating || 5.0}</span>
              <span className="text-xs text-gray-500 ml-1">({psychologist.totalSessions} seans)</span>
             </div>
            </div>
           </div>
           <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
            {psychologist.bio || 'Deneyimli psikolog'}
           </p>
           <Link
            href={`/psychologists/${psychologist._id}`}
            className="block w-full text-center bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
           >
            Profil & Randevu Al
           </Link>
          </div>
         </div>
        ))}
       </div>
       <div className="text-center mt-12">
        <Link
         href="/psychologists"
         className="inline-block bg-linear-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
        >
         Tüm Psikologları Gör →
        </Link>
       </div>
      </Container>
     </section>
    )
   }

   {/* Blog/Reklamlar */}
   {
    !loading && advertisements.length > 0 && (
     <section className="py-20">
      <Container>
       <div className="text-center mb-16">
        <h2 className="text-5xl font-extrabold mb-4 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
         Son Yazılar
        </h2>
        <p className="text-gray-600 text-lg">Psikoloji alanında güncel içerikler ve makaleler</p>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {advertisements.map((ad) => (
         <div key={ad._id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
          {ad.featuredImage && (
           <div className="relative overflow-hidden h-56">
            <img
             src={ad.featuredImage}
             alt={ad.title}
             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
           </div>
          )}
          <div className="p-6">
           <span className="px-3 py-1 bg-linear-to-r from-purple-100 to-pink-100 text-purple-800 text-xs font-semibold rounded-full">
            {ad.category}
           </span>
           <h3 className="text-xl font-bold mt-4 mb-3 text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-2">{ad.title}</h3>
           <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {ad.excerpt || ad.content.substring(0, 100)}...
           </p>
           <Link
            href={`/blog/${ad.slug}`}
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold group-hover:gap-2 transition-all"
           >
            Devamını Oku
            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
           </Link>
          </div>
         </div>
        ))}
       </div>
      </Container>
     </section>
    )
   }
  </div >
 );
}
