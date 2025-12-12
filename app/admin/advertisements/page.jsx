'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';

export default function AdvertisementsPage() {
 const [advertisements, setAdvertisements] = useState([]);
 const [loading, setLoading] = useState(true);
 const [page, setPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);

 useEffect(() => {
  fetchAdvertisements();
 }, [page]);

 const fetchAdvertisements = async () => {
  try {
   setLoading(true);
   const response = await fetch(`/api/advertisements?page=${page}&limit=20&status=published`);
   const data = await response.json();
   setAdvertisements(data.data || []);
   setTotalPages(data.pagination?.pages || 1);
  } catch (error) {
   console.error('Fetch advertisements error:', error);
  } finally {
   setLoading(false);
  }
 };

 const handleDelete = async (id) => {
  if (!confirm('Bu reklamı silmek istediğinizden emin misiniz?')) {
   return;
  }

  try {
   const response = await fetch(`/api/advertisements/${id}`, {
    method: 'DELETE'
   });

   if (response.ok) {
    alert('Reklam başarıyla silindi');
    fetchAdvertisements();
   } else {
    alert('Reklam silinirken hata oluştu');
   }
  } catch (error) {
   console.error('Delete error:', error);
   alert('Reklam silinirken hata oluştu');
  }
 };

 if (loading) {
  return <div className="text-center py-10">Yükleniyor...</div>;
 }

 return (
  <div>
   <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold">Reklam & Blog Yönetimi</h1>
    <Link
     href="/admin/advertisements/new"
     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
    >
     <FaPlus /> Yeni Reklam Ekle
    </Link>
   </div>

   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {advertisements.map((ad) => (
     <div key={ad._id} className="bg-white rounded-lg shadow-md overflow-hidden">
      {ad.featuredImage && (
       <img
        src={ad.featuredImage}
        alt={ad.title}
        className="w-full h-48 object-cover"
       />
      )}
      <div className="p-4">
       <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
         {ad.category}
        </span>
        {ad.featured && (
         <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
          Öne Çıkan
         </span>
        )}
       </div>
       <h3 className="font-bold text-lg mb-2 line-clamp-2">{ad.title}</h3>
       <p className="text-sm text-gray-600 mb-4 line-clamp-3">
        {ad.excerpt || ad.content.substring(0, 100)}
       </p>
       <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{new Date(ad.publishDate).toLocaleDateString('tr-TR')}</span>
        <span>{ad.viewCount} görüntülenme</span>
       </div>
       <div className="flex gap-2">
        <Link
         href={`/admin/advertisements/${ad._id}`}
         className="flex-1 text-center bg-blue-100 text-blue-700 px-3 py-2 rounded hover:bg-blue-200 flex items-center justify-center gap-2"
        >
         <FaEye /> Görüntüle
        </Link>
        <Link
         href={`/admin/advertisements/${ad._id}/edit`}
         className="flex-1 text-center bg-indigo-100 text-indigo-700 px-3 py-2 rounded hover:bg-indigo-200 flex items-center justify-center gap-2"
        >
         <FaEdit /> Düzenle
        </Link>
        <button
         onClick={() => handleDelete(ad._id)}
         className="bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200"
        >
         <FaTrash />
        </button>
       </div>
      </div>
     </div>
    ))}
   </div>

   {/* Pagination */}
   {totalPages > 1 && (
    <div className="mt-8 flex justify-center gap-2">
     <button
      onClick={() => setPage(p => Math.max(1, p - 1))}
      disabled={page === 1}
      className="px-4 py-2 border rounded disabled:opacity-50 bg-white"
     >
      Önceki
     </button>
     <span className="px-4 py-2 bg-white border rounded">
      Sayfa {page} / {totalPages}
     </span>
     <button
      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
      disabled={page === totalPages}
      className="px-4 py-2 border rounded disabled:opacity-50 bg-white"
     >
      Sonraki
     </button>
    </div>
   )}
  </div>
 );
}

