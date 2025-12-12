'use client';

import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaCalendar } from 'react-icons/fa';

export default function AppointmentsPage() {
 const [appointments, setAppointments] = useState([]);
 const [loading, setLoading] = useState(true);
 const [page, setPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);
 const [filterStatus, setFilterStatus] = useState('');

 useEffect(() => {
  fetchAppointments();
 }, [page, filterStatus]);

 const fetchAppointments = async () => {
  try {
   setLoading(true);
   let url = `/api/appointments?page=${page}&limit=20`;
   if (filterStatus) {
    url += `&status=${filterStatus}`;
   }
   const response = await fetch(url);
   const data = await response.json();
   setAppointments(data.data || []);
   setTotalPages(data.pagination?.pages || 1);
  } catch (error) {
   console.error('Fetch appointments error:', error);
  } finally {
   setLoading(false);
  }
 };

 const handleDelete = async (id) => {
  if (!confirm('Bu randevuyu silmek istediğinizden emin misiniz?')) {
   return;
  }

  try {
   const response = await fetch(`/api/appointments/${id}`, {
    method: 'DELETE'
   });

   if (response.ok) {
    alert('Randevu başarıyla silindi');
    fetchAppointments();
   } else {
    alert('Randevu silinirken hata oluştu');
   }
  } catch (error) {
   console.error('Delete error:', error);
   alert('Randevu silinirken hata oluştu');
  }
 };

 const handleStatusChange = async (id, newStatus) => {
  try {
   const response = await fetch(`/api/appointments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
   });

   if (response.ok) {
    alert('Randevu durumu güncellendi');
    fetchAppointments();
   } else {
    alert('Güncelleme başarısız');
   }
  } catch (error) {
   console.error('Update error:', error);
   alert('Güncelleme başarısız');
  }
 };

 const getStatusColor = (status) => {
  const colors = {
   pending: 'bg-yellow-100 text-yellow-800',
   confirmed: 'bg-green-100 text-green-800',
   cancelled: 'bg-red-100 text-red-800',
   completed: 'bg-blue-100 text-blue-800',
   'no-show': 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
 };

 const getStatusText = (status) => {
  const texts = {
   pending: 'Bekliyor',
   confirmed: 'Onaylandı',
   cancelled: 'İptal',
   completed: 'Tamamlandı',
   'no-show': 'Gelmedi'
  };
  return texts[status] || status;
 };

 if (loading) {
  return <div className="text-center py-10">Yükleniyor...</div>;
 }

 return (
  <div>
   <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold">Randevu Yönetimi</h1>
    <div className="flex gap-2">
     <select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
      className="px-4 py-2 border rounded-lg"
     >
      <option value="">Tüm Durumlar</option>
      <option value="pending">Bekliyor</option>
      <option value="confirmed">Onaylandı</option>
      <option value="completed">Tamamlandı</option>
      <option value="cancelled">İptal</option>
     </select>
    </div>
   </div>

   <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <table className="min-w-full">
     <thead className="bg-gray-50">
      <tr>
       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
        Hasta
       </th>
       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
        Psikolog
       </th>
       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
        Tarih & Saat
       </th>
       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
        Tip
       </th>
       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
        Durum
       </th>
       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
        İşlemler
       </th>
      </tr>
     </thead>
     <tbody className="divide-y divide-gray-200">
      {appointments.map((appointment) => (
       <tr key={appointment._id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
         <div>
          <div className="font-medium text-gray-900">
           {appointment.clientName}
          </div>
          <div className="text-sm text-gray-500">
           {appointment.clientEmail}
          </div>
          <div className="text-sm text-gray-500">
           {appointment.clientPhone}
          </div>
         </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
         {appointment.psychologistId?.fullName || 'N/A'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
         <div className="flex items-center gap-2">
          <FaCalendar className="text-gray-400" />
          <div>
           <div className="text-sm font-medium text-gray-900">
            {new Date(appointment.appointmentDate).toLocaleDateString('tr-TR')}
           </div>
           <div className="text-sm text-gray-500">
            {appointment.appointmentTime}
           </div>
          </div>
         </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
         {appointment.sessionType === 'online' ? 'Online' : 'Yüz Yüze'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
         <select
          value={appointment.status}
          onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}
         >
          <option value="pending">Bekliyor</option>
          <option value="confirmed">Onaylandı</option>
          <option value="completed">Tamamlandı</option>
          <option value="cancelled">İptal</option>
          <option value="no-show">Gelmedi</option>
         </select>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
         <button
          onClick={() => handleDelete(appointment._id)}
          className="text-red-600 hover:text-red-900"
         >
          <FaTrash />
         </button>
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

