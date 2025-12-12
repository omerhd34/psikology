'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaSearch, FaCalendar, FaEye, FaTag } from 'react-icons/fa';

export default function BlogPage() {
 const [advertisements, setAdvertisements] = useState([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [selectedCategory, setSelectedCategory] = useState('');
 const [page, setPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);

 const categories = ['blog', 'haber', 'etkinlik', 'makale', 'duyuru'];

 useEffect(() => {
  fetchAdvertisements();
 }, [page, selectedCategory]);

 const fetchAdvertisements = async () => {
  try {
   setLoading(true);
   let url = `/api/advertisements?status=published&page=${page}&limit=12`;
   if (selectedCategory) {
    url += `&category=${selectedCategory}`;
   }
   if (search) {
    url += `&search=${encodeURIComponent(search)}`;
   }

   const response = await fetch(url);
   const data = await response.json();
   setAdvertisements(data.data || []);
   setTotalPages(data.pagination?.pages || 1);
  } catch (error) {
   console.error('Fetch error:', error);
  } finally {
   setLoading(false);
  }
 };

 const handleSearch = (e) => {
  e.preventDefault();
  setPage(1);
  fetchAdvertisements();
 };

 return (
  <div className="min-h-screen bg-gray-50 ">
   {/* Hero */}
   <section className="relative bg-linear-to-br from-purple-600 via-pink-600 to-purple-700 text-white py-20 overflow-hidden">
    <div className="absolute inset-0 overflow-hidden">
     <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
     <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
    </div>

    <div className=" mx-auto px-4 text-center relative z-10">
     <h1 className="text-6xl font-extrabold mb-4 animate-fade-in drop-shadow-lg">
      Blog & İçerikler
     </h1>
     <p className="text-2xl opacity-95">Psikoloji alanında güncel yazılar ve makaleler</p>
    </div>
   </section>

   {/* Filters & Search */}
   <section className="py-8 bg-white shadow-sm">
    <div className=" mx-auto px-4">
     <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
       <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
         type="text"
         value={search}
         onChange={(e) => setSearch(e.target.value)}
         placeholder="Başlık veya içerik ara..."
         className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all outline-none"
        />
       </div>
      </form>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
       <button
        onClick={() => setSelectedCategory('')}
        className={`px-4 py-2 rounded-full font-medium transition-all ${selectedCategory === ''
         ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg'
         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
         }`}
       >
        Tümü
       </button>
       {categories.map((cat) => (
        <button
         key={cat}
         onClick={() => setSelectedCategory(cat)}
         className={`px-4 py-2 rounded-full font-medium transition-all capitalize ${selectedCategory === cat
          ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
         {cat}
        </button>
       ))}
      </div>
     </div>
    </div>
   </section>

   {/* Content */}
   <section className="py-12 mx-auto px-4">
    {loading ? (
     <div className="text-center py-20">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
      <p className="mt-4 text-gray-600">Yükleniyor...</p>
     </div>
    ) : advertisements.length === 0 ? (
     <div className="text-center py-20">
      <div className="text-6xl mb-4">📝</div>
      <p className="text-xl text-gray-600">Henüz içerik bulunamadı</p>
     </div>
    ) : (
     <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       {advertisements.map((ad) => (
        <div
         key={ad._id}
         className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
        >
         {ad.featuredImage && (
          <div className="relative overflow-hidden h-56">
           <img
            src={ad.featuredImage}
            alt={ad.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
           />
           <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
           {ad.featured && (
            <div className="absolute top-4 right-4 bg-linear-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
             ⭐ Öne Çıkan
            </div>
           )}
          </div>
         )}
         <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
           <span className="px-3 py-1 bg-linear-to-r from-purple-100 to-pink-100 text-purple-800 text-xs font-semibold rounded-full capitalize">
            <FaTag className="inline mr-1" />
            {ad.category}
           </span>
           <span className="text-xs text-gray-500 flex items-center gap-1">
            <FaEye />
            {ad.viewCount}
           </span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-2">
           {ad.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-sm">
           {ad.excerpt || ad.content.substring(0, 150)}...
          </p>
          <div className="flex items-center justify-between">
           <span className="text-xs text-gray-500 flex items-center gap-1">
            <FaCalendar />
            {new Date(ad.publishDate).toLocaleDateString('tr-TR')}
           </span>
           <Link
            href={`/blog/${ad.slug}`}
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold text-sm group-hover:gap-2 transition-all"
           >
            Devamını Oku
            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
           </Link>
          </div>
         </div>
        </div>
       ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
       <div className="flex justify-center gap-2 mt-12">
        <button
         onClick={() => setPage((p) => Math.max(1, p - 1))}
         disabled={page === 1}
         className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl disabled:opacity-50 hover:border-purple-500 hover:text-purple-600 font-semibold transition-all disabled:cursor-not-allowed"
        >
         ← Önceki
        </button>
        <div className="flex items-center px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold">
         {page} / {totalPages}
        </div>
        <button
         onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
         disabled={page === totalPages}
         className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl disabled:opacity-50 hover:border-purple-500 hover:text-purple-600 font-semibold transition-all disabled:cursor-not-allowed"
        >
         Sonraki →
        </button>
       </div>
      )}
     </>
    )}
   </section>
  </div>
 );
}

