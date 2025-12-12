import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { getTokenFromCookie, verifyToken } from '@/lib/auth';

export async function GET(request) {
 try {
  // Token al
  const token = getTokenFromCookie(request);
  if (!token) {
   return NextResponse.json(
    { error: 'Yetkisiz erişim' },
    { status: 401 }
   );
  }

  // Token'ı doğrula
  const decoded = verifyToken(token);
  if (!decoded) {
   return NextResponse.json(
    { error: 'Geçersiz token' },
    { status: 401 }
   );
  }

  // Veritabanı bağlantısı
  await connectDB();

  // Kullanıcıyı bul
  const user = await User.findById(decoded.userId).select('-password');
  if (!user) {
   return NextResponse.json(
    { error: 'Kullanıcı bulunamadı' },
    { status: 404 }
   );
  }

  return NextResponse.json({
   success: true,
   user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive
   }
  });
 } catch (error) {
  console.error('Get user error:', error);
  return NextResponse.json(
   { error: 'Kullanıcı bilgileri alınırken hata oluştu' },
   { status: 500 }
  );
 }
}

