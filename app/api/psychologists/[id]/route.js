import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Psychologist from '@/models/Psychologist';
import { getTokenFromCookie, verifyToken } from '@/lib/auth';

// Tek psikolog getir
export async function GET(request, { params }) {
 try {
  await connectDB();

  const psychologist = await Psychologist.findById(params.id);
  if (!psychologist) {
   return NextResponse.json(
    { error: 'Psikolog bulunamadı' },
    { status: 404 }
   );
  }

  return NextResponse.json({
   success: true,
   data: psychologist
  });
 } catch (error) {
  console.error('Get psychologist error:', error);
  return NextResponse.json(
   { error: 'Psikolog getirilirken hata oluştu' },
   { status: 500 }
  );
 }
}

// Psikolog güncelle
export async function PUT(request, { params }) {
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
  if (!user) {
   return NextResponse.json(
    { error: 'Geçersiz token' },
    { status: 401 }
   );
  }

  await connectDB();

  const data = await request.json();

  // Psikolog kontrolü
  const psychologist = await Psychologist.findById(params.id);
  if (!psychologist) {
   return NextResponse.json(
    { error: 'Psikolog bulunamadı' },
    { status: 404 }
   );
  }

  // Yetki kontrolü (admin veya kendi profili)
  if (user.role !== 'admin' && psychologist.userId.toString() !== user.userId) {
   return NextResponse.json(
    { error: 'Bu işlem için yetkiniz yok' },
    { status: 403 }
   );
  }

  // Güncelle
  const updatedPsychologist = await Psychologist.findByIdAndUpdate(
   params.id,
   data,
   { new: true, runValidators: true }
  );

  return NextResponse.json({
   success: true,
   message: 'Psikolog başarıyla güncellendi',
   data: updatedPsychologist
  });
 } catch (error) {
  console.error('Update psychologist error:', error);
  return NextResponse.json(
   { error: 'Psikolog güncellenirken hata oluştu' },
   { status: 500 }
  );
 }
}

// Psikolog sil
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

  const psychologist = await Psychologist.findByIdAndDelete(params.id);
  if (!psychologist) {
   return NextResponse.json(
    { error: 'Psikolog bulunamadı' },
    { status: 404 }
   );
  }

  return NextResponse.json({
   success: true,
   message: 'Psikolog başarıyla silindi'
  });
 } catch (error) {
  console.error('Delete psychologist error:', error);
  return NextResponse.json(
   { error: 'Psikolog silinirken hata oluştu' },
   { status: 500 }
  );
 }
}

