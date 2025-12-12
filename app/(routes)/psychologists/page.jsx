'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaStar, FaSearch } from 'react-icons/fa';

export default function PsychologistsListPage() {
 const [psychologists, setPsychologists] = useState([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [page, setPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);

 useEffect(() => {
  fetchPsychologists();
 }, [page, search]);

 const fetchPsychologists = async () => {
  try {
   setLoading(true);
   let url = `/api/psychologists?approved=true&page=${page}&limit=12`;
   if (search) {
    url += `&search=${encodeURIComponent(search)}`;
   }
   const response = await fetch(url);
   const data = await response.json();
   setPsychologists(data.data || []);
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
  fetchPsychologists();
 };

 return (
  <div className="min-h-screen bg-gray-50 ">

   {/* Content */}
   <div className=" mx-auto px-4 py-8">
    <h1 className="text-4xl font-bold text-center mb-8">Uzman Psikologlarımız</h1>

    {/* Search */}
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
     <div className="flex gap-2">
      <div className="flex-1 relative">
       <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
       <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Psikolog adı veya uzmanlık alanı ara..."
        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
       />
      </div>
      <button
       type="submit"
       className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
       Ara
      </button>
     </div>
    </form>

    {/* Loading */}
    {loading && (
     <div className="text-center py-10">
      <div className="text-xl">Yükleniyor...</div>
     </div>
    )}

    {/* Psychologists Grid */}
    {!loading && (
     <>
      {psychologists.length === 0 ? (
       <div className="text-center py-10">
        <p className="text-xl text-gray-600">Psikolog bulunamadı</p>
       </div>
      ) : (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {psychologists.map((psychologist) => (
         <div key={psychologist._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
          <div className="p-6">
           <div className="flex items-center mb-4">
            <img
             src={psychologist.profilePhoto}
             alt={psychologist.fullName}
             className="w-24 h-24 rounded-full object-cover mr-4"
            />
            <div className="flex-1">
             <h3 className="text-xl font-bold">{psychologist.fullName}</h3>
             <p className="text-sm text-gray-600">{psychologist.title}</p>
             <div className="flex items-center gap-1 mt-1">
              <FaStar className="text-yellow-500" />
              <span className="font-semibold">{psychologist.rating || 5.0}</span>
              <span className="text-sm text-gray-500">
               ({psychologist.totalSessions} seans)
              </span>
             </div>
            </div>
           </div>

           {psychologist.bio && (
            <p className="text-gray-700 mb-4 line-clamp-3">
             {psychologist.bio}
            </p>
           )}

           {psychologist.specializations && psychologist.specializations.length > 0 && (
            <div className="mb-4">
             <div className="flex flex-wrap gap-2">
              {psychologist.specializations.slice(0, 3).map((spec, idx) => (
               <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {spec}
               </span>
              ))}
             </div>
            </div>
           )}

           <div className="flex items-center justify-between">
            <div>
             {psychologist.sessionPrice > 0 && (
              <p className="text-lg font-bold text-gray-800">
               ₺{psychologist.sessionPrice}
              </p>
             )}
            </div>
            <Link
             href={`/psychologists/${psychologist._id}`}
             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
             Profil & Randevu
            </Link>
           </div>
          </div>
         </div>
        ))}
       </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
       <div className="flex justify-center gap-2">
        <button
         onClick={() => setPage(p => Math.max(1, p - 1))}
         disabled={page === 1}
         className="px-4 py-2 bg-white border rounded disabled:opacity-50 hover:bg-gray-50"
        >
         Önceki
        </button>
        <span className="px-4 py-2 bg-white border rounded">
         Sayfa {page} / {totalPages}
        </span>
        <button
         onClick={() => setPage(p => Math.min(totalPages, p + 1))}
         disabled={page === totalPages}
         className="px-4 py-2 bg-white border rounded disabled:opacity-50 hover:bg-gray-50"
        >
         Sonraki
        </button>
       </div>
      )}
     </>
    )}
   </div>
  </div>
 );
}

