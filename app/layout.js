import "./css/globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export const metadata = {
 title: "Psikoloji Portalı - Randevu ve Danışmanlık",
 description: "Uzman psikologlarımızdan online veya yüz yüze randevu alabilirsiniz. Zihinsel sağlığınız için profesyonel destek.",
 keywords: "psikoloji, psikolog, terapi, danışmanlık, zihinsel sağlık, randevu",
 authors: [{ name: "Psikoloji Portalı" }],
 openGraph: {
  title: "Psikoloji Portalı - Randevu ve Danışmanlık",
  description: "Uzman psikologlarımızdan online veya yüz yüze randevu alabilirsiniz",
  type: "website",
  locale: "tr_TR",
 },
};

export default function RootLayout({ children }) {
 return (
  <html lang="tr" className="scroll-smooth">
   <body className="antialiased min-h-screen flex flex-col bg-linear-to-br from-slate-50 via-white to-blue-50/30">
    <Header />
    <main className="flex-1 w-full pt-24 md:pt-28 lg:pt-28 mt-10">
     {children}
    </main>
    <Footer />
   </body>
  </html>
 );
}