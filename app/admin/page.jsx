'use client';

import { useEffect, useState } from 'react';
import { FaUsers, FaCalendar, FaBullhorn, FaCheckCircle } from 'react-icons/fa';

export default function AdminDashboard() {
 const [stats, setStats] = useState({
  totalPsychologists: 0,
  approvedPsychologists: 0,
  totalAppointments: 0,
  pendingAppointments: 0,
  totalAdvertisements: 0,
  publishedAdvertisements: 0
 });
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  fetchStats();
 }, []);

 const fetchStats = async () => {
  try {
   // Psikolog istatistikleri
   const psychologistsRes = await fetch('/api/psychologists?limit=1000');
   const psychologistsData = await psychologistsRes.json();
   const psychologists = psychologistsData.data || [];

   // Randevu istatistikleri
   const appointmentsRes = await fetch('/api/appointments?limit=1000');
   const appointmentsData = await appointmentsRes.json();
   const appointments = appointmentsData.data || [];

   // Reklam istatistikleri
   const advertisementsRes = await fetch('/api/advertisements?status=published&limit=1000');
   const advertisementsData = await advertisementsRes.json();
   const advertisements = advertisementsData.data || [];

   setStats({
    totalPsychologists: psychologists.length,
    approvedPsychologists: psychologists.filter(p => p.isApproved).length,
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter(a => a.status === 'pending').length,
    totalAdvertisements: advertisements.length,
    publishedAdvertisements: advertisements.filter(a => a.status === 'published').length
   });
  } catch (error) {
   console.error('Fetch stats error:', error);
  } finally {
   setLoading(false);
  }
 };

 const statCards = [
  {
   title: 'Toplam Psikolog',
   value: stats.totalPsychologists,
   subtitle: `${stats.approvedPsychologists} onaylı`,
   icon: FaUsers,
   color: 'bg-blue-500'
  },
  {
   title: 'Toplam Randevu',
   value: stats.totalAppointments,
   subtitle: `${stats.pendingAppointments} bekliyor`,
   icon: FaCalendar,
   color: 'bg-green-500'
  },
  {
   title: 'Reklamlar',
   value: stats.totalAdvertisements,
   subtitle: `${stats.publishedAdvertisements} yayında`,
   icon: FaBullhorn,
   color: 'bg-purple-500'
  },
  {
   title: 'Sistem Durumu',
   value: 'Aktif',
   subtitle: 'Her şey normal',
   icon: FaCheckCircle,
   color: 'bg-orange-500'
  }
 ];

 if (loading) {
  return <div className="text-center py-10">Yükleniyor...</div>;
 }

 return (
  <div>
   <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

   {/* İstatistik Kartları */}
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {statCards.map((card, index) => (
     <div key={index} className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
       <div className={`${card.color} p-3 rounded-lg`}>
        <card.icon className="text-white text-2xl" />
       </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
      <p className="text-3xl font-bold text-gray-800 mb-1">{card.value}</p>
      <p className="text-sm text-gray-500">{card.subtitle}</p>
     </div>
    ))}
   </div>

   {/* Hızlı Erişim */}
   <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-bold mb-4">Hızlı Erişim</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
     <a
      href="/admin/psychologists"
      className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition"
     >
      <FaUsers className="text-3xl text-blue-500 mb-2" />
      <h3 className="font-semibold">Psikolog Yönetimi</h3>
      <p className="text-sm text-gray-600">Psikologları görüntüle ve yönet</p>
     </a>
     <a
      href="/admin/appointments"
      className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 transition"
     >
      <FaCalendar className="text-3xl text-green-500 mb-2" />
      <h3 className="font-semibold">Randevu Yönetimi</h3>
      <p className="text-sm text-gray-600">Randevuları görüntüle ve yönet</p>
     </a>
     <a
      href="/admin/advertisements"
      className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 transition"
     >
      <FaBullhorn className="text-3xl text-purple-500 mb-2" />
      <h3 className="font-semibold">Reklam Yönetimi</h3>
      <p className="text-sm text-gray-600">Blog ve duyuruları yönet</p>
     </a>
    </div>
   </div>
  </div>
 );
}

