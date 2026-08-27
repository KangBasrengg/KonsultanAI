"use client";

import { motion } from "framer-motion";
import { Briefcase, Scale, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function UserGuideSection() {
  const guides = [
    {
      title: "Pemilik UMKM / Bisnis?",
      desc: "Butuh kontrak kerja, perjanjian sewa, atau ingin review dokumen dengan cepat? LegalKita adalah asisten legal cerdas Anda.",
      icon: <Briefcase className="w-5 h-5 md:w-6 md:h-6" />,
      href: "/legalkita",
      cta: "Coba LegalKita",
    },
    {
      title: "Punya Masalah Hukum?",
      desc: "Menghadapi sengketa, penipuan, atau masalah perdata lainnya? Ceritakan kronologinya, AI akan berikan analisis & rekomendasi pasal.",
      icon: <Scale className="w-5 h-5 md:w-6 md:h-6" />,
      href: "/intake",
      cta: "Konsultasi AI Sekarang",
    },
    {
      title: "Ingin Tambah Wawasan?",
      desc: "Akses pustaka materi hukum, studi kasus, dan panduan lengkap dari para ahli untuk membekali pengetahuan legal Anda.",
      icon: <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />,
      href: "/learning",
      cta: "Ke Learning Center",
    }
  ];

  return (
    <section className="py-16 md:py-20 relative z-10">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-putih">Pilih Layanan <span className="text-gold">Sesuai Kebutuhan</span></h2>
          <p className="text-putih/60 text-sm md:text-base">Platform KonsultanAI kini makin lengkap. Panduan ini membantu Anda menemukan solusi yang tepat.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <Link href={guide.href} className="block h-full group">
                <div className="flex flex-col h-full p-6 md:p-8 rounded-2xl bg-navy-light/40 border border-gold/10 backdrop-blur-sm transition-all duration-300 transform group-hover:-translate-y-2 group-hover:scale-[1.02] group-hover:bg-gold/5 group-hover:border-gold/30 group-hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.25)]">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-gold/10 text-gold group-hover:bg-gold group-hover:text-navy transition-all duration-300">
                    {guide.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-putih mb-3">{guide.title}</h3>
                  <p className="text-putih/60 text-sm leading-relaxed mb-6 flex-1">{guide.desc}</p>
                  
                  <div className="flex items-center gap-2 font-semibold text-gold text-sm mt-auto group-hover:text-gold-light transition-colors">
                    {guide.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
