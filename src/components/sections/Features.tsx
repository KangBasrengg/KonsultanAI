"use client";

import { motion } from "framer-motion";
import { MessageSquare, FileText, History, Lock, ShieldCheck, Zap } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Input Kronologi Natural",
      desc: "Tidak perlu bahasa formal. Ceritakan masalah Anda seperti berbicara dengan teman.",
      icon: <MessageSquare className="w-6 h-6" />
    },
    {
      title: "Rekomendasi Pasal",
      desc: "Menemukan pasal dari berbagai undang-undang Indonesia yang paling relevan dengan kronologi Anda secara akurat.",
      icon: <FileText className="w-6 h-6" />
    },
    {
      title: "Riwayat Konsultasi",
      desc: "Simpan semua kasus dan laporan hukum Anda dengan aman dalam satu tempat.",
      icon: <History className="w-6 h-6" />
    },
    {
      title: "Keamanan Privasi",
      desc: "Data Anda dienkripsi dan dijamin kerahasiaannya sesuai standar keamanan tinggi.",
      icon: <Lock className="w-6 h-6" />
    },
    {
      title: "Validasi Hukum",
      desc: "Referensi dari database hukum resmi yang selalu diperbarui.",
      icon: <ShieldCheck className="w-6 h-6" />
    },
    {
      title: "Respon Instan",
      desc: "Tidak perlu menunggu berhari-hari. Dapatkan hasil analisis kurang dari 10 detik.",
      icon: <Zap className="w-6 h-6" />
    }
  ];

  return (
    <section id="fitur" className="py-20 relative z-10">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-putih">Keunggulan <span className="text-gold">Produk</span></h2>
          <p className="text-putih/60 text-xs md:text-sm">Platform kami dirancang khusus untuk memenuhi kebutuhan hukum masyarakat Indonesia yang praktis dan efisien.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-5 rounded-xl bg-navy-light/30 border border-gold/10 hover:border-gold/30 hover:-translate-y-1.5 hover:scale-[1.01] hover:bg-gold/5 hover:shadow-[0_15px_30px_-10px_rgba(212,175,55,0.2)] transition-all duration-300 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-gold mb-3.5 bg-gold/10 group-hover:scale-105 group-hover:bg-gold group-hover:text-navy transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-base font-bold mb-1.5 text-putih">{feature.title}</h3>
              <p className="text-putih/60 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
