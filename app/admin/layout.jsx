'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
 FaHome,
 FaUsers,
 FaCalendar,
 FaBullhorn,
 FaSignOutAlt,
 FaBars,
 FaTimes
} from 'react-icons/fa';

export default function AdminLayout({ children }) {
 const router = useRouter();
 const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(true);
 const [sidebarOpen, setSidebarOpen] = useState(true);

 useEffect(() => {
  checkAuth();
 }, []);

 const checkAuth = async () => {
  try {
   const response = await fetch('/api/auth/me');
   if (!response.ok) {
    router.push('/login');
    return;
   }
   const data = await response.json();
   if (data.user.role !== 'admin') {
    router.push('/');
    return;
   }
   setUser(data.user);
  } catch (error) {
   console.error('Auth check error:', error);
   router.push('/login');
  } finally {
   setLoading(false);
  }
 };

 const handleLogout = async () => {
  try {
   await fetch('/api/auth/logout', { method: 'POST' });
   router.push('/login');
  } catch (error) {
   console.error('Logout error:', error);
  }
 };

 if (loading) {
  return (
   <div className="min-h-screen flex items-center justify-center">
    <div className="text-xl">Yükleniyor...</div>
   </div>
  );
 }

 const menuItems = [
  { icon: FaHome, label: 'Dashboard', href: '/admin' },
  { icon: FaUsers, label: 'Psikologlar', href: '/admin/psychologists' },
  { icon: FaCalendar, label: 'Randevular', href: '/admin/appointments' },
  { icon: FaBullhorn, label: 'Reklamlar', href: '/admin/advertisements' },
 ];

 return (
  <div className="min-h-screen bg-gray-100">
   {/* Sidebar */}
   <aside className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
    <div className="p-4 flex items-center justify-between border-b border-gray-700">
     {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
     <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="p-2 hover:bg-gray-800 rounded"
     >
      {sidebarOpen ? <FaTimes /> : <FaBars />}
     </button>
    </div>

    <nav className="p-4">
     <ul className="space-y-2">
      {menuItems.map((item) => (
       <li key={item.href}>
        <Link
         href={item.href}
         className="flex items-center space-x-3 p-3 rounded hover:bg-gray-800 transition"
        >
         <item.icon className="text-xl" />
         {sidebarOpen && <span>{item.label}</span>}
        </Link>
       </li>
      ))}
     </ul>
    </nav>

    <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
     <button
      onClick={handleLogout}
      className="flex items-center space-x-3 p-3 rounded hover:bg-gray-800 transition w-full"
     >
      <FaSignOutAlt className="text-xl" />
      {sidebarOpen && <span>Çıkış Yap</span>}
     </button>
    </div>
   </aside>

   {/* Main Content */}
   <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>

    {/* Content */}
    <div className="p-6">
     {children}
    </div>
   </main>
  </div>
 );
}

