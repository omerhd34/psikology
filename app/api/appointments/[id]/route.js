import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import { getTokenFromCookie, verifyToken } from '@/lib/auth';

// Tek randevu getir
export async function GET(request, { params }) {
 try {
  await connectDB();

  const appointment = await Appointment.findById(params.id)
   .populate('psychologistId', 'fullName email phone');

  if (!appointment) {
   return NextResponse.json(
    { error: 'Randevu bulunamadı' },
    { status: 404 }
   );
  }

  return NextResponse.json({
   success: true,
   data: appointment
  });
 } catch (error) {
  console.error('Get appointment error:', error);
  return NextResponse.json(
   { error: 'Randevu getirilirken hata oluştu' },
   { status: 500 }
  );
 }
}

// Randevu güncelle
export async function PUT(request, { params }) {
 try {
  // Token kontrolü (opsiyonel - admin veya psikolog için)
  const token = getTokenFromCookie(request);
  const user = token ? verifyToken(token) : null;

  await connectDB();

  const data = await request.json();

  const appointment = await Appointment.findById(params.id);
  if (!appointment) {
   return NextResponse.json(
    { error: 'Randevu bulunamadı' },
    { status: 404 }
   );
  }

  // Status güncellemesi için yetki kontrolü
  if (data.status && user) {
   if (user.role !== 'admin') {
    return NextResponse.json(
     { error: 'Bu işlem için yetkiniz yok' },
     { status: 403 }
    );
   }
  }

  const updatedAppointment = await Appointment.findByIdAndUpdate(
   params.id,
   data,
   { new: true, runValidators: true }
  ).populate('psychologistId', 'fullName email phone');

  return NextResponse.json({
   success: true,
   message: 'Randevu başarıyla güncellendi',
   data: updatedAppointment
  });
 } catch (error) {
  console.error('Update appointment error:', error);
  return NextResponse.json(
   { error: 'Randevu güncellenirken hata oluştu' },
   { status: 500 }
  );
 }
}

// Randevu sil
export async function DELETE(request, { params }) {
 try {
  // Token kontrolü
  const token = getTokenFromCookie(request);
  if (!token) {
   return NextResponse.json(
    { error: 'Yetkisiz erişim' },
    { status: 401 }
   );
  }

  const user = verifyToken(token);
  if (!user || user.role !== 'admin') {
   return NextResponse.json(
    { error: 'Bu işlem için yetkiniz yok' },
    { status: 403 }
   );
  }

  await connectDB();

  const appointment = await Appointment.findByIdAndDelete(params.id);
  if (!appointment) {
   return NextResponse.json(
    { error: 'Randevu bulunamadı' },
    { status: 404 }
   );
  }

  return NextResponse.json({
   success: true,
   message: 'Randevu başarıyla silindi'
  });
 } catch (error) {
  console.error('Delete appointment error:', error);
  return NextResponse.json(
   { error: 'Randevu silinirken hata oluştu' },
   { status: 500 }
  );
 }
}

