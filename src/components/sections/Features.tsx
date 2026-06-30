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
    <section id="fitur" className="py-24 bg-navy-light/30">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-putih">Keunggulan <span className="text-gold">Produk</span></h2>
          <p className="text-putih/70 text-lg">Platform kami dirancang khusus untuk memenuhi kebutuhan hukum masyarakat Indonesia yang praktis dan efisien.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-navy border border-putih/15 hover:border-gold/40 transition-colors group cursor-pointer shadow-sm"
            >
              <div className="w-12 h-12 rounded-lg bg-navy-light flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-putih">{feature.title}</h3>
              <p className="text-putih/60 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
