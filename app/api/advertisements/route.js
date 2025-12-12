import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Advertisement from '@/models/Advertisement';
import { getTokenFromCookie, verifyToken } from '@/lib/auth';

// Reklamları getir (public)
export async function GET(request) {
 try {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const category = searchParams.get('category');
  const status = searchParams.get('status') || 'published';
  const featured = searchParams.get('featured');
  const search = searchParams.get('search');

  const skip = (page - 1) * limit;

  // Filtreler
  const filter = { status };
  if (category) {
   filter.category = category;
  }
  if (featured !== null && featured !== undefined) {
   filter.featured = featured === 'true';
  }
  if (search) {
   filter.$or = [
    { title: { $regex: search, $options: 'i' } },
    { content: { $regex: search, $options: 'i' } },
    { tags: { $regex: search, $options: 'i' } }
   ];
  }

  const advertisements = await Advertisement.find(filter)
   .sort({ publishDate: -1 })
   .skip(skip)
   .limit(limit)
   .select('-__v');

  const total = await Advertisement.countDocuments(filter);

  return NextResponse.json({
   success: true,
   data: advertisements,
   pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
   }
  });
 } catch (error) {
  console.error('Get advertisements error:', error);
  return NextResponse.json(
   { error: 'Reklamlar getirilirken hata oluştu' },
   { status: 500 }
  );
 }
}

// Yeni reklam oluştur (admin only)
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
  if (!data.title || !data.content) {
   return NextResponse.json(
    { error: 'Başlık ve içerik gereklidir' },
    { status: 400 }
   );
  }

  // Slug oluştur
  if (!data.slug) {
   data.slug = data.title
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  }

  // Slug kontrolü
  const existingAd = await Advertisement.findOne({ slug: data.slug });
  if (existingAd) {
   data.slug = `${data.slug}-${Date.now()}`;
  }

  // Author bilgisi ekle
  data.author = user.userId;

  // Reklam oluştur
  const advertisement = await Advertisement.create(data);

  return NextResponse.json({
   success: true,
   message: 'Reklam başarıyla oluşturuldu',
   data: advertisement
  }, { status: 201 });
 } catch (error) {
  console.error('Create advertisement error:', error);
  return NextResponse.json(
   { error: 'Reklam oluşturulurken hata oluştu' },
   { status: 500 }
  );
 }
}

