import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export function middleware(request) {
 const { pathname } = request.nextUrl;

 // Public routes
 const publicRoutes = ['/', '/login', '/register', '/contact'];
 const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/api/auth/login') || pathname.startsWith('/api/auth/register'));

 // Admin routes
 const isAdminRoute = pathname.startsWith('/admin');

 // API routes
 const isProtectedAPI = pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/');

 // Token kontrolü
 const token = request.cookies.get('auth-token')?.value;
 let user = null;

 if (token) {
  user = verifyToken(token);
 }

 // Giriş yapmış kullanıcı login/register sayfasına gelirse yönlendir
 if (user && (pathname === '/login' || pathname === '/register')) {
  if (user.role === 'admin') {
   return NextResponse.redirect(new URL('/admin', request.url));
  } else if (user.role === 'psychologist') {
   return NextResponse.redirect(new URL('/dashboard', request.url));
  } else {
   return NextResponse.redirect(new URL('/', request.url));
  }
 }

 // Admin route kontrolü
 if (isAdminRoute) {
  if (!user) {
   return NextResponse.redirect(new URL('/login', request.url));
  }
  if (user.role !== 'admin') {
   return NextResponse.redirect(new URL('/', request.url));
  }
 }

 // Protected API kontrolü
 if (isProtectedAPI && !user) {
  return NextResponse.json(
   { error: 'Yetkisiz erişim. Lütfen giriş yapın.' },
   { status: 401 }
  );
 }

 return NextResponse.next();
}

export const config = {
 matcher: [
  '/admin/:path*',
  '/api/:path*',
  '/((?!_next/static|_next/image|favicon.ico|public).*)',
 ],
};

