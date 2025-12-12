'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button.jsx';
import Container from '@/components/ui/Container.jsx';
import {
 FaBrain,
 FaBars,
 FaTimes,
 FaChevronDown,
 FaUser,
 FaUserMd,
 FaShieldAlt,
 FaSignOutAlt,
 FaCalendarAlt
} from 'react-icons/fa';

export default function Header() {
 const router = useRouter();
 const pathname = usePathname();

 const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(true);
 const [mobileOpen, setMobileOpen] = useState(false);
 const [profileOpen, setProfileOpen] = useState(false);
 const [scrolled, setScrolled] = useState(false);

 const profileRef = useRef(null);

 useEffect(() => {
  checkAuth();
  const onScroll = () => setScrolled(window.scrollY > 8);
  const clickOutside = (e) => {
   if (profileRef.current && !profileRef.current.contains(e.target)) {
    setProfileOpen(false);
   }
  };
  window.addEventListener('scroll', onScroll);
  document.addEventListener('mousedown', clickOutside);
  return () => {
   window.removeEventListener('scroll', onScroll);
   document.removeEventListener('mousedown', clickOutside);
  };
 }, []);

 useEffect(() => {
  setMobileOpen(false);
  setProfileOpen(false);
 }, [pathname]);

 const checkAuth = async () => {
  try {
   const res = await fetch('/api/auth/me');
   if (res.ok) {
    const data = await res.json();
    setUser(data.user);
   }
  } catch (err) {
   console.error(err);
  } finally {
   setLoading(false);
  }
 };

 const logout = async () => {
  try {
   await fetch('/api/auth/logout', { method: 'POST' });
   setUser(null);
   router.push('/');
   router.refresh();
  } catch (err) {
   console.error(err);
  }
 };

 const navLinks = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'Psikologlar', href: '/psychologists' },
  { name: 'Blog', href: '/blog' },
  { name: 'İletişim', href: '/contact' },
 ];

 return (
  <nav
   className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 mx-auto
        ${scrolled
     ? 'bg-white/95 backdrop-blur-sm shadow-md border-b border-slate-200/60'
     : 'bg-white/80 backdrop-blur-none border-b border-slate-200/30'
    }`}
   style={{ WebkitBackdropFilter: scrolled ? 'blur(6px)' : 'none' }}
  >
   <Container className="flex items-center justify-between h-20">

    {/* LOGO */}
    <Link href="/" className="flex items-center gap-3">
     <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-900 text-white shadow-md">
      <FaBrain size={20} />
     </div>

     <span className="text-lg font-semibold text-slate-900">
      Psikoloji Portalı
     </span>
    </Link>

    {/* DESKTOP NAV */}
    <div className="hidden md:flex items-center gap-6">
     {navLinks.map((link) => (
      <Link
       key={link.name}
       href={link.href}
       className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-150
                  ${pathname === link.href
         ? 'bg-slate-100 text-slate-900 shadow-sm'
         : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}
                `}
      >
       {link.name}
      </Link>
     ))}
    </div>

    {/* RIGHT SIDE */}
    <div className="flex items-center gap-4">
     {!loading && (
      <>
       {user ? (
        <div className="relative" ref={profileRef}>
         <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-3 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition"
         >
          <div className="h-9 w-9 rounded-full flex items-center justify-center bg-linear-to-br from-blue-500 to-purple-500 text-white font-semibold">
           {user.name?.charAt(0).toUpperCase() || <FaUser size={14} />}
          </div>

          <span className="hidden md:block text-sm font-medium text-slate-700">
           {user.name?.split(' ')[0]}
          </span>

          <FaChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
         </button>

         {profileOpen && (
          <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-lg shadow-xl">
           <div className="p-4 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate mt-1">{user.email}</p>
           </div>

           <div className="p-2">
            {user.role === 'psychologist' && (
             <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 text-sm">
              <FaUserMd className="text-slate-500" /> Panelim
             </Link>
            )}

            {user.role === 'admin' && (
             <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 text-sm">
              <FaShieldAlt className="text-slate-500" /> Yönetim
             </Link>
            )}

            <Link href="/appointments" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 text-sm">
             <FaCalendarAlt className="text-slate-500" /> Randevularım
            </Link>
           </div>

           <div className="p-2 border-t border-slate-100">
            <button onClick={logout} className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50">
             <FaSignOutAlt /> Çıkış Yap
            </button>
           </div>
          </div>
         )}
        </div>
       ) : (
        <div className="hidden md:flex items-center gap-3">
         <Button variant="ghost" className="px-5 py-2 text-sm" asChild>
          <Link href="/login">Giriş Yap</Link>
         </Button>
         <Button className="px-5 py-2 text-sm shadow-md rounded-md" asChild>
          <Link href="/register">Kayıt Ol</Link>
         </Button>
        </div>
       )}
      </>
     )}

     {/* MOBILE BUTTON */}
     <button
      onClick={() => setMobileOpen(!mobileOpen)}
      className="md:hidden p-2 rounded-md hover:bg-slate-100 transition"
      aria-label="toggle menu"
     >
      {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
     </button>
    </div>
   </Container>


   {/* MOBILE MENU */}
   {mobileOpen && (
    <div className="md:hidden bg-white border-t border-slate-200">
     <Container className="py-3">
      <div className="space-y-2">
       {navLinks.map((link) => (
        <Link
         key={link.name}
         href={link.href}
         className={`block px-4 py-3 rounded-md text-base transition
                    ${pathname === link.href ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50'}`}
        >
         {link.name}
        </Link>
       ))}
      </div>

      {!user && !loading && (
       <div className="mt-4 space-y-2">
        <Button variant="outline" className="w-full py-3" asChild>
         <Link href="/login">Giriş Yap</Link>
        </Button>
        <Button className="w-full py-3" asChild>
         <Link href="/register">Kayıt Ol</Link>
        </Button>
       </div>
      )}
     </Container>
    </div>
   )}
  </nav>
 );
}
