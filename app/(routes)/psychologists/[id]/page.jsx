'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaStar, FaEnvelope, FaPhone, FaCalendar } from 'react-icons/fa';

export default function PsychologistDetailPage() {
 const params = useParams();
 const router = useRouter();
 const [psychologist, setPsychologist] = useState(null);
 const [loading, setLoading] = useState(true);
 const [showAppointmentForm, setShowAppointmentForm] = useState(false);
 const [appointmentData, setAppointmentData] = useState({
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  appointmentDate: '',
  appointmentTime: '',
  sessionType: 'online',
  notes: ''
 });
 const [submitting, setSubmitting] = useState(false);

 useEffect(() => {
  if (params.id) {
   fetchPsychologist();
  }
 }, [params.id]);

 const fetchPsychologist = async () => {
  try {
   const response = await fetch(`/api/psychologists/${params.id}`);
   const data = await response.json();
   if (data.success) {
    setPsychologist(data.data);
   }
  } catch (error) {
   console.error('Fetch error:', error);
  } finally {
   setLoading(false);
  }
 };

 const handleAppointmentSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  try {
   const response = await fetch('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
     ...appointmentData,
     psychologistId: params.id
    })
   });

   const data = await response.json();

   if (response.ok) {
    alert('Randevu talebiniz başarıyla oluşturuldu! En kısa sürede size dönüş yapılacaktır.');
    setShowAppointmentForm(false);
    setAppointmentData({
     clientName: '',
     clientEmail: '',
     clientPhone: '',
     appointmentDate: '',
     appointmentTime: '',
     sessionType: 'online',
     notes: ''
    });
   } else {
    alert(data.error || 'Randevu oluşturulamadı');
   }
  } catch (error) {
   console.error('Appointment error:', error);
   alert('Bir hata oluştu. Lütfen tekrar deneyin.');
  } finally {
   setSubmitting(false);
  }
 };

 if (loading) {
  return (
   <div className="min-h-screen flex items-center justify-center">
    <div className="text-xl">Yükleniyor...</div>
   </div>
  );
 }

 if (!psychologist) {
  return (
   <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
     <h2 className="text-2xl font-bold mb-4">Psikolog bulunamadı</h2>
     <Link href="/psychologists" className="text-blue-600 hover:text-blue-700">
      Psikologlar listesine dön
     </Link>
    </div>
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-gray-50 pt-20">

   <div className=" mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
     {/* Sol Panel - Profil Bilgileri */}
     <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
       <img
        src={psychologist.profilePhoto}
        alt={psychologist.fullName}
        className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
       />
       <h1 className="text-2xl font-bold text-center mb-2">
        {psychologist.fullName}
       </h1>
       <p className="text-center text-gray-600 mb-4">{psychologist.title}</p>

       <div className="flex items-center justify-center gap-2 mb-4">
        <FaStar className="text-yellow-500" />
        <span className="font-semibold text-lg">{psychologist.rating || 5.0}</span>
        <span className="text-gray-500">({psychologist.totalSessions} seans)</span>
       </div>

       {psychologist.sessionPrice > 0 && (
        <div className="text-center mb-4">
         <p className="text-2xl font-bold text-blue-600">
          ₺{psychologist.sessionPrice}
         </p>
         <p className="text-sm text-gray-500">Seans ücreti</p>
        </div>
       )}

       <div className="space-y-3 mb-6">
        {psychologist.email && (
         <div className="flex items-center gap-2 text-sm">
          <FaEnvelope className="text-gray-400" />
          <span>{psychologist.email}</span>
         </div>
        )}
        {psychologist.phone && (
         <div className="flex items-center gap-2 text-sm">
          <FaPhone className="text-gray-400" />
          <span>{psychologist.phone}</span>
         </div>
        )}
       </div>

       <button
        onClick={() => setShowAppointmentForm(true)}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
       >
        <FaCalendar /> Randevu Al
       </button>
      </div>
     </div>

     {/* Sağ Panel - Detaylı Bilgiler */}
     <div className="lg:col-span-2 space-y-6">
      {/* Hakkında */}
      {psychologist.bio && (
       <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Hakkında</h2>
        <p className="text-gray-700 whitespace-pre-line">{psychologist.bio}</p>
       </div>
      )}

      {/* Uzmanlık Alanları */}
      {psychologist.specializations && psychologist.specializations.length > 0 && (
       <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Uzmanlık Alanları</h2>
        <div className="flex flex-wrap gap-2">
         {psychologist.specializations.map((spec, idx) => (
          <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
           {spec}
          </span>
         ))}
        </div>
       </div>
      )}

      {/* Eğitim */}
      {psychologist.education && psychologist.education.length > 0 && (
       <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Eğitim</h2>
        <div className="space-y-3">
         {psychologist.education.map((edu, idx) => (
          <div key={idx} className="border-l-4 border-blue-600 pl-4">
           <h3 className="font-semibold">{edu.degree}</h3>
           <p className="text-gray-600">{edu.institution}</p>
           <p className="text-sm text-gray-500">{edu.year}</p>
          </div>
         ))}
        </div>
       </div>
      )}

      {/* Deneyim */}
      {psychologist.experience && psychologist.experience.length > 0 && (
       <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Deneyim</h2>
        <div className="space-y-4">
         {psychologist.experience.map((exp, idx) => (
          <div key={idx} className="border-l-4 border-green-600 pl-4">
           <h3 className="font-semibold">{exp.position}</h3>
           <p className="text-gray-600">{exp.organization}</p>
           <p className="text-sm text-gray-500">
            {exp.startYear} - {exp.endYear || 'Devam ediyor'}
           </p>
           {exp.description && (
            <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
           )}
          </div>
         ))}
        </div>
       </div>
      )}
     </div>
    </div>
   </div>

   {/* Randevu Formu Modal */}
   {showAppointmentForm && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
     <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Randevu Al</h2>
        <button
         onClick={() => setShowAppointmentForm(false)}
         className="text-gray-500 hover:text-gray-700 text-2xl"
        >
         ×
        </button>
       </div>

       <form onSubmit={handleAppointmentSubmit} className="space-y-4">
        <div>
         <label className="block text-sm font-medium mb-2">Ad Soyad *</label>
         <input
          type="text"
          value={appointmentData.clientName}
          onChange={(e) => setAppointmentData({ ...appointmentData, clientName: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          required
         />
        </div>

        <div>
         <label className="block text-sm font-medium mb-2">Email *</label>
         <input
          type="email"
          value={appointmentData.clientEmail}
          onChange={(e) => setAppointmentData({ ...appointmentData, clientEmail: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          required
         />
        </div>

        <div>
         <label className="block text-sm font-medium mb-2">Telefon *</label>
         <input
          type="tel"
          value={appointmentData.clientPhone}
          onChange={(e) => setAppointmentData({ ...appointmentData, clientPhone: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          required
         />
        </div>

        <div className="grid grid-cols-2 gap-4">
         <div>
          <label className="block text-sm font-medium mb-2">Tarih *</label>
          <input
           type="date"
           value={appointmentData.appointmentDate}
           onChange={(e) => setAppointmentData({ ...appointmentData, appointmentDate: e.target.value })}
           className="w-full px-4 py-2 border rounded-lg"
           min={new Date().toISOString().split('T')[0]}
           required
          />
         </div>

         <div>
          <label className="block text-sm font-medium mb-2">Saat *</label>
          <input
           type="time"
           value={appointmentData.appointmentTime}
           onChange={(e) => setAppointmentData({ ...appointmentData, appointmentTime: e.target.value })}
           className="w-full px-4 py-2 border rounded-lg"
           required
          />
         </div>
        </div>

        <div>
         <label className="block text-sm font-medium mb-2">Seans Tipi *</label>
         <select
          value={appointmentData.sessionType}
          onChange={(e) => setAppointmentData({ ...appointmentData, sessionType: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
         >
          <option value="online">Online</option>
          <option value="in-person">Yüz Yüze</option>
         </select>
        </div>

        <div>
         <label className="block text-sm font-medium mb-2">Notlar (Opsiyonel)</label>
         <textarea
          value={appointmentData.notes}
          onChange={(e) => setAppointmentData({ ...appointmentData, notes: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          rows="3"
          placeholder="Randevunuzla ilgili eklemek istediğiniz notlar..."
         ></textarea>
        </div>

        <div className="flex gap-4">
         <button
          type="button"
          onClick={() => setShowAppointmentForm(false)}
          className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition"
         >
          İptal
         </button>
         <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
         >
          {submitting ? 'Gönderiliyor...' : 'Randevu Oluştur'}
         </button>
        </div>
       </form>
      </div>
     </div>
    </div>
   )}

  </div>
 );
}

