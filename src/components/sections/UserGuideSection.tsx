"use client";

import { motion } from "framer-motion";
import { Briefcase, Scale, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function UserGuideSection() {
  const guides = [
    {
      title: "Pemilik UMKM / Bisnis?",
      desc: "Butuh kontrak kerja, perjanjian sewa, atau ingin review dokumen dengan cepat? LegalKita adalah asisten legal cerdas Anda.",
      icon: <Briefcase className="w-8 h-8" />,
      href: "/legalkita",
      cta: "Coba LegalKita",
      bgClass: "bg-[#1a1207]",
      borderClass: "border-amber-700/50 hover:border-amber-500",
      textClass: "text-amber-400",
    },
    {
      title: "Punya Masalah Hukum?",
      desc: "Menghadapi sengketa, penipuan, atau masalah perdata lainnya? Ceritakan kronologinya, AI akan berikan analisis & rekomendasi pasal.",
      icon: <Scale className="w-8 h-8" />,
      href: "/intake",
      cta: "Konsultasi AI Sekarang",
      bgClass: "bg-[#071222]",
      borderClass: "border-blue-700/50 hover:border-blue-500",
      textClass: "text-blue-400",
    },
    {
      title: "Ingin Tambah Wawasan?",
      desc: "Akses pustaka materi hukum, studi kasus, dan panduan lengkap dari para ahli untuk membekali pengetahuan legal Anda.",
      icon: <GraduationCap className="w-8 h-8" />,
      href: "/learning",
      cta: "Ke Learning Center",
      bgClass: "bg-[#071a14]",
      borderClass: "border-emerald-700/50 hover:border-emerald-500",
      textClass: "text-emerald-400",
    }
  ];

  return (
    <section className="py-20 bg-navy">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Pilih Layanan <span className="text-gold">Sesuai Kebutuhan</span></h2>
          <p className="text-putih/70 text-lg">Platform KonsultanAI kini makin lengkap. Panduan ini membantu Anda menemukan solusi yang tepat.</p>
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
              <Link href={guide.href} className="block h-full">
                <div className={`flex flex-col h-full p-8 rounded-3xl ${guide.bgClass} border ${guide.borderClass} transition-all duration-300 group hover:-translate-y-1 hover:shadow-2xl`}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-putih/5 ${guide.textClass} group-hover:scale-110 transition-transform`}>
                    {guide.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{guide.title}</h3>
                  <p className="text-white/70 flex-1 leading-relaxed mb-8">{guide.desc}</p>
                  
                  <div className={`flex items-center gap-2 font-bold ${guide.textClass} mt-auto`}>
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
