"use client";

import { motion } from "framer-motion";
import { ArrowRight, Scale, Shield, BookOpen } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="hero-section">
      {/* Background decorations - refined for a less generic look */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="hero-bg-top" />
        <div className="hero-bg-glow" />
      </div>

      <div className="hero-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-content"
        >
          <div className="hero-badge">
            <span className="flex h-2 w-2 rounded-full bg-merah animate-pulse"></span>
            <span className="text-sm font-medium">Mencakup Seluruh Bidang Hukum Indonesia</span>
          </div>

          <h1 className="hero-title">
            Memahami Hukum Indonesia Dengan <span className="hero-title-highlight">Cepat & Cerdas</span>
          </h1>

          <p className="hero-description">
            AI Legal Assistant pertama di Indonesia yang membantu Anda menganalisis masalah hukum, menemukan pasal relevan, dan memberikan solusi dalam hitungan detik.
          </p>

          <div className="hero-buttons-wrapper">
            <Link 
              href="/intake" 
              className="btn-primary group"
            >
              Mulai Konsultasi Gratis
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#cara-kerja" 
              className="btn-secondary"
            >
              Pelajari Cara Kerja
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-features-grid"
        >
          {[
            { icon: <Scale className="w-5 h-5" />, title: "Analisis Instan", desc: "Hasil analisis dalam < 10 detik" },
            { icon: <Shield className="w-5 h-5" />, title: "Privasi Terjamin", desc: "Data & riwayat kasus aman" },
            { icon: <BookOpen className="w-5 h-5" />, title: "Database Hukum Lengkap", desc: "KUHP Lama & Baru, Perdata & Lainnya" },
          ].map((feature, idx) => (
            <div key={idx} className="hero-feature-card">
              <div className="hero-feature-icon">
                {feature.icon}
              </div>
              <h2 className="hero-feature-title">{feature.title}</h2>
              <p className="hero-feature-desc">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

