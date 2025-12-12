import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-this';

// Şifre hash'leme
export async function hashPassword(password) {
 const salt = await bcrypt.genSalt(10);
 return await bcrypt.hash(password, salt);
}

// Şifre doğrulama
export async function verifyPassword(password, hashedPassword) {
 return await bcrypt.compare(password, hashedPassword);
}

// JWT Token oluşturma
export function generateToken(payload) {
 return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// JWT Token doğrulama
export function verifyToken(token) {
 try {
  return jwt.verify(token, JWT_SECRET);
 } catch (error) {
  return null;
 }
}

// Cookie'den token alma
export function getTokenFromCookie(request) {
 const authHeader = request.headers.get('authorization');
 if (authHeader && authHeader.startsWith('Bearer ')) {
  return authHeader.substring(7);
 }

 const cookieHeader = request.headers.get('cookie');
 if (cookieHeader) {
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
   const [key, value] = cookie.trim().split('=');
   acc[key] = value;
   return acc;
  }, {});
  return cookies['auth-token'];
 }

 return null;
}

// Kullanıcı yetkisi kontrolü
export function checkRole(user, allowedRoles) {
 if (!user || !user.role) return false;
 return allowedRoles.includes(user.role);
}

