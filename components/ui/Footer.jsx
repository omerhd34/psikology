'use client';

import Link from 'next/link';
import { useState } from 'react';
import Container from "@/components/ui/Container";
import {
 FaFacebook,
 FaTwitter,
 FaInstagram,
 FaLinkedin,
 FaPhoneAlt,
 FaEnvelope,
 FaMapMarkerAlt,
 FaPaperPlane,
 FaBrain,
 FaCheckCircle
} from 'react-icons/fa';

export default function Footer() {
 const [email, setEmail] = useState('');
 const [subscribed, setSubscribed] = useState(false);

 const quickLinks = [
  { name: 'Ana Sayfa', href: '/' },
  { name: 'Psikologlar', href: '/psychologists' },
  { name: 'Blog & Makaleler', href: '/blog' },
  { name: 'Hakkımızda', href: '/about' },
 ];

 const legalLinks = [
  { name: 'Kullanım Koşulları', href: '/terms' },
  { name: 'Gizlilik Politikası', href: '/privacy' },
  { name: 'KVKK Aydınlatma Metni', href: '/kvkk' },
  { name: 'Çerez Politikası', href: '/cookies' },
 ];

 const socialLinks = [
  { name: 'Facebook', icon: FaFacebook, href: '#', color: 'hover:bg-blue-600' },
  { name: 'Twitter', icon: FaTwitter, href: '#', color: 'hover:bg-sky-500' },
  { name: 'Instagram', icon: FaInstagram, href: '#', color: 'hover:bg-pink-600' },
  { name: 'LinkedIn', icon: FaLinkedin, href: '#', color: 'hover:bg-blue-700' },
 ];

 const handleSubscribe = (e) => {
  e.preventDefault();
  if (email) {
   setSubscribed(true);
   setTimeout(() => {
    setSubscribed(false);
    setEmail('');
   }, 3000);
  }
 };

 return (
  <footer className="relative bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-300 mt-auto">
   {/* Decorative top border */}
   <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500" />

   {/* Main Footer Content */}
   <Container className="py-16">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

     {/* Column 1: Brand */}
     <div className="space-y-6">
      <Link href="/" className="inline-flex items-center gap-3 group">
       <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-slate-800 to-slate-700 border border-slate-700/50 text-blue-400 transition-all duration-300 group-hover:scale-105 group-hover:border-blue-500/50 group-hover:shadow-lg group-hover:shadow-blue-500/20">
        <FaBrain size={26} />
       </div>
       <span className="text-2xl font-bold bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
        Psikoloji Portalı
       </span>
      </Link>

      <p className="text-slate-400 text-sm leading-relaxed">
       Zihinsel sağlığınız bizim önceliğimiz. Uzman psikolog kadromuz ve güncel içeriklerimizle yanınızdayız.
      </p>

      {/* Social Links */}
      <div className="flex gap-3">
       {socialLinks.map((social) => (
        <Link
         key={social.name}
         href={social.href}
         className={`w-10 h-10 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg ${social.color} hover:border-transparent`}
         aria-label={social.name}
        >
         <social.icon size={18} />
        </Link>
       ))}
      </div>
     </div>

     {/* Column 2: Quick Links */}
     <div>
      <h4 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
       <span className="w-1 h-6 bg-linear-to-b from-blue-500 to-purple-500 rounded-full" />
       Hızlı Erişim
      </h4>
      <ul className="space-y-3">
       {quickLinks.map((link) => (
        <li key={link.name}>
         <Link
          href={link.href}
          className="text-slate-400 hover:text-blue-400 text-sm transition-all duration-200 hover:translate-x-1 inline-flex items-center gap-2 group"
         >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-400 transition-colors" />
          {link.name}
         </Link>
        </li>
       ))}
      </ul>
     </div>

     {/* Column 3: Legal */}
     <div>
      <h4 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
       <span className="w-1 h-6 bg-linear-to-b from-blue-500 to-purple-500 rounded-full" />
       Kurumsal
      </h4>
      <ul className="space-y-3">
       {legalLinks.map((link) => (
        <li key={link.name}>
         <Link
          href={link.href}
          className="text-slate-400 hover:text-blue-400 text-sm transition-all duration-200 hover:translate-x-1 inline-flex items-center gap-2 group"
         >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-400 transition-colors" />
          {link.name}
         </Link>
        </li>
       ))}
      </ul>
     </div>

     {/* Column 4: Contact & Newsletter */}
     <div>
      <h4 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
       <span className="w-1 h-6 bg-linear-to-b from-blue-500 to-purple-500 rounded-full" />
       İletişim
      </h4>

      <div className="space-y-4 mb-6">
       <div className="flex items-start gap-3 text-sm text-slate-400 group cursor-pointer">
        <FaEnvelope className="text-blue-400 mt-0.5 group-hover:scale-110 transition-transform" size={16} />
        <span className="group-hover:text-slate-200 transition-colors">info@psikolojiportali.com</span>
       </div>
       <div className="flex items-start gap-3 text-sm text-slate-400 group cursor-pointer">
        <FaPhoneAlt className="text-blue-400 mt-0.5 group-hover:scale-110 transition-transform" size={16} />
        <span className="group-hover:text-slate-200 transition-colors">+90 (212) 555 55 55</span>
       </div>
       <div className="flex items-start gap-3 text-sm text-slate-400 group cursor-pointer">
        <FaMapMarkerAlt className="text-blue-400 mt-0.5 group-hover:scale-110 transition-transform" size={16} />
        <span className="group-hover:text-slate-200 transition-colors">İstanbul, Türkiye</span>
       </div>
      </div>

      {/* Newsletter */}
      <div>
       <p className="text-sm text-slate-400 mb-3">Haftalık bültenimize abone olun</p>
       <div className="relative">
        <input
         type="email"
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         placeholder="E-posta adresiniz"
         className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg py-2.5 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-600"
        />
        <button
         onClick={handleSubscribe}
         className="absolute right-1.5 top-1.5 bottom-1.5 bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-md px-3 transition-all duration-300 flex items-center justify-center hover:scale-105"
        >
         {subscribed ? <FaCheckCircle size={14} /> : <FaPaperPlane size={14} />}
        </button>
       </div>
       {subscribed && (
        <p className="text-green-400 text-xs mt-2 animate-in fade-in duration-200">
         Başarıyla abone oldunuz!
        </p>
       )}
      </div>
     </div>

    </div>
   </Container>

   {/* Bottom Bar */}
   <div className="border-t border-slate-800/50 bg-slate-950/50">
    <Container className="py-4 flex flex-col md:flex-row justify-between items-center gap-4">
     <p className="text-slate-500 text-sm text-center md:text-left">
      © {new Date().getFullYear()} Psikoloji Portalı. Tüm hakları saklıdır.
     </p>
     <div className="flex items-center gap-6 text-sm">
      <Link href="/privacy" className="text-slate-500 hover:text-blue-400 transition-colors">
       Gizlilik
      </Link>
      <span className="text-slate-700">•</span>
      <Link href="/terms" className="text-slate-500 hover:text-blue-400 transition-colors">
       Şartlar
      </Link>
      <span className="text-slate-700">•</span>
      <Link href="/sitemap" className="text-slate-500 hover:text-blue-400 transition-colors">
       Site Haritası
      </Link>
     </div>
    </Container>
   </div>
  </footer>
 );
}