"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { ArrowLeft, Briefcase, Award, MapPin, Scale, RefreshCw, CheckCircle2, Shield, Lock, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ScrollFadeIn from "@/components/ui/ScrollFadeIn";

declare global {
  interface Window {
    snap: any;
  }
}

export default function AdvocateDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  const supabase = createClient();

  const [advocate, setAdvocate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdvocate();
  }, [id, supabase]);

  const fetchAdvocate = async () => {
    try {
      const { data, error: err } = await supabase
        .from("advocates")
        .select(`
          *,
          specializations:advocate_specializations(field, expertise_percent),
          reviews:advocate_reviews(rating, review)
        `)
        .eq("id", id)
        .eq("verification_status", "approved")
        .single();

      if (err) throw err;
      setAdvocate(data);
    } catch (err: any) {
      console.error("Error fetching advocate:", err);
      setError("Advokat tidak ditemukan atau belum diverifikasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      openAuthModal("login");
      return;
    }

    setIsBooking(true);
    setError(null);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ advocateId: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat sesi booking.");

      if (window.snap) {
        window.snap.pay(data.token, {
          onSuccess: async function (result: any) {
            console.log("Payment success:", result);
            // Confirm booking and create consultation room
            try {
              const confirmRes = await fetch("/api/booking/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                  bookingId: data.bookingId, 
                  orderId: data.orderId 
                }),
              });
              const confirmData = await confirmRes.json();
              if (confirmRes.ok && confirmData.roomId) {
                setRoomId(confirmData.roomId);
              }
            } catch (e) {
              console.error("Failed to confirm booking:", e);
            }
            setBookingSuccess(true);
            setIsBooking(false);
          },
          onPending: function (result: any) {
            console.log("Payment pending:", result);
            alert("Menunggu pembayaran...");
          },
          onError: function (result: any) {
            console.log("Payment error:", result);
            setError("Pembayaran gagal. Silakan coba lagi.");
          },
          onClose: function () {
            setIsBooking(false);
          },
        });
      } else {
        throw new Error("Sistem pembayaran (Midtrans) tidak dapat dimuat.");
      }
    } catch (err: any) {
      setError(err.message);
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center">
        <RefreshCw className="w-10 h-10 animate-spin text-gold" />
      </div>
    );
  }

  if (!advocate) return null;

  const isOwnProfile = user?.id === advocate.user_id;

  if (error) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex flex-col items-center justify-center p-6 text-center">
        <Scale className="w-16 h-16 text-putih/20 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Terjadi Kesalahan</h1>
        <p className="text-putih/60 mb-6">{error}</p>
        <Link href="/marketplace" className="bg-gold text-navy px-6 py-2 rounded-full font-bold">
          Kembali ke Marketplace
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 lg:px-12 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-20 -right-20 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -left-20 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-putih/60 hover:text-putih mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>

        {bookingSuccess ? (
          <div className="bg-navy-light/50 border border-gold/30 rounded-3xl p-10 text-center max-w-lg mx-auto">
            <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-putih mb-4">Pembayaran Berhasil!</h2>
            <p className="text-putih/70 mb-8">
              Booking konsultasi Anda dengan <strong>{advocate.full_name}</strong> telah dikonfirmasi. 
              Ruang chat konsultasi Anda sudah siap!
            </p>
            <div className="flex flex-col gap-3">
              <Link 
                href={roomId ? `/konsultasi-advokat/${roomId}` : "/konsultasi"} 
                className="bg-gold text-navy font-bold py-3.5 px-6 rounded-xl hover:bg-gold-light transition-colors"
              >
                Mulai Konsultasi (Chat)
              </Link>
              <Link href="/marketplace" className="bg-putih/5 text-putih font-semibold py-3.5 px-6 rounded-xl hover:bg-putih/10 transition-colors">
                Kembali ke Marketplace
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile & Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <ScrollFadeIn className="bg-navy-light/30 border border-putih/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
                <div className="w-32 h-32 rounded-2xl bg-navy overflow-hidden relative shrink-0 border border-putih/20 shadow-xl">
                  {advocate.photo_url ? (
                    <Image src={advocate.photo_url} alt={advocate.full_name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gold/50 bg-gold/5">
                      <Scale className="w-12 h-12" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-semibold rounded-full border border-gold/20 flex items-center gap-1.5">
                      <Shield className="w-3 h-3" /> Terverifikasi
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-putih mb-2">{advocate.full_name}</h1>
                  <p className="text-putih/60 mb-4">{advocate.license_number} • {advocate.organization}</p>
                  
                  <div className="flex flex-wrap gap-6 text-sm text-putih/80">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gold" />
                      {advocate.experience_years} Tahun Pengalaman
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gold" />
                      {advocate.city}
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-gold" />
                      {advocate.cases_handled || 0} Kasus Ditangani
                    </div>
                  </div>
                </div>
              </ScrollFadeIn>

              {/* Bio & Details */}
              <ScrollFadeIn delay={0.1} className="bg-navy-light/30 border border-putih/20 rounded-3xl p-6 md:p-8 space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-gold" />
                    Tentang Advokat
                  </h3>
                  <p className="text-putih/70 leading-relaxed whitespace-pre-wrap">
                    {advocate.bio || "Advokat ini belum menambahkan deskripsi profil."}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-gold" />
                    Bidang Keahlian
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {advocate.specializations?.map((spec: any, idx: number) => (
                      <div key={idx} className="bg-navy/50 border border-putih/15 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold capitalize">{spec.field.replace("_", " ")}</span>
                          <span className="text-xs text-gold">{spec.expertise_percent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-putih/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full"
                            style={{ width: `${spec.expertise_percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollFadeIn>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <ScrollFadeIn delay={0.2} className="bg-navy-light/50 border border-gold/30 rounded-3xl p-6 sticky top-32 shadow-2xl shadow-black/50">
                <h3 className="font-bold text-lg mb-2">Tarif Konsultasi</h3>
                <div className="text-3xl font-bold text-gold mb-6">
                  Rp {advocate.consultation_rate.toLocaleString("id-ID")}
                  <span className="text-sm font-normal text-putih/50"> / Sesi</span>
                </div>

                <div className="space-y-4 mb-8 text-sm text-putih/70">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    <p>Sesi chat privat 1-on-1 yang aman dan rahasia.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                    <p>Akses dokumen hukum Anda dengan mudah.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-gold shrink-0" />
                    <p>Pembayaran diproses secara aman oleh Midtrans.</p>
                  </div>
                </div>

                {isOwnProfile ? (
                  <div className="w-full bg-putih/5 border border-putih/20 text-putih/50 text-center font-medium py-4 px-6 rounded-2xl">
                    Ini adalah profil Anda sendiri
                  </div>
                ) : (
                  <button
                    onClick={handleBooking}
                    disabled={isBooking}
                    className="w-full bg-gradient-to-r from-gold to-gold-light text-navy font-bold py-4 px-6 rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gold/20 disabled:opacity-50"
                  >
                    {isBooking ? (
                      <><RefreshCw className="w-5 h-5 animate-spin" /> Memproses...</>
                    ) : (
                      "Konsultasi Sekarang"
                    )}
                  </button>
                )}
              </ScrollFadeIn>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

