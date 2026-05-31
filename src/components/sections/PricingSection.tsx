"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import Link from "next/link";

export default function PricingSection() {
  const plans = [
    {
      name: "Free Trial",
      price: "Rp 0",
      desc: "Coba kemampuan AI kami untuk satu kasus.",
      features: [
        { name: "1x Generate Analisis", inc: true },
        { name: "Rekomendasi Pasal", inc: true },
        { name: "Penjelasan Sederhana", inc: true },
        { name: "Riwayat Konsultasi", inc: false },
        { name: "Download Laporan", inc: false },
        { name: "Prioritas Respon", inc: false },
      ],
      cta: "Coba Sekarang",
      highlight: false
    },
    {
      name: "Basic Plan",
      price: "Rp 49.000",
      period: "/bulan",
      desc: "Cocok untuk masyarakat umum yang butuh akses reguler.",
      features: [
        { name: "Unlimited Generate", inc: true },
        { name: "Rekomendasi Pasal", inc: true },
        { name: "Penjelasan Sederhana", inc: true },
        { name: "Riwayat Konsultasi", inc: true },
        { name: "Download Laporan PDF", inc: true },
        { name: "Prioritas Respon", inc: false },
      ],
      cta: "Berlangganan",
      highlight: true
    },
    {
      name: "Professional",
      price: "Rp 149.000",
      period: "/bulan",
      desc: "Untuk praktisi, mahasiswa hukum, dan UMKM.",
      features: [
        { name: "Unlimited Generate", inc: true },
        { name: "Analisis Mendalam & Detail", inc: true },
        { name: "Template Laporan Premium", inc: true },
        { name: "Riwayat Konsultasi", inc: true },
        { name: "Download Laporan PDF", inc: true },
        { name: "Prioritas Respon AI", inc: true },
      ],
      cta: "Berlangganan",
      highlight: false
    }
  ];

  return (
    <section id="harga" className="py-24 bg-navy-light/20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Pilih Paket <span className="text-gold">Sesuai Kebutuhan</span></h2>
          <p className="text-putih/70 text-lg">Konsultasi hukum kini tidak lagi mahal. Dapatkan akses ke AI Legal Assistant dengan harga terjangkau.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className={`relative rounded-3xl p-8 border ${
                plan.highlight 
                  ? "bg-navy-dark border-gold shadow-[0_0_30px_rgba(212,175,55,0.15)] md:-translate-y-4" 
                  : "bg-navy border-putih/10"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-navy text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  Paling Populer
                </div>
              )}

              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-sm text-putih/60 mb-6 h-10">{plan.desc}</p>
              
              <div className="mb-8">
                <span className="text-4xl font-bold text-gold">{plan.price}</span>
                {plan.period && <span className="text-putih/50">{plan.period}</span>}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3 text-sm">
                    {feat.inc ? (
                      <Check className="w-5 h-5 text-green-400 shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-putih/20 shrink-0" />
                    )}
                    <span className={feat.inc ? "text-putih/90" : "text-putih/40"}>{feat.name}</span>
                  </li>
                ))}
              </ul>

              <Link href="/konsultasi">
                <button className={`w-full py-3 rounded-xl font-bold transition-all ${
                  plan.highlight 
                    ? "bg-gold text-navy hover:bg-gold-light" 
                    : "bg-navy-light text-putih hover:bg-putih/10"
                }`}>
                  {plan.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
