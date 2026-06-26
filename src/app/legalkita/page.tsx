"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, MessageSquare, Search, ArrowRight, Shield, Clock, 
  Briefcase, Star, CheckCircle, Users, Building, Sparkles, 
  Scale, AlertTriangle, BookOpen
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/components/auth/AuthProvider";

const FEATURES = [
  {
    id: "generator",
    href: "/legalkita/generator",
    icon: <FileText className="w-8 h-8" />,
    title: "Generator Kontrak",
    subtitle: "Buat kontrak dalam 2 menit",
    desc: "Kontrak kerja, sewa, jual-beli, kemitraan — semua dokumen legal UMKM Anda dibuat otomatis oleh AI sesuai hukum Indonesia.",
    tags: ["Kontrak Kerja", "Sewa Menyewa", "Jual-Beli", "Kemitraan"],
    cardBg: "bg-[#1a1207]",
    borderColor: "border-amber-700/50 hover:border-amber-500",
    iconBg: "bg-amber-600/30 text-amber-400",
    subtitleColor: "text-amber-400",
    tagBg: "bg-amber-900/60 text-amber-300 border-amber-600/40",
  },
  {
    id: "chat",
    href: "/legalkita/chat",
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Chat Tanya Hukum",
    subtitle: "Tanya apa saja soal hukum UMKM",
    desc: "Jawab pertanyaan seputar hak kerja, pajak UMKM, perizinan usaha, dan regulasi lainnya — dijelaskan dalam bahasa sederhana.",
    tags: ["Hak Kerja", "Pajak UMKM", "Perizinan", "Regulasi"],
    cardBg: "bg-[#071222]",
    borderColor: "border-blue-700/50 hover:border-blue-500",
    iconBg: "bg-blue-600/30 text-blue-400",
    subtitleColor: "text-blue-400",
    tagBg: "bg-blue-900/60 text-blue-300 border-blue-600/40",
  },
  {
    id: "review",
    href: "/legalkita/review",
    icon: <Search className="w-8 h-8" />,
    title: "Review Dokumen",
    subtitle: "Upload & cek risiko kontrak lama",
    desc: "Tempel atau upload dokumen hukum Anda. AI akan menganalisis risiko, celah, dan memberikan rekomendasi perbaikan.",
    tags: ["Analisis Risiko", "Celah Hukum", "Rekomendasi"],
    cardBg: "bg-[#071a14]",
    borderColor: "border-emerald-700/50 hover:border-emerald-500",
    iconBg: "bg-emerald-600/30 text-emerald-400",
    subtitleColor: "text-emerald-400",
    tagBg: "bg-emerald-900/60 text-emerald-300 border-emerald-600/40",
  },
];

const STATS = [
  { icon: <Users className="w-5 h-5" />, value: "5.000+", label: "UMKM Terbantu" },
  { icon: <FileText className="w-5 h-5" />, value: "12.000+", label: "Dokumen Dibuat" },
  { icon: <Clock className="w-5 h-5" />, value: "< 2 menit", label: "Waktu Generate" },
  { icon: <Star className="w-5 h-5" />, value: "4.8/5", label: "Rating Pengguna" },
];

const USE_CASES = [
  { icon: "🏪", title: "Pemilik Warung & Toko", desc: "Buat kontrak kerja karyawan, perjanjian sewa tempat usaha" },
  { icon: "🧵", title: "Konveksi & Garment", desc: "Kontrak kemitraan, perjanjian jual-beli bahan baku" },
  { icon: "🔧", title: "Jasa & Service", desc: "Perjanjian layanan, kontrak freelance, MoU kerjasama" },
  { icon: "🌾", title: "Pertanian & UMKM Desa", desc: "Perjanjian bagi hasil, kontrak distribusi, sewa lahan" },
  { icon: "💻", title: "Startup & Tech", desc: "NDA, perjanjian co-founder, kontrak outsourcing" },
  { icon: "🍜", title: "F&B & Kuliner", desc: "Franchise agreement, kontrak supplier, lisensi resep" },
];

