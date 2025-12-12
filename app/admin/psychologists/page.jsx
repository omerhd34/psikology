'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaEye } from 'react-icons/fa';

export default function PsychologistsPage() {
 const [psychologists, setPsychologists] = useState([]);
 const [loading, setLoading] = useState(true);
 const [page, setPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);

 useEffect(() => {
  fetchPsychologists();
 }, [page]);

 const fetchPsychologists = async () => {
  try {
   setLoading(true);
   const response = await fetch(`/api/psychologists?page=${page}&limit=20`);
   const data = await response.json();
   setPsychologists(data.data || []);
   setTotalPages(data.pagination?.pages || 1);
  } catch (error) {
   console.error('Fetch psychologists error:', error);
  } finally {
   setLoading(false);
  }
 };

 const handleDelete = async (id) => {
  if (!confirm('Bu psikoloğu silmek istediğinizden emin misiniz?')) {
   return;
  }

  try {
   const response = await fetch(`/api/psychologists/${id}`, {
    method: 'DELETE'
   });

   if (response.ok) {
    alert('Psikolog başarıyla silindi');
    fetchPsychologists();
   } else {
    alert('Psikolog silinirken hata oluştu');
   }
  } catch (error) {
   console.error('Delete error:', error);
   alert('Psikolog silinirken hata oluştu');
  }
 };

 const handleToggleApproval = async (id, currentStatus) => {
  try {
   const response = await fetch(`/api/psychologists/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isApproved: !currentStatus })
   });

   if (response.ok) {
    alert('Onay durumu güncellendi');
    fetchPsychologists();
   } else {
    alert('Güncelleme başarısız');
   }
  } catch (error) {
   console.error('Update error:', error);
   alert('Güncelleme başarısız');
  }
 };

 if (loading) {
  return <div className="text-center py-10">Yükleniyor...</div>;
 }

 return (
  <div>
   <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold">Psikolog Yönetimi</h1>
    <Link
     href="/admin/psychologists/new"
     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
    >
     <FaPlus /> Yeni Psikolog Ekle
    </Link>
   </div>

   <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <table className="min-w-full">
     <thead className="bg-gray-50">
      <tr>
       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
        Ad Soyad
       </th>
       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
        Email
       </th>
       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
        Telefon
       </th>
       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
        Durum
       </th>
       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
        Onay
       </th>
       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
        İşlemler
       </th>
      </tr>
     </thead>
     <tbody className="divide-y divide-gray-200">
      {psychologists.map((psychologist) => (
       <tr key={psychologist._id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
         <div className="flex items-center">
          <div>
           <div className="font-medium text-gray-900">
            {psychologist.fullName}
           </div>
           <div className="text-sm text-gray-500">
            {psychologist.title}
           </div>
          </div>
         </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
         {psychologist.email}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
         {psychologist.phone || '-'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
         <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${psychologist.isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
          }`}>
          {psychologist.isActive ? 'Aktif' : 'Pasif'}
         </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
         <button
          onClick={() => handleToggleApproval(psychologist._id, psychologist.isApproved)}
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${psychologist.isApproved
           ? 'bg-blue-100 text-blue-800'
           : 'bg-yellow-100 text-yellow-800'
           }`}
         >
          {psychologist.isApproved ? <FaCheck /> : <FaTimes />}
         </button>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
         <div className="flex gap-2">
          <Link
           href={`/admin/psychologists/${psychologist._id}`}
           className="text-blue-600 hover:text-blue-900"
          >
           <FaEye />
          </Link>
          <Link
           href={`/admin/psychologists/${psychologist._id}/edit`}
           className="text-indigo-600 hover:text-indigo-900"
          >
           <FaEdit />
          </Link>
          <button
           onClick={() => handleDelete(psychologist._id)}
           className="text-red-600 hover:text-red-900"
          >
           <FaTrash />
          </button>
         </div>
        </td>
       </tr>
      ))}
     </tbody>
    </table>

    {/* Pagination */}
    {totalPages > 1 && (
     <div className="px-6 py-4 flex justify-center gap-2 border-t">
      <button
       onClick={() => setPage(p => Math.max(1, p - 1))}
       disabled={page === 1}
       className="px-4 py-2 border rounded disabled:opacity-50"
      >
       Önceki
      </button>
      <span className="px-4 py-2">
       Sayfa {page} / {totalPages}
      </span>
      <button
       onClick={() => setPage(p => Math.min(totalPages, p + 1))}
       disabled={page === totalPages}
       className="px-4 py-2 border rounded disabled:opacity-50"
      >
       Sonraki
      </button>
     </div>
    )}
   </div>
  </div>
 );
}

