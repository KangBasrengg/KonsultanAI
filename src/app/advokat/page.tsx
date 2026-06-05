"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Scale, Shield, Star, Briefcase, MapPin,
  DollarSign, Eye, Calendar, Settings, AlertCircle,
  Check, Crown, TrendingUp, Clock, RefreshCw, Wallet,
  Building, ChevronRight, MessageSquare
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LEGAL_FIELDS, type Advocate, type AdvocateSpecialization, type Listing } from "@/lib/marketplace-types";
import LoadingScreen from "@/components/auth/LoadingScreen";

export default function AdvocateDashboard() {
  const { user, profile, isVerifying } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [advocate, setAdvocate] = useState<Advocate | null>(null);
  const [specs, setSpecs] = useState<AdvocateSpecialization[]>([]);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [rate, setRate] = useState<number>(50000);
  const [savingRate, setSavingRate] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const commissionPercent = 10; // Default
  const platformFee = Math.round(rate * (commissionPercent / 100));
  const netEarning = rate - platformFee;

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: adv } = await supabase
        .from("advocates")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!adv) { setLoading(false); return; }
      setAdvocate(adv);
      setRate(adv.consultation_rate);

      const { data: specData } = await supabase
        .from("advocate_specializations")
        .select("*")
        .eq("advocate_id", adv.id);
      setSpecs(specData || []);

      const { data: listingData } = await supabase
        .from("listings")
        .select("*")
        .eq("advocate_id", adv.id)
        .eq("listing_status", "active")
        .single();
      setListing(listingData || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (!isVerifying && !user) router.push("/?login=true");
    else if (user) fetchData();
  }, [isVerifying, user, router, fetchData]);

  const handleSaveRate = async () => {
    if (!advocate || rate < 25000) return;
    setSavingRate(true);
    try {
      await supabase.from("advocates").update({ consultation_rate: rate, updated_at: new Date().toISOString() }).eq("id", advocate.id);
      setAdvocate(prev => prev ? { ...prev, consultation_rate: rate } : null);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingRate(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!advocate || advocate.balance <= 0 || isWithdrawing) return;
    setIsWithdrawing(true);
    setWithdrawSuccess(false);

    try {
      // Create withdrawal request
      const { error } = await supabase.from("withdrawals").insert({
        advocate_id: advocate.id,
        amount: advocate.balance,
        bank_name: advocate.bank_name,
        bank_account: advocate.bank_account,
        status: "pending"
      });

      if (error) throw error;

      // Update advocate balance to 0 locally immediately for UX
      // Note: Realistically this should be done in a DB transaction via RPC
      await supabase.from("advocates").update({ balance: 0 }).eq("id", advocate.id);
      
      setAdvocate(prev => prev ? { ...prev, balance: 0 } : null);
      setWithdrawSuccess(true);
      
      setTimeout(() => setWithdrawSuccess(false), 5000);
    } catch (e) {
      console.error("Failed to request withdrawal:", e);
      alert("Gagal melakukan penarikan. Silakan coba lagi.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  if (isVerifying || loading) return <LoadingScreen />;
  if (!user) return null;

  if (!advocate) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-6">
        <div className="text-center">
          <Scale className="w-16 h-16 text-putih/20 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-3">Belum Terdaftar</h1>
          <p className="text-putih/50 mb-6">Anda belum terdaftar sebagai advokat.</p>
          <Link href="/daftar-advokat" className="bg-gold text-navy px-8 py-3 rounded-full font-bold hover:bg-gold-light transition-colors">
            Daftar Sekarang
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = {
    pending: { label: "Menunggu Verifikasi", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", icon: Clock },
    approved: { label: "Terverifikasi", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", icon: Check },
    rejected: { label: "Ditolak", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: AlertCircle },
  };
  const status = statusConfig[advocate.verification_status];
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-navy text-putih">
      {/* Header */}
      <header className="bg-navy-dark border-b border-putih/10 py-4 px-6 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-9 h-9 rounded-full bg-navy-light flex items-center justify-center hover:bg-putih/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-bold text-lg flex items-center gap-2">
                Dashboard Advokat
                <Scale className="w-4 h-4 text-gold" />
              </h1>
              <p className="text-xs text-putih/50">{advocate.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/konsultasi-advokat" className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 hover:bg-gold/20 text-gold text-xs font-bold transition-colors">
              <MessageSquare className="w-3.5 h-3.5" />
              Chat Klien
            </Link>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${status.bg} ${status.color}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {status.label}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Rejection Notice */}
        {advocate.verification_status === "rejected" && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
              <div>
                <p className="font-bold text-red-300">Pendaftaran Ditolak</p>
                <p className="text-sm text-red-400/80 mt-1">Alasan: {advocate.rejection_reason || "Tidak ada alasan."}</p>
              </div>
            </div>
          </div>
        )}

        {/* Pending Notice */}
        {advocate.verification_status === "pending" && (
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <p className="font-bold text-orange-300">Menunggu Verifikasi</p>
                <p className="text-sm text-orange-400/80 mt-1">Akun Anda sedang dalam proses verifikasi. Maksimal 2 hari kerja.</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-navy-light/40 border border-putih/10 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gold/10 text-gold"><Award className="w-5 h-5" /></div>
              <span className="text-sm text-putih/60">Kasus Ditangani</span>
            </div>
            <p className="text-3xl font-bold">{advocate.cases_handled || 0}</p>
            <p className="text-xs text-putih/40">Total Kasus</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-navy-light/40 border border-putih/10 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400"><Briefcase className="w-5 h-5" /></div>
              <span className="text-sm text-putih/60">Pengalaman</span>
            </div>
            <p className="text-3xl font-bold">{advocate.experience_years}</p>
            <p className="text-xs text-putih/40">Tahun</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-navy-light/40 border border-putih/10 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-green-500/10 text-green-400"><Eye className="w-5 h-5" /></div>
              <span className="text-sm text-putih/60">Listing</span>
            </div>
            <p className="text-3xl font-bold">{listing ? "Aktif" : "—"}</p>
            {listing && (
              <p className="text-xs text-putih/40">
                s/d {new Date(listing.listing_expired_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
              </p>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-navy-light/40 border border-putih/10 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gold/10 text-gold"><DollarSign className="w-5 h-5" /></div>
              <span className="text-sm text-putih/60">Tarif</span>
            </div>
            <p className="text-2xl font-bold text-gold">{formatPrice(advocate.consultation_rate)}</p>
          </motion.div>
        </div>

        {/* Tariff Settings */}
        {advocate.verification_status === "approved" && (
          <div className="bg-navy-light/30 border border-putih/10 rounded-2xl p-6">
            <h2 className="font-bold text-lg flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-gold" />
              Pengaturan Tarif
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-putih/60 mb-2 block">Tarif Konsultasi (min. Rp25.000)</label>
                <input
                  type="number"
                  min="25000"
                  step="5000"
                  value={rate}
                  onChange={e => setRate(parseInt(e.target.value) || 0)}
                  className="w-full bg-navy border border-putih/15 rounded-xl px-4 py-3 text-putih focus:outline-none focus:border-gold/40 text-lg font-bold"
                />
                <button
                  onClick={handleSaveRate}
                  disabled={savingRate || rate < 25000 || rate === advocate.consultation_rate}
                  className="mt-3 bg-gold text-navy px-5 py-2 rounded-xl font-bold text-sm hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingRate ? "Menyimpan..." : "Simpan Tarif"}
                </button>
              </div>
              <div className="bg-gold/5 border border-gold/20 rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-gold uppercase">Simulasi Pendapatan</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-putih/60">Tarif Konsultasi</span>
                  <span className="text-putih font-medium">{formatPrice(rate)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-putih/60">Komisi Platform ({commissionPercent}%)</span>
                  <span className="text-red-400 font-medium">-{formatPrice(platformFee)}</span>
                </div>
                <div className="border-t border-gold/20 pt-3 flex justify-between">
                  <span className="text-putih font-bold">Pendapatan Bersih</span>
                  <span className="text-gold font-bold text-lg">{formatPrice(netEarning)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Balance & Withdrawals Section */}
        {advocate.verification_status === "approved" && (
          <div className="bg-navy-light/30 border border-putih/10 rounded-2xl p-6">
            <h2 className="font-bold text-lg flex items-center gap-2 mb-6">
              <Wallet className="w-5 h-5 text-green-400" />
              Saldo & Penarikan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-500/10 to-navy rounded-2xl p-6 border border-green-500/20">
                <p className="text-sm text-putih/60 mb-1">Total Saldo Aktif</p>
                <p className="text-4xl font-bold text-green-400 mb-6">{formatPrice(advocate.balance)}</p>
                
                <button
                  onClick={handleWithdrawal}
                  disabled={advocate.balance <= 0 || isWithdrawing}
                  className="w-full bg-green-500 text-navy py-3 rounded-xl font-bold hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isWithdrawing ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Wallet className="w-5 h-5" />
                  )}
                  {isWithdrawing ? "Memproses..." : "Tarik Saldo"}
                </button>
                {withdrawSuccess && (
                  <p className="text-xs text-green-400 mt-3 text-center flex items-center justify-center gap-1">
                    <Check className="w-3 h-3" /> Permintaan penarikan berhasil dibuat.
                  </p>
                )}
              </div>
              <div className="space-y-4">
                <div className="bg-navy/50 rounded-xl p-4 border border-putih/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Building className="w-4 h-4 text-putih/40" />
                    <span className="text-sm font-semibold text-putih/80">Informasi Rekening</span>
                  </div>
                  <p className="text-lg font-bold">{advocate.bank_account}</p>
                  <p className="text-xs text-putih/50">{advocate.bank_name}</p>
                </div>
                <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-orange-400 mb-1">Proses Penarikan</p>
                    <p className="text-xs text-putih/70 leading-relaxed">
                      Waktu proses penarikan saldo adalah sekitar <strong>3 Hari Kerja</strong> (tidak termasuk hari libur nasional). Dana akan langsung ditransfer ke rekening bank Anda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Specializations */}
        <div className="bg-navy-light/30 border border-putih/10 rounded-2xl p-6">
          <h2 className="font-bold text-lg flex items-center gap-2 mb-6">
            <Scale className="w-5 h-5 text-gold" />
            Bidang Keahlian
          </h2>
          <div className="space-y-3">
            {specs.map(spec => {
              const field = LEGAL_FIELDS.find(f => f.id === spec.field);
              return (
                <div key={spec.id} className="flex items-center gap-3">
                  <span className="text-sm text-putih/80 w-48">{field?.label || spec.field}</span>
                  <div className="flex-1 bg-putih/5 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-gold/80 to-gold h-full rounded-full" style={{ width: `${spec.expertise_percent}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gold w-10 text-right">{spec.expertise_percent}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