export default function LegalKitaPage() {
  const { user, openAuthModal } = useAuth();

  return (
    <main className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
        {/* Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-0 w-full h-[600px] bg-gradient-to-b from-navy-light/40 to-transparent" />
          <div className="absolute top-[-15%] right-[-8%] w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-light border border-amber-500/30 text-amber-400 mb-8">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI Dokumen Hukum untuk Usaha Kecil</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-tight">
              Legal<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-gold-light">Kita</span>
            </h1>

            <p className="text-lg md:text-xl text-putih/80 mb-6 max-w-2xl mx-auto leading-relaxed">
              Buat kontrak dalam <span className="text-amber-400 font-semibold">2 menit</span>, tanpa perlu pengacara. 
              AI legal assistant khusus UMKM Indonesia — dari warung hingga startup.
            </p>

            <p className="text-sm text-putih/50 mb-12 max-w-xl mx-auto">
              Didukung oleh AI yang memahami KUHPerdata, UU Ketenagakerjaan No. 13/2003, 
              UU Cipta Kerja, dan regulasi UMKM Indonesia.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/legalkita/generator"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-gold text-navy font-bold text-lg hover:from-amber-400 hover:to-gold-light transition-all transform hover:scale-105 flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              >
                Buat Kontrak Sekarang
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#fitur"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-navy-light border border-putih/20 text-putih font-semibold hover:bg-putih/10 transition-colors flex items-center justify-center gap-2"
              >
                Lihat Semua Fitur
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {STATS.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center p-4 rounded-2xl bg-navy-light/50 border border-putih/10 backdrop-blur-sm">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg mb-3">
                  {stat.icon}
                </div>
                <span className="font-bold text-xl text-putih">{stat.value}</span>
                <span className="text-xs text-putih/50 mt-1">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="fitur" className="py-24 bg-navy-light/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Fitur <span className="text-amber-400">Utama</span>
            </h2>
            <p className="text-putih/70 text-lg">
              Tiga fitur powerful yang menyelesaikan 90% kebutuhan hukum UMKM Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
              >
                <Link href={feature.href} className="block h-full">
                  <div className={`relative h-full p-8 rounded-3xl ${feature.cardBg} border ${feature.borderColor} transition-all duration-300 group cursor-pointer hover:shadow-2xl hover:-translate-y-1`}>
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className={`text-sm ${feature.subtitleColor} font-medium mb-4`}>{feature.subtitle}</p>
                    <p className="text-white/60 text-sm leading-relaxed mb-6">{feature.desc}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {feature.tags.map((tag) => (
                        <span key={tag} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${feature.tagBg}`}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-sm font-bold text-white/80 group-hover:text-white transition-colors">
                      Mulai Sekarang
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Cocok untuk <span className="text-amber-400">Semua UMKM</span>
            </h2>
            <p className="text-putih/70 text-lg">
              Dari warung kopi hingga startup tech — LegalKita membantu semua jenis usaha kecil menengah.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {USE_CASES.map((uc, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-navy-light/40 border border-putih/10 hover:border-amber-500/30 transition-all group cursor-default"
              >
                <span className="text-3xl mb-4 block">{uc.icon}</span>
                <h3 className="font-bold text-lg text-putih mb-2 group-hover:text-amber-400 transition-colors">{uc.title}</h3>
                <p className="text-sm text-putih/50 leading-relaxed">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Disclaimer Section */}
      <section className="py-16 bg-navy-light/30">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-navy border border-blue-500/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-putih mb-3">Disclaimer Hukum</h3>
                <p className="text-putih/70 text-sm leading-relaxed mb-4">
                  LegalKita adalah <strong className="text-putih">bantuan AI</strong> dan <strong className="text-putih">bukan pengganti konsultasi pengacara berlisensi</strong>. 
                  Dokumen yang dihasilkan bersifat draft awal yang perlu ditinjau oleh profesional hukum untuk kasus yang kompleks. 
                  Dengan menggunakan layanan ini, Anda memahami bahwa output AI bukan merupakan nasihat hukum yang mengikat.
                </p>
                <p className="text-putih/50 text-xs">
                  Untuk kasus yang membutuhkan sentuhan manusia, kami dapat menghubungkan Anda dengan pengacara mitra kami.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Model Bisnis / Pricing Teaser */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Mulai <span className="text-amber-400">Gratis</span>
          </h2>
          <p className="text-putih/70 text-lg mb-12 max-w-2xl mx-auto">
            Coba 3 dokumen gratis per bulan. Upgrade ke Pro untuk unlimited dokumen hanya Rp 149rb/bulan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Free */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-navy-light border border-putih/15 text-left"
            >
              <h3 className="text-lg font-bold text-putih mb-2">Freemium</h3>
              <div className="text-3xl font-bold text-amber-400 mb-1">Gratis</div>
              <p className="text-xs text-putih/50 mb-6">3 dokumen / bulan</p>
              <ul className="space-y-3">
                {["3 generate kontrak", "Chat tanya hukum", "Template dasar"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-putih/70">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-3xl bg-navy-dark border-2 border-amber-500/40 text-left relative md:scale-105 shadow-[0_0_30px_rgba(245,158,11,0.1)]"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-navy text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Paling Populer
              </div>
              <h3 className="text-lg font-bold text-putih mb-2">Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-amber-400">Rp 149rb</span>
                <span className="text-putih/50 text-sm">/bln</span>
              </div>
              <p className="text-xs text-putih/50 mb-6">Unlimited dokumen</p>
              <ul className="space-y-3">
                {["Unlimited generate kontrak", "Review dokumen AI", "Export PDF premium", "Chat hukum prioritas", "Template lengkap"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-putih/70">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Referral */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-3xl bg-navy-light border border-putih/15 text-left"
            >
              <h3 className="text-lg font-bold text-putih mb-2">Butuh Pengacara?</h3>
              <div className="text-xl font-bold text-blue-400 mb-1">Referral Mitra</div>
              <p className="text-xs text-putih/50 mb-6">Kasus yang terlalu kompleks untuk AI</p>
              <ul className="space-y-3">
                {["Hubungkan ke pengacara mitra", "Konsultasi tatap muka", "Pendampingan hukum penuh"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-putih/70">
                    <Scale className="w-4 h-4 text-blue-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="mt-12">
            <Link
              href="/legalkita/generator"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-gold text-navy font-bold text-lg hover:from-amber-400 hover:to-gold-light transition-all transform hover:scale-105 group shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            >
              Mulai Buat Kontrak Gratis
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
