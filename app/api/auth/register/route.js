import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Psychologist from '@/models/Psychologist';
import { hashPassword } from '@/lib/auth';

export async function POST(request) {
 try {
  const { name, email, password, role, phone } = await request.json();

  // Validasyon
  if (!name || !email || !password) {
   return NextResponse.json(
    { error: 'Tüm alanlar gereklidir' },
    { status: 400 }
   );
  }

  if (password.length < 6) {
   return NextResponse.json(
    { error: 'Şifre en az 6 karakter olmalıdır' },
    { status: 400 }
   );
  }

  // Email formatı kontrolü
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
   return NextResponse.json(
    { error: 'Geçerli bir email adresi giriniz' },
    { status: 400 }
   );
  }

  // Veritabanı bağlantısı
  await connectDB();

  // Email kontrolü
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
   return NextResponse.json(
    { error: 'Bu email adresi zaten kullanılıyor' },
    { status: 409 }
   );
  }

  // Şifreyi hash'le
  const hashedPassword = await hashPassword(password);

  // Kullanıcı oluştur
  const user = await User.create({
   name,
   email: email.toLowerCase(),
   password: hashedPassword,
   role: role || 'user'
  });

  // Eğer psikolog olarak kayıt olduysa, otomatik profil oluştur
  if (role === 'psychologist') {
   await Psychologist.create({
    name,
    email: email.toLowerCase(),
    phone: phone || '',
    specialties: [],
    about: 'Profilinizi tamamlamak için lütfen dashboard\'dan bilgilerinizi güncelleyin.',
    education: [],
    experience: [],
    sessionFee: 0,
    availableDays: [],
    availableHours: { start: '09:00', end: '17:00' },
    rating: 0,
    totalSessions: 0,
    userId: user._id
   });
  }

  return NextResponse.json({
   success: true,
   message: role === 'psychologist'
    ? 'Psikolog hesabınız oluşturuldu! Giriş yaparak profilinizi tamamlayabilirsiniz.'
    : 'Kayıt başarılı',
   user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
   }
  }, { status: 201 });
 } catch (error) {
  console.error('Register error:', error);
  return NextResponse.json(
   { error: 'Kayıt yapılırken bir hata oluştu' },
   { status: 500 }
  );
 }
}

