"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="bg-navy-light/50 border border-gold/30 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl relative overflow-hidden">
        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold text-putih mb-4">Oops! Terjadi Kesalahan</h1>
        <p className="text-putih/60 mb-8 leading-relaxed">
          Maaf, sistem mengalami kendala teknis saat memproses permintaan Anda. Hal ini bisa terjadi karena koneksi terputus atau masalah pada server.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 w-full bg-gold text-navy font-bold px-6 py-4 rounded-xl hover:bg-gold-light transition-all"
          >
            <RefreshCcw className="w-5 h-5" />
            Coba Lagi Sekarang
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center w-full bg-navy-dark text-putih font-medium px-6 py-4 rounded-xl hover:bg-putih/5 border border-putih/10 transition-all"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
