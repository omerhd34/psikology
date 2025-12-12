import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Advertisement from '@/models/Advertisement';
import { getTokenFromCookie, verifyToken } from '@/lib/auth';

// Tek reklam getir (slug veya id ile)
export async function GET(request, { params }) {
 try {
  await connectDB();

  let advertisement;

  // ID veya slug kontrolü
  if (params.id.match(/^[0-9a-fA-F]{24}$/)) {
   // MongoDB ObjectId
   advertisement = await Advertisement.findById(params.id);
  } else {
   // Slug
   advertisement = await Advertisement.findOne({ slug: params.id });
  }

  if (!advertisement) {
   return NextResponse.json(
    { error: 'Reklam bulunamadı' },
    { status: 404 }
   );
  }

  // Görüntülenme sayısını artır
  advertisement.viewCount += 1;
  await advertisement.save();

  return NextResponse.json({
   success: true,
   data: advertisement
  });
 } catch (error) {
  console.error('Get advertisement error:', error);
  return NextResponse.json(
   { error: 'Reklam getirilirken hata oluştu' },
   { status: 500 }
  );
 }
}

// Reklam güncelle (admin only)
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
  if (!user || user.role !== 'admin') {
   return NextResponse.json(
    { error: 'Bu işlem için yetkiniz yok' },
    { status: 403 }
   );
  }

  await connectDB();

  const data = await request.json();

  const advertisement = await Advertisement.findById(params.id);
  if (!advertisement) {
   return NextResponse.json(
    { error: 'Reklam bulunamadı' },
    { status: 404 }
   );
  }

  const updatedAdvertisement = await Advertisement.findByIdAndUpdate(
   params.id,
   data,
   { new: true, runValidators: true }
  );

  return NextResponse.json({
   success: true,
   message: 'Reklam başarıyla güncellendi',
   data: updatedAdvertisement
  });
 } catch (error) {
  console.error('Update advertisement error:', error);
  return NextResponse.json(
   { error: 'Reklam güncellenirken hata oluştu' },
   { status: 500 }
  );
 }
}

// Reklam sil (admin only)
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

  const advertisement = await Advertisement.findByIdAndDelete(params.id);
  if (!advertisement) {
   return NextResponse.json(
    { error: 'Reklam bulunamadı' },
    { status: 404 }
   );
  }

  return NextResponse.json({
   success: true,
   message: 'Reklam başarıyla silindi'
  });
 } catch (error) {
  console.error('Delete advertisement error:', error);
  return NextResponse.json(
   { error: 'Reklam silinirken hata oluştu' },
   { status: 500 }
  );
 }
}

