"use client";

import { useState, useEffect, Suspense } from "react";
import { ArrowLeft, CheckCircle, Shield, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/auth/LoadingScreen";
import Script from "next/script";
import { getPlanPrice } from "@/lib/pricing";

function CheckoutContent() {
  const { user, isVerifying } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const basePlan = searchParams.get("plan");
  const cycle = searchParams.get("cycle");
  const plan = basePlan && cycle === "annual" ? `${basePlan} (Tahunan)` : basePlan;

  const [isPaying, setIsPaying] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    if (!isVerifying && !user) {
      window.location.href = "/?login=true";
    }
  }, [isVerifying, user]);

  if (isVerifying || !user) return <LoadingScreen />;
  if (!plan) {
    router.push("/#harga");
    return null;
  }

  // Parse token count if Top-Up
  let tokenCount = 4;
  let price = 0;
  
  if (plan.includes("Top-Up Kuota")) {
    const match = plan.match(/\((\d+)\s+Token\)/);
    if (match) tokenCount = parseInt(match[1]);
    price = tokenCount * 5000;
  } else {
    price = getPlanPrice(basePlan || "", cycle === "annual") || 0;
  }

  // Admin fee logic standard in E-commerce (optional, set to 0 if not needed)
  const adminFee = 0; 
  const total = price + adminFee;

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planName: plan,
          amount: total,
          userEmail: user.email,
          userName: user.user_metadata?.full_name || user.email?.split('@')[0]
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal memproses transaksi');

      if (window.snap) {
        window.snap.pay(data.token, {
          onSuccess: function (result: any) {
            console.log('Payment success:', result);
            showNotification("Pembayaran berhasil! Saldo / Paket Anda akan segera aktif.", "success");
            setTimeout(() => {
              if (plan.includes("Top-Up Kuota")) {
                window.location.href = "/pengaturan?tab=billing";
              } else {
                window.location.href = "/chat";
              }
            }, 2000);
          },
          onPending: function (result: any) {
            console.log('Payment pending:', result);
            showNotification("Menunggu pembayaran Anda diselesaikan.", "info");
          },
          onError: function (result: any) {
            console.error('Payment error:', result);
            showNotification("Pembayaran gagal.", "error");
            setIsPaying(false);
          },
          onClose: function () {
            showNotification("Popup pembayaran ditutup.", "info");
            setIsPaying(false);
          }
        });
      } else {
        showNotification("Sistem pembayaran belum siap. Silakan refresh halaman.", "error");
        setIsPaying(false);
      }
    } catch (err: any) {
      console.error('Payment initialization error:', err);
      showNotification(err.message || "Gagal memproses pembayaran.", "error");
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy text-putih flex flex-col">
      <header className="bg-navy-dark border-b border-putih/20 py-4 px-6 shrink-0 z-10 flex items-center gap-4">
        <Link href="/#harga" className="w-10 h-10 rounded-full bg-navy-light flex items-center justify-center hover:bg-putih/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-putih" />
        </Link>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-gold" />
          <h1 className="font-bold text-xl">Checkout Transaksi</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col md:flex-row justify-center gap-8">
        
        {/* Kolom Kiri: Manfaat */}
        <div className="w-full max-w-md bg-navy-light/20 border border-putih/10 rounded-3xl p-8 h-fit">
          <h2 className="text-xl font-bold mb-6 text-gold flex items-center gap-2">
            <Shield className="w-5 h-5" /> Keuntungan Paket Anda
          </h2>
          
          <ul className="space-y-4 text-sm text-putih/80">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              <span>Akses prioritas ke layanan <strong>KonsultanAI</strong> tanpa waktu tunggu.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              <span>Keamanan tingkat tinggi dengan enkripsi ujung-ke-ujung (end-to-end encryption).</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
              <span>Analisis hukum mendalam didukung oleh model AI termutakhir.</span>
            </li>
            {plan.includes("Pro") && (
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                <span>Pembuatan Draft Dokumen Hukum otomatis tanpa batas.</span>
              </li>
            )}
            {plan.includes("Top-Up") && (
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                <span>Token tidak hangus dan dapat digunakan kapan saja.</span>
              </li>
            )}
          </ul>
        </div>

        {/* Kolom Kanan: Rincian Pembayaran */}
        <div className="w-full max-w-lg">
          <div className="bg-navy-light/30 border border-putih/20 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
            <h2 className="text-2xl font-bold mb-8 text-center border-b border-putih/10 pb-6">Rincian Pembayaran</h2>
            
            <div className="space-y-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-putih/60">Produk</span>
                <span className="font-bold text-gold text-right">{plan}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-putih/60">Harga</span>
                <span className="font-medium">Rp {price.toLocaleString('id-ID')}</span>
              </div>

              {adminFee > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-putih/60">Biaya Layanan</span>
                  <span className="font-medium">Rp {adminFee.toLocaleString('id-ID')}</span>
                </div>
              )}
              
              <div className="border-t border-putih/10 pt-6 mt-4 flex justify-between items-center">
                <span className="text-lg font-bold">Total Pembayaran</span>
                <span className="text-2xl font-bold text-gold">Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isPaying || total === 0}
              className="w-full bg-gold text-navy font-bold py-4 rounded-xl hover:bg-gold-light transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50"
            >
              {isPaying ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</>
              ) : (
                <><CheckCircle className="w-5 h-5" /> Bayar Sekarang</>
              )}
            </button>
            <div className="mt-6 p-4 bg-merah/10 border border-merah/20 rounded-xl">
              <p className="text-xs text-merah-light font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Disclaimer:</strong> Pembayaran yang sudah dilakukan tidak dapat dikembalikan (non-refundable). Jika Anda mengalami masalah dengan transaksi, silakan hubungi admin di menu <Link href="/chat" className="underline hover:text-putih">Konsultasi AI (Chat)</Link>.
                </span>
              </p>
            </div>
            <p className="text-center text-[10px] text-putih/40 mt-4 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" /> Transaksi Aman & Terenkripsi
            </p>
          </div>
        </div>
      </main>

      {/* Floating Notification */}
      {notification && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
          notification.type === 'success' 
            ? 'bg-green-900/90 border-green-500/50 text-green-50' 
            : notification.type === 'error'
            ? 'bg-red-900/90 border-red-500/50 text-red-50'
            : 'bg-navy border-gold/50 text-putih'
        } backdrop-blur-md`}>
          {notification.type === 'success' ? <CheckCircle className="w-6 h-6 text-green-400" /> : <AlertCircle className="w-6 h-6 text-red-400" />}
          <p className="font-medium text-sm">{notification.message}</p>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <Script
        src={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY?.startsWith('SB-')
          ? "https://app.sandbox.midtrans.com/snap/snap.js"
          : "https://app.midtrans.com/snap/snap.js"}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
      <Suspense fallback={<LoadingScreen />}>
        <CheckoutContent />
      </Suspense>
    </>
  );
}
