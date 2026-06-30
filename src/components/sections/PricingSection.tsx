"use client";

import { motion } from "framer-motion";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function PricingSection() {
  const { user, openAuthModal } = useAuth();
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 350, behavior: "smooth" });
    }
  };

  const plans = [
    {
      name: "Free Trial",
      priceMonthly: "Rp 0",
      priceAnnual: "Rp 0",
      desc: "Coba kemampuan AI kami untuk satu kasus.",
      features: [
        { name: "3x Generate Analisis", inc: true },
        { name: "3x Generate Kontrak (LegalKita)", inc: true },
        { name: "Rekomendasi Pasal", inc: true },
        { name: "Penjelasan Sederhana", inc: true },
        { name: "3 Materi Legal Learning", inc: true },
        { name: "Preview Template (Watermark)", inc: true },
        { name: "Download Laporan", inc: false },
      ],
      cta: "Coba Sekarang",
      highlight: false
    },
    {
      name: "Basic",
      priceMonthly: "Rp 80.000",
      priceAnnual: "Rp 70.000",
      period: "/bulan",
      desc: "Cocok untuk masyarakat umum yang butuh akses reguler.",
      features: [
        { name: "10x Generate Analisis", inc: true },
        { name: "10x Generate Kontrak (LegalKita)", inc: true },
        { name: "Rekomendasi Pasal", inc: true },
        { name: "Penjelasan Sederhana", inc: true },
        { name: "Riwayat Konsultasi", inc: true },
        { name: "Download Laporan PDF", inc: true },
        { name: "8 Materi Legal Learning", inc: true },
      ],
      cta: "Berlangganan",
      highlight: true
    },
    {
      name: "Pro",
      priceMonthly: "Rp 149.000",
      priceAnnual: "Rp 129.000",
      period: "/bulan",
      desc: "Untuk praktisi, mahasiswa hukum, dan UMKM.",
      features: [
        { name: "25x Generate Analisis", inc: true },
        { name: "Unlimited Kontrak & Review (LegalKita)", inc: true },
        { name: "Semua Fitur Basic", inc: true },
        { name: "Analisis Mendalam & Detail", inc: true },
        { name: "Template Laporan Premium", inc: true },
        { name: "AI Legal Tutor", inc: true },
        { name: "20 Materi & Sertifikat", inc: true },
      ],
      cta: "Berlangganan",
      highlight: false
    },
    {
      name: "Enterprise",
      priceMonthly: "Rp 525.000",
      priceAnnual: "Rp 445.000",
      period: "/bulan",
      desc: "Solusi enterprise untuk instansi pemerintah, perusahaan berskala besar, dan firma hukum.",
      features: [
        { name: "Semua Fitur Professional", inc: true },
        { name: "Akses Tim (5 Akun)", inc: true },
        { name: "AI Contract Review", inc: true },
        { name: "Legal Compliance Checker", inc: true },
        { name: "Template Kontrak Bisnis", inc: true },
        { name: "Manajemen Dokumen Terpusat", inc: true },
        { name: "Government Analytics Dashboard", inc: true },
        { name: "Dukungan Prioritas", inc: true },
      ],
      cta: "Hubungi Sales",
      highlight: false
    }
  ];

  return (
    <section id="harga" className="py-24 bg-navy-light/20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-putih">Pilih Paket <span className="text-gold">Sesuai Kebutuhan</span></h2>
          <p className="text-putih/70 text-lg mb-8">Konsultasi hukum kini tidak lagi mahal. Dapatkan akses ke AI Legal Assistant dengan harga terjangkau.</p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`font-semibold ${!isAnnual ? "text-putih" : "text-putih/50"}`}>Bulanan</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-7 rounded-full bg-navy border border-gold/30 p-1 relative transition-colors duration-300"
            >
              <motion.div 
                animate={{ x: isAnnual ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-5 h-5 rounded-full bg-gold"
              />
            </button>
            <span className={`font-semibold flex items-center gap-2 ${isAnnual ? "text-putih" : "text-putih/50"}`}>
              Tahunan <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Hemat 15%</span>
            </span>
          </div>
        </div>

        {/* Navigation Arrows for Slider */}
        <div className="flex justify-end gap-3 max-w-[1400px] w-full mx-auto px-6 md:px-4 mb-2">
          <button 
            onClick={scrollLeft} 
            className="w-10 h-10 rounded-full bg-navy border border-putih/20 flex items-center justify-center text-putih/70 hover:text-gold hover:border-gold transition-colors group"
            aria-label="Geser ke kiri"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button 
            onClick={scrollRight} 
            className="w-10 h-10 rounded-full bg-navy border border-putih/20 flex items-center justify-center text-putih/70 hover:text-gold hover:border-gold transition-colors group"
            aria-label="Geser ke kanan"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Wrapper padding to allow scroll bleed on mobile, centered on desktop */}
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 lg:gap-8 pb-12 pt-4 px-6 md:px-4 max-w-[1400px] w-full mx-auto items-stretch [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className={`relative flex flex-col rounded-3xl p-8 border shrink-0 w-[85vw] sm:w-[350px] lg:w-[380px] snap-center ${plan.highlight
                  ? "bg-navy-dark border-gold shadow-[0_0_30px_rgba(212,175,55,0.15)] z-10 md:scale-[1.03]"
                  : "bg-navy border-putih/20"
                }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-navy text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  Paling Populer
                </div>
              )}

              <h3 className="text-xl font-bold mb-2 text-putih">{plan.name}</h3>
              <p className="text-sm text-putih/60 mb-6 min-h-[4.5rem]">{plan.desc}</p>

              <div className="mb-8">
                <div className="flex items-baseline gap-1 whitespace-nowrap">
                  <span className="text-3xl xl:text-4xl font-bold text-gold tracking-tight">{isAnnual ? plan.priceAnnual : plan.priceMonthly}</span>
                  {plan.period && <span className="text-putih/50 text-sm">{plan.period}</span>}
                </div>
                {isAnnual && plan.name !== "Free Trial" && plan.name !== "Enterprise" && (
                  <p className="text-xs text-green-400 mt-1 font-medium">
                    Ditagih {plan.name === "Basic" ? "Rp 480.000" : "Rp 1.020.000"} per tahun
                  </p>
                )}
                {isAnnual && plan.name === "Enterprise" && (
                  <p className="text-xs text-putih/40 mt-1 font-medium italic">
                    Ditagih Rp 2.100.000 per tahun
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3 text-sm">
                    {feat.inc ? (
                      <Check className="w-5 h-5 text-green-400 shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-putih/20 shrink-0" />
                    )}
                    <span className={feat.inc ? "text-putih/90" : "text-putih/40 leading-tight"}>{feat.name}</span>
                  </li>
                ))}
              </ul>

              {plan.cta === "Berlangganan" ? (
                <button
                  onClick={() => {
                    if (!user) {
                      openAuthModal("login");
                    } else {
                      router.push(`/chat?plan=${encodeURIComponent(plan.name)}&cycle=${isAnnual ? "annual" : "monthly"}`);
                    }
                  }}
                  className={`w-full py-3 rounded-xl font-bold transition-all mt-auto ${plan.highlight
                      ? "bg-gold text-navy hover:bg-gold-light"
                      : "bg-navy-light text-putih border border-putih/20 hover:bg-putih/10"
                    }`}
                >
                  {plan.cta}
                </button>
              ) : (
                <Link href={plan.name === "Enterprise" ? "mailto:muhammadnuril155@gmail.com?subject=Tertarik%20Paket%20Enterprise%20KonsultanAI" : "/intake"} className="mt-auto">
                  <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.highlight
                      ? "bg-gold text-navy hover:bg-gold-light"
                      : "bg-navy-light text-putih border border-putih/20 hover:bg-putih/10"
                    }`}>
                    {plan.cta}
                  </button>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

