import Link from "next/link";
import { SearchX, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="w-24 h-24 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-8 relative">
            <div className="absolute inset-0 bg-gold/20 animate-ping rounded-full" />
            <SearchX className="w-12 h-12 relative z-10" />
          </div>
          
          <h1 className="text-5xl font-black text-putih mb-4 tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-putih/90 mb-4">Halaman Tidak Ditemukan</h2>
          
          <p className="text-putih/60 mb-8 leading-relaxed">
            Maaf, halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau memang tidak pernah ada.
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gold text-navy font-bold px-8 py-4 rounded-xl hover:bg-gold-light transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
