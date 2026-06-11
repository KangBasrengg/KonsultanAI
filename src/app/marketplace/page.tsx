"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Briefcase, Clock, ChevronDown, Scale, 
  Filter, Award, ArrowRight, X, Lock, Shield
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { LEGAL_FIELDS, type AdvocateWithDetails } from "@/lib/marketplace-types";

export default function MarketplacePage() {
  const { user, openAuthModal } = useAuth();
  const supabase = createClient();

  const [advocates, setAdvocates] = useState<AdvocateWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("experience");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAdvocate, setSelectedAdvocate] = useState<AdvocateWithDetails | null>(null);

  useEffect(() => {
    fetchAdvocates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAdvocates = async () => {
    setLoading(true);
    try {
      // Fetch approved advocates with active listings
      const { data: advocateData } = await supabase
        .from("advocates")
        .select("id, user_id, full_name, city, license_number, organization, experience_years, cases_handled, bio, photo_url, consultation_rate, verification_status, created_at, updated_at")
        .eq("verification_status", "approved");

      if (!advocateData) { setLoading(false); return; }

      // Fetch specializations for all advocates
      const advocateIds = advocateData.map(a => a.id);
      const { data: specData } = await supabase
        .from("advocate_specializations")
        .select("*")
        .in("advocate_id", advocateIds);

      // Fetch active listings
      const { data: listingData } = await supabase
        .from("listings")
        .select("*")
        .in("advocate_id", advocateIds)
        .eq("listing_status", "active");

      // Combine data
      const combined: AdvocateWithDetails[] = advocateData
        .map(a => ({
          ...a,
          specializations: (specData || []).filter(s => s.advocate_id === a.id),
          listing: listingData?.find(l => l.advocate_id === a.id) || null,
        }));

      setAdvocates(combined);
    } catch (e) {
      console.error("Failed to fetch advocates:", e);
    } finally {
      setLoading(false);
    }
  };

  // Filter & Sort
  const cities = [...new Set(advocates.map(a => a.city))].sort();

  const filteredAdvocates = advocates
    .filter(a => {
      const matchesSearch =
        a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.organization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesField = selectedField === "all" || a.specializations.some(s => s.field === selectedField);
      const matchesCity = selectedCity === "all" || a.city === selectedCity;
      return matchesSearch && matchesField && matchesCity;
    })
    .sort((a, b) => {
      if (sortBy === "experience") return b.experience_years - a.experience_years;
      if (sortBy === "price_low") return a.consultation_rate - b.consultation_rate;
      if (sortBy === "price_high") return b.consultation_rate - a.consultation_rate;
      return 0;
    });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/50 to-navy" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Scale className="w-4 h-4" />
              Marketplace Advokat
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Temukan <span className="text-gold">Advokat Profesional</span>
            </h1>
            <p className="text-putih/60 text-lg max-w-2xl mx-auto">
              Konsultasikan masalah hukum Anda dengan advokat terverifikasi yang berpengalaman di bidangnya.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-putih/30" />
              <input
                type="text"
                placeholder="Cari nama advokat, kota, atau organisasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-navy-light/60 border border-putih/20 rounded-2xl pl-12 pr-4 py-4 text-putih placeholder:text-putih/30 focus:outline-none focus:border-gold/50 transition-colors backdrop-blur-sm"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  showFilters ? "bg-gold text-navy" : "bg-putih/10 text-putih/60 hover:bg-putih/15"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 bg-navy-light/40 border border-putih/20 rounded-2xl p-6 backdrop-blur-sm overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Field Filter */}
                    <div>
                      <label className="text-xs text-putih/50 font-semibold uppercase mb-2 block">Bidang Hukum</label>
                      <select
                        value={selectedField}
                        onChange={(e) => setSelectedField(e.target.value)}
                        className="w-full bg-navy border border-putih/20 rounded-xl px-3 py-2.5 text-sm text-putih focus:outline-none focus:border-gold/40"
                      >
                        <option value="all">Semua Bidang</option>
                        {LEGAL_FIELDS.map(f => (
                          <option key={f.id} value={f.id}>{f.label}</option>
                        ))}
                      </select>
                    </div>
                    {/* City Filter */}
                    <div>
                      <label className="text-xs text-putih/50 font-semibold uppercase mb-2 block">Kota</label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full bg-navy border border-putih/20 rounded-xl px-3 py-2.5 text-sm text-putih focus:outline-none focus:border-gold/40"
                      >
                        <option value="all">Semua Kota</option>
                        {cities.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    {/* Sort */}
                    <div>
                      <label className="text-xs text-putih/50 font-semibold uppercase mb-2 block">Urutkan</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full bg-navy border border-putih/20 rounded-xl px-3 py-2.5 text-sm text-putih focus:outline-none focus:border-gold/40"
                      >
                        <option value="experience">Pengalaman Terbanyak</option>
                        <option value="price_low">Harga Terendah</option>
                        <option value="price_high">Harga Tertinggi</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="px-6 pb-24">
        <div className="container mx-auto max-w-6xl">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-putih/50 text-sm">
              {loading ? "Memuat..." : `${filteredAdvocates.length} advokat ditemukan`}
            </p>
            {!user && (
              <p className="text-xs text-putih/40">
                <button onClick={() => openAuthModal("login")} className="text-gold hover:underline">Login</button> untuk melakukan booking
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
              <p className="text-putih/40 text-sm">Memuat data advokat...</p>
            </div>
          ) : filteredAdvocates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Scale className="w-16 h-16 text-putih/10" />
              <h3 className="text-xl font-bold text-putih/40">Belum Ada Advokat</h3>
              <p className="text-putih/30 text-sm text-center max-w-md">
                {advocates.length === 0
                  ? "Belum ada advokat yang terdaftar di marketplace. Apakah Anda seorang advokat?"
                  : "Tidak ada advokat yang sesuai dengan filter pencarian Anda."}
              </p>
              {advocates.length === 0 && (
                <Link href="/daftar-advokat" className="mt-4 bg-gold text-navy px-6 py-2.5 rounded-full font-bold hover:bg-gold-light transition-colors">
                  Daftar Sebagai Advokat
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAdvocates.map((advocate, idx) => (
                <motion.div
                  key={advocate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-navy-light/40 border border-putih/20 rounded-2xl overflow-hidden hover:border-gold/20 transition-all group cursor-pointer"
                  onClick={() => setSelectedAdvocate(advocate)}
                >
                  {/* Card Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold font-bold text-lg shrink-0 overflow-hidden relative">
                        {advocate.photo_url ? (
                          <Image src={advocate.photo_url} alt={advocate.full_name} fill className="object-cover" sizes="56px" />
                        ) : (
                          advocate.full_name.split(" ").map(n => n[0]).join("").slice(0, 2)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-putih truncate group-hover:text-gold transition-colors">
                          {advocate.full_name}
                        </h3>
                        <p className="text-xs text-putih/50">{advocate.organization}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-putih/40" />
                          <span className="text-xs text-putih/40">{advocate.city}</span>
                        </div>
                      </div>
                      {/* Verified Badge */}
                      <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-lg shrink-0">
                        <Shield className="w-3.5 h-3.5 text-green-400" />
                        <span className="text-xs font-bold text-green-400">Verified</span>
                      </div>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="px-6 pb-3">
                    <div className="flex flex-wrap gap-1.5">
                      {advocate.specializations.slice(0, 3).map(spec => {
                        const field = LEGAL_FIELDS.find(f => f.id === spec.field);
                        return (
                          <span key={spec.id} className="text-[10px] font-medium bg-putih/5 border border-putih/20 text-putih/60 px-2 py-0.5 rounded-full">
                            {field?.label || spec.field}
                          </span>
                        );
                      })}
                      {advocate.specializations.length > 3 && (
                        <span className="text-[10px] font-medium text-putih/40 px-1">
                          +{advocate.specializations.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="px-6 pb-4 flex items-center gap-4 text-xs text-putih/40">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {advocate.experience_years} thn
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {advocate.cases_handled || 0} kasus
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-putih/15 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-putih/40 uppercase">Mulai dari</p>
                      <p className="text-gold font-bold">{formatPrice(advocate.consultation_rate)}</p>
                    </div>
                    <button className="flex items-center gap-1 bg-gold/10 text-gold text-xs font-semibold px-3 py-2 rounded-xl hover:bg-gold/20 transition-colors">
                      Lihat Profil
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* CTA for Advocates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-r from-navy-light to-navy-dark border border-gold/20 rounded-3xl p-8 md:p-12 text-center"
          >
            <Scale className="w-10 h-10 text-gold mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Anda Seorang <span className="text-gold">Advokat?</span>
            </h2>
            <p className="text-putih/60 mb-6 max-w-lg mx-auto">
              Bergabunglah dengan marketplace kami untuk menjangkau lebih banyak klien potensial. Listing mulai dari Rp50.000/bulan.
            </p>
            <Link
              href="/daftar-advokat"
              className="inline-flex items-center gap-2 bg-gold text-navy px-8 py-3 rounded-full font-bold hover:bg-gold-light transition-colors transform hover:scale-105"
            >
              Daftar Sebagai Advokat
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Advocate Detail Modal */}
      <AnimatePresence>
        {selectedAdvocate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-dark/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedAdvocate(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-navy-light border border-putih/20 rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-putih/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold font-bold text-xl shrink-0 overflow-hidden relative">
                      {selectedAdvocate.photo_url ? (
                        <Image src={selectedAdvocate.photo_url} alt={selectedAdvocate.full_name} fill className="object-cover" sizes="64px" />
                      ) : (
                        selectedAdvocate.full_name.split(" ").map(n => n[0]).join("").slice(0, 2)
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-putih">{selectedAdvocate.full_name}</h2>
                      <p className="text-sm text-putih/50">{selectedAdvocate.organization}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-putih/40">
                          <MapPin className="w-3 h-3" /> {selectedAdvocate.city}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-green-400">
                          <Shield className="w-3 h-3" /> Terverifikasi
                        </span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedAdvocate(null)} className="p-1 hover:bg-putih/10 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-putih/50" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Bio */}
                {selectedAdvocate.bio && (
                  <div>
                    <h3 className="text-sm font-semibold text-putih/60 uppercase mb-2">Tentang</h3>
                    <p className="text-sm text-putih/80 leading-relaxed">{selectedAdvocate.bio}</p>
                  </div>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-navy/50 rounded-xl p-3 text-center">
                    <Briefcase className="w-4 h-4 text-gold mx-auto mb-1" />
                    <p className="text-lg font-bold text-putih">{selectedAdvocate.experience_years}</p>
                    <p className="text-[10px] text-putih/40">Tahun</p>
                  </div>
                  <div className="bg-navy/50 rounded-xl p-3 text-center">
                    <Award className="w-4 h-4 text-gold mx-auto mb-1" />
                    <p className="text-lg font-bold text-putih">{selectedAdvocate.cases_handled || "—"}</p>
                    <p className="text-[10px] text-putih/40">Kasus</p>
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <h3 className="text-sm font-semibold text-putih/60 uppercase mb-3">Bidang Keahlian</h3>
                  <div className="space-y-2">
                    {selectedAdvocate.specializations.map(spec => {
                      const field = LEGAL_FIELDS.find(f => f.id === spec.field);
                      return (
                        <div key={spec.id} className="flex items-center gap-3">
                          <span className="text-sm text-putih/80 w-40 shrink-0">{field?.label || spec.field}</span>
                          <div className="flex-1 bg-putih/5 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-gold/80 to-gold h-full rounded-full transition-all"
                              style={{ width: `${spec.expertise_percent}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gold w-10 text-right">{spec.expertise_percent}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Contact Notice */}
                <div className="bg-navy/50 rounded-xl p-4 flex items-center gap-3 border border-putih/15">
                  <Lock className="w-5 h-5 text-putih/30 shrink-0" />
                  <p className="text-xs text-putih/40">
                    Informasi kontak advokat hanya tersedia setelah Anda melakukan booking konsultasi melalui platform.
                  </p>
                </div>

                {/* Pricing + CTA */}
                <div className="bg-gold/5 border border-gold/20 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-putih/50 uppercase">Biaya Konsultasi</p>
                      <p className="text-2xl font-bold text-gold">{formatPrice(selectedAdvocate.consultation_rate)}</p>
                    </div>
                    <Clock className="w-5 h-5 text-putih/30" />
                  </div>
                  {user ? (
                    <Link href={`/marketplace/${selectedAdvocate.id}`} className="w-full block text-center bg-gold text-navy py-3 rounded-xl font-bold hover:bg-gold-light transition-colors">
                      Lanjutkan ke Pembayaran
                    </Link>
                  ) : (
                    <button
                      onClick={() => { setSelectedAdvocate(null); openAuthModal("login"); }}
                      className="w-full bg-gold text-navy py-3 rounded-xl font-bold hover:bg-gold-light transition-colors"
                    >
                      Login untuk Booking
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

