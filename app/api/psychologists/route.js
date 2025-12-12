import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Psychologist from '@/models/Psychologist';
import { getTokenFromCookie, verifyToken } from '@/lib/auth';

// Tüm psikologları getir (public)
export async function GET(request) {
 try {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const approved = searchParams.get('approved');

  const skip = (page - 1) * limit;

  // Filtreler
  const filter = {};
  if (approved !== null && approved !== undefined) {
   filter.isApproved = approved === 'true';
  }
  if (search) {
   filter.$or = [
    { fullName: { $regex: search, $options: 'i' } },
    { specializations: { $regex: search, $options: 'i' } }
   ];
  }

  const psychologists = await Psychologist.find(filter)
   .sort({ createdAt: -1 })
   .skip(skip)
   .limit(limit)
   .select('-__v');

  const total = await Psychologist.countDocuments(filter);

  return NextResponse.json({
   success: true,
   data: psychologists,
   pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
   }
  });
 } catch (error) {
  console.error('Get psychologists error:', error);
  return NextResponse.json(
   { error: 'Psikologlar getirilirken hata oluştu' },
   { status: 500 }
  );
 }
}

// Yeni psikolog oluştur (admin only)
export async function POST(request) {
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

  const data = await request.json();

  // Validasyon
  if (!data.userId || !data.fullName || !data.email) {
   return NextResponse.json(
    { error: 'Gerekli alanlar eksik' },
    { status: 400 }
   );
  }

  // Psikolog oluştur
  const psychologist = await Psychologist.create(data);

  return NextResponse.json({
   success: true,
   message: 'Psikolog başarıyla oluşturuldu',
   data: psychologist
  }, { status: 201 });
 } catch (error) {
  console.error('Create psychologist error:', error);
  return NextResponse.json(
   { error: 'Psikolog oluşturulurken hata oluştu' },
   { status: 500 }
  );
 }
}

