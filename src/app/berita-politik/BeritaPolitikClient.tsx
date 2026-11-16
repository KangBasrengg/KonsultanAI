"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Landmark, 
  Search, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Scale, 
  TrendingUp,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";

export interface PoliticalNewsItem {
  id: string;
  title: string;
  slug: string;
  tag: string;
  excerpt: string;
  createdAt: string;
}

interface Props {
  initialNews: PoliticalNewsItem[];
}

const CATEGORIES = [
  "Semua",
  "Hukum Tata Negara",
  "Kebijakan Publik",
  "Pemilu & Pilkada",
  "Parlemen",
  "Etika Pejabat"
];

export default function BeritaPolitikClient({ initialNews }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  const filteredNews = initialNews.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "Semua" ||
      item.tag.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const featured = filteredNews.length > 0 ? filteredNews[0] : null;
  const listItems = filteredNews.length > 0 ? filteredNews.slice(1) : [];

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncMessage("");
    try {
      const res = await fetch("/api/cron/political-news?secret=konsultanai_cron_2026", {
        cache: "no-store",
      });
      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        setSyncMessage(`Server mengembalikan respons tidak valid (HTTP ${res.status}).`);
        return;
      }

      if (data.success) {
        setSyncMessage(`Sinkronisasi sukses: ${data.added_count} berita baru ditarik.`);
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setSyncMessage(data.error || "Gagal sinkronisasi berita.");
      }
    } catch (err: any) {
      setSyncMessage(`Gagal terhubung ke server cron: ${err?.message || "Network Error"}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy text-putih flex flex-col selection:bg-gold/30 selection:text-gold">
      <Navbar />

      <main className="flex-1 pt-28 md:pt-36 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-7xl">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-wider mb-4"
            >
              <Landmark className="w-4 h-4 text-gold" />
              <span>Portal Wawasan & Dinamika Politik Indonesia</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-putih leading-tight"
            >
              Berita & Analisis <span className="text-gold">Politik</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-base sm:text-lg text-putih/70 leading-relaxed"
            >
              Rangkuman objektif perkembangan isu politik, kebijakan publik, regulasi pemerintah, dan telaah hukum tata negara yang diperbarui secara otomatis setiap hari.
            </motion.p>

            <div className="mt-4 flex items-center justify-center gap-3 text-xs text-putih/50">
              <span className="flex items-center gap-1.5 bg-putih/5 px-3 py-1 rounded-full border border-putih/10">
                <Clock className="w-3.5 h-3.5 text-gold" />
                Update Otomatis: Tiap 00:00 WIB (Gemini 3.5 Flash-Lite)
              </span>
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="flex items-center gap-1 text-gold hover:underline disabled:opacity-50"
                title="Tarik berita terbaru sekarang"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? "Menarik..." : "Sinkronkan"}</span>
              </button>
            </div>

            {syncMessage && (
              <p className="mt-2 text-xs text-gold/90 font-medium">{syncMessage}</p>
            )}
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 pb-6 border-b border-putih/10">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-gold text-navy shadow-md shadow-gold/20"
                      : "bg-navy-light/60 hover:bg-putih/10 text-putih/70 hover:text-putih border border-putih/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-putih/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berita atau topik politik..."
                className="w-full bg-navy-light/60 border border-putih/15 rounded-xl pl-10 pr-4 py-2 text-sm text-putih placeholder-putih/40 focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>

          {/* Featured Headline */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 relative group rounded-3xl overflow-hidden border border-gold/30 bg-gradient-to-br from-navy-light/90 via-navy-light/60 to-gold/10 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-sm"
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gold text-navy">
                  Headline Utama
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-putih/10 text-gold border border-gold/20">
                  {featured.tag}
                </span>
                <span className="text-xs text-putih/50 flex items-center gap-1.5 ml-auto">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(featured.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-putih group-hover:text-gold transition-colors leading-snug mb-4">
                <Link href={`/learning/material/${featured.slug}`}>
                  {featured.title}
                </Link>
              </h2>

              <p className="text-putih/80 text-sm sm:text-base leading-relaxed max-w-4xl mb-6">
                {featured.excerpt}
              </p>

              <div className="flex items-center gap-4">
                <Link
                  href={`/learning/material/${featured.slug}`}
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-gold/20"
                >
                  <span>Baca Analisis Hukum Lengkap</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/intake"
                  className="inline-flex items-center gap-1.5 text-xs text-putih/70 hover:text-gold transition-colors px-3 py-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  <span>Tanyakan Isu Ini ke KonsultanAI</span>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Grid News List */}
          {listItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listItems.map((item, idx) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-navy-light/50 border border-putih/10 hover:border-gold/40 rounded-2xl p-6 flex flex-col justify-between hover:bg-navy-light/80 transition-all duration-300 group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-putih/5 border border-putih/10 text-gold">
                        {item.tag}
                      </span>
                      <span className="text-xs text-putih/40 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short"
                        })}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-putih group-hover:text-gold transition-colors line-clamp-2 leading-snug mb-3">
                      <Link href={`/learning/material/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-putih/65 line-clamp-3 leading-relaxed mb-6">
                      {item.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-putih/10 flex items-center justify-between">
                    <Link
                      href={`/learning/material/${item.slug}`}
                      className="text-xs font-semibold text-gold inline-flex items-center gap-1.5 hover:gap-2 transition-all"
                    >
                      <span>Baca Telaah</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <span className="text-[10px] text-putih/40 uppercase tracking-wider">
                      KonsultanAI Analisis
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : !featured ? (
            <div className="text-center py-20 bg-navy-light/30 rounded-3xl border border-putih/10">
              <Landmark className="w-12 h-12 text-putih/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-putih mb-2">Belum ada berita yang sesuai pencarian</h3>
              <p className="text-sm text-putih/60 mb-6">Coba ubah kata kunci atau kategori filter Anda.</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("Semua"); }}
                className="text-xs font-bold text-gold hover:underline"
              >
                Reset Pencarian
              </button>
            </div>
          ) : null}

          {/* Interactive Consultation Banner */}
          <div className="mt-16 bg-gradient-to-r from-navy-light via-navy-light/80 to-gold/15 border border-gold/30 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-gold uppercase tracking-wider mb-2">
                <Scale className="w-4 h-4 text-gold" />
                <span>Konsultasi Hukum Politik Terbuka</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-putih mb-2">
                Punya Pertanyaan tentang Isu Hukum, Pemilu, atau Regulasi Pemerintah?
              </h3>
              <p className="text-sm text-putih/70 leading-relaxed">
                Gunakan fitur Konsultasi AI kami untuk menganalisis kasus hukum tata negara, regulasi publik, atau wawasan politik Anda secara objektif berdasarkan peraturan perundang-undangan Indonesia.
              </p>
            </div>

            <Link
              href="/intake"
              className="shrink-0 bg-gold hover:bg-gold-light text-navy font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-gold/30 flex items-center gap-2"
            >
              <span>Buka Konsultasi Politik</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

