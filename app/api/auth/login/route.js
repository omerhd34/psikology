import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request) {
 try {
  const { email, password } = await request.json();

  // Validasyon
  if (!email || !password) {
   return NextResponse.json(
    { error: 'Email ve şifre gereklidir' },
    { status: 400 }
   );
  }

  // Veritabanı bağlantısı
  await connectDB();

  // Kullanıcıyı bul
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
   return NextResponse.json(
    { error: 'Geçersiz email veya şifre' },
    { status: 401 }
   );
  }

  // Şifre kontrolü
  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
   return NextResponse.json(
    { error: 'Geçersiz email veya şifre' },
    { status: 401 }
   );
  }

  // Aktif kontrol
  if (!user.isActive) {
   return NextResponse.json(
    { error: 'Hesabınız aktif değil' },
    { status: 403 }
   );
  }

  // Son giriş zamanını güncelle
  user.lastLogin = new Date();
  await user.save();

  // Token oluştur
  const token = generateToken({
   userId: user._id,
   email: user.email,
   role: user.role
  });

  // Response oluştur
  const response = NextResponse.json({
   success: true,
   message: 'Giriş başarılı',
   user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
   }
  });

  // Cookie ayarla
  response.cookies.set('auth-token', token, {
   httpOnly: true,
   secure: process.env.NODE_ENV === 'production',
   sameSite: 'lax',
   maxAge: 7 * 24 * 60 * 60 // 7 gün
  });

  return response;
 } catch (error) {
  console.error('Login error:', error);
  return NextResponse.json(
   { error: 'Giriş yapılırken bir hata oluştu' },
   { status: 500 }
  );
 }
}

