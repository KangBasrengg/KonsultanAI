"use client";

import { motion } from "framer-motion";
import { ArrowRight, Scale, Shield, BookOpen } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background decorations - refined for a less generic look */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-navy-light/40 to-transparent" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-light border border-gold/30 text-gold mb-8">
            <span className="flex h-2 w-2 rounded-full bg-merah animate-pulse"></span>
            <span className="text-sm font-medium">Mencakup Seluruh Bidang Hukum Indonesia</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Memahami Hukum Indonesia Dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light">Cepat & Cerdas</span>
          </h1>

          <p className="text-lg md:text-xl text-putih/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            AI Legal Assistant pertama di Indonesia yang membantu Anda menganalisis masalah hukum, menemukan pasal relevan, dan memberikan solusi dalam hitungan detik.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/konsultasi" 
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold text-navy font-bold text-lg hover:bg-gold-light transition-all transform hover:scale-105 flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              Mulai Konsultasi Gratis
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#cara-kerja" 
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-navy-light border border-putih/20 text-putih font-semibold hover:bg-putih/10 transition-colors flex items-center justify-center gap-2"
            >
              Pelajari Cara Kerja
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            { icon: <Scale className="w-6 h-6" />, title: "Analisis Instan", desc: "Hasil analisis dalam < 10 detik" },
            { icon: <Shield className="w-6 h-6" />, title: "Privasi Terjamin", desc: "Data & riwayat kasus aman" },
            { icon: <BookOpen className="w-6 h-6" />, title: "Database Hukum Lengkap", desc: "Perdata, Pidana, Bisnis & Lainnya" },
          ].map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center p-6 rounded-2xl bg-navy-light/50 border border-putih/5 backdrop-blur-sm">
              <div className="p-3 bg-gold/10 text-gold rounded-xl mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-putih/60">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
