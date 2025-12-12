import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import Psychologist from '@/models/Psychologist';
import { getTokenFromCookie, verifyToken } from '@/lib/auth';

// Randevuları getir
export async function GET(request) {
 try {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const psychologistId = searchParams.get('psychologistId');
  const status = searchParams.get('status');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const skip = (page - 1) * limit;

  // Filtreler
  const filter = {};
  if (psychologistId) {
   filter.psychologistId = psychologistId;
  }
  if (status) {
   filter.status = status;
  }
  if (startDate || endDate) {
   filter.appointmentDate = {};
   if (startDate) {
    filter.appointmentDate.$gte = new Date(startDate);
   }
   if (endDate) {
    filter.appointmentDate.$lte = new Date(endDate);
   }
  }

  const appointments = await Appointment.find(filter)
   .populate('psychologistId', 'fullName email phone')
   .sort({ appointmentDate: 1, appointmentTime: 1 })
   .skip(skip)
   .limit(limit);

  const total = await Appointment.countDocuments(filter);

  return NextResponse.json({
   success: true,
   data: appointments,
   pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
   }
  });
 } catch (error) {
  console.error('Get appointments error:', error);
  return NextResponse.json(
   { error: 'Randevular getirilirken hata oluştu' },
   { status: 500 }
  );
 }
}

// Yeni randevu oluştur
export async function POST(request) {
 try {
  await connectDB();

  const data = await request.json();

  // Validasyon
  if (!data.psychologistId || !data.clientName || !data.clientEmail ||
   !data.clientPhone || !data.appointmentDate || !data.appointmentTime) {
   return NextResponse.json(
    { error: 'Gerekli alanlar eksik' },
    { status: 400 }
   );
  }

  // Psikolog kontrolü
  const psychologist = await Psychologist.findById(data.psychologistId);
  if (!psychologist) {
   return NextResponse.json(
    { error: 'Psikolog bulunamadı' },
    { status: 404 }
   );
  }

  if (!psychologist.isActive || !psychologist.isApproved) {
   return NextResponse.json(
    { error: 'Bu psikolog şu anda randevu kabul etmiyor' },
    { status: 400 }
   );
  }

  // Aynı saatte başka randevu var mı kontrol et
  const existingAppointment = await Appointment.findOne({
   psychologistId: data.psychologistId,
   appointmentDate: new Date(data.appointmentDate),
   appointmentTime: data.appointmentTime,
   status: { $nin: ['cancelled'] }
  });

  if (existingAppointment) {
   return NextResponse.json(
    { error: 'Bu saat için zaten bir randevu mevcut' },
    { status: 409 }
   );
  }

  // Fiyat bilgisini ekle
  data.price = data.price || psychologist.sessionPrice;
  data.duration = data.duration || psychologist.sessionDuration;

  // Randevu oluştur
  const appointment = await Appointment.create(data);

  // Psikolog toplam seans sayısını güncelle
  psychologist.totalSessions += 1;
  await psychologist.save();

  return NextResponse.json({
   success: true,
   message: 'Randevu başarıyla oluşturuldu',
   data: appointment
  }, { status: 201 });
 } catch (error) {
  console.error('Create appointment error:', error);
  return NextResponse.json(
   { error: 'Randevu oluşturulurken hata oluştu' },
   { status: 500 }
  );
 }
}

