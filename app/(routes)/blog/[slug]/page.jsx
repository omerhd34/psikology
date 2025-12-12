'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaCalendar, FaEye, FaTag, FaArrowLeft } from 'react-icons/fa';

export default function BlogDetailPage() {
 const params = useParams();
 const [article, setArticle] = useState(null);
 const [relatedArticles, setRelatedArticles] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  if (params.slug) {
   fetchArticle();
  }
 }, [params.slug]);

 const fetchArticle = async () => {
  try {
   setLoading(true);
   const response = await fetch(`/api/advertisements/${params.slug}`);
   const data = await response.json();

   if (data.success) {
    setArticle(data.data);
    // İlgili içerikleri getir
    fetchRelatedArticles(data.data.category);
   }
  } catch (error) {
   console.error('Fetch error:', error);
  } finally {
   setLoading(false);
  }
 };

 const fetchRelatedArticles = async (category) => {
  try {
   const response = await fetch(`/api/advertisements?category=${category}&limit=3&status=published`);
   const data = await response.json();
   setRelatedArticles(data.data?.filter(a => a.slug !== params.slug) || []);
  } catch (error) {
   console.error('Fetch related error:', error);
  }
 };

 if (loading) {
  return (
   <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
     <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
     <p className="text-gray-600">Yükleniyor...</p>
    </div>
   </div>
  );
 }

 if (!article) {
  return (
   <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
     <h2 className="text-3xl font-bold mb-4">İçerik bulunamadı</h2>
     <Link href="/blog" className="text-purple-600 hover:text-purple-700 font-semibold">
      ← Blog sayfasına dön
     </Link>
    </div>
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-gray-50 pt-20">
   {/* Hero Image */}
   {article.featuredImage && (
    <div className="relative h-96 overflow-hidden">
     <img
      src={article.featuredImage}
      alt={article.title}
      className="w-full h-full object-cover"
     />
     <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
     <div className="absolute bottom-0 left-0 right-0 p-8">
      <div className=" mx-auto">
       <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-white hover:text-purple-300 transition-colors mb-4"
       >
        <FaArrowLeft /> Geri Dön
       </Link>
       <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 bg-linear-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-full capitalize">
         <FaTag className="inline mr-1" />
         {article.category}
        </span>
        {article.featured && (
         <span className="px-3 py-1 bg-linear-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold rounded-full">
          ⭐ Öne Çıkan
         </span>
        )}
       </div>
       <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
        {article.title}
       </h1>
       <div className="flex items-center gap-6 text-white/90">
        <span className="flex items-center gap-2">
         <FaCalendar />
         {new Date(article.publishDate).toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
         })}
        </span>
        <span className="flex items-center gap-2">
         <FaEye />
         {article.viewCount} görüntülenme
        </span>
        {article.authorName && (
         <span>Yazar: {article.authorName}</span>
        )}
       </div>
      </div>
     </div>
    </div>
   )}

   {/* Content */}
   <div className=" mx-auto px-4 py-12">
    <div className="max-w-4xl mx-auto">
     <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
      {article.excerpt && (
       <div className="text-xl text-gray-700 font-medium mb-8 pb-8 border-b border-gray-200 leading-relaxed">
        {article.excerpt}
       </div>
      )}
      <div className="prose prose-lg max-w-none">
       <div className="text-gray-800 leading-relaxed whitespace-pre-line">
        {article.content}
       </div>
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
       <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="font-bold text-lg mb-4">Etiketler:</h3>
        <div className="flex flex-wrap gap-2">
         {article.tags.map((tag, idx) => (
          <span
           key={idx}
           className="px-4 py-2 bg-linear-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium"
          >
           #{tag}
          </span>
         ))}
        </div>
       </div>
      )}
     </article>

     {/* Related Articles */}
     {relatedArticles.length > 0 && (
      <div>
       <h2 className="text-3xl font-bold mb-8">İlgili İçerikler</h2>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedArticles.map((related) => (
         <Link
          key={related._id}
          href={`/blog/${related.slug}`}
          className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
         >
          {related.featuredImage && (
           <div className="relative h-40 overflow-hidden">
            <img
             src={related.featuredImage}
             alt={related.title}
             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
           </div>
          )}
          <div className="p-4">
           <h3 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
            {related.title}
           </h3>
           <p className="text-sm text-gray-600 line-clamp-2">
            {related.excerpt || related.content.substring(0, 100)}...
           </p>
          </div>
         </Link>
        ))}
       </div>
      </div>
     )}
    </div>
   </div>
  </div>
 );
}

