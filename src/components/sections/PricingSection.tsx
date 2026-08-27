"use client";

import { motion } from "framer-motion";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { PLANS } from "@/lib/pricing";

export default function PricingSection() {
  const { user, openAuthModal } = useAuth();
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(false);
  const [tokenCount, setTokenCount] = useState(4);
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

  // Use centralized plans data
  const plans = PLANS;

  return (
    <section id="harga" className="py-24 relative z-10">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-putih">Pilih Paket <span className="text-gold">Sesuai Kebutuhan</span></h2>
          <p className="text-putih/60 text-sm md:text-base mb-8">Mulai dari gratis hingga paket profesional untuk analisis tanpa batas.</p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`font-semibold ${!isAnnual ? "text-putih" : "text-putih/50"}`}>Bulanan</span>
            <button 
              aria-label={isAnnual ? "Ganti ke paket bulanan" : "Ganti ke paket tahunan"}
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

        {/* Navigation Arrows for Slider (Hidden on Desktop) */}
        <div className="flex lg:hidden justify-end gap-3 max-w-[1400px] w-full mx-auto px-6 md:px-4 mb-2">
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
          className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-x-visible snap-x lg:snap-none snap-mandatory gap-6 lg:gap-4 xl:gap-8 pb-12 pt-4 px-6 md:px-4 max-w-[1400px] w-full mx-auto items-stretch [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className={`relative flex flex-col rounded-3xl p-8 border shrink-0 w-[85vw] sm:w-[350px] lg:w-auto snap-center ${plan.highlight
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
              <p className="text-sm text-putih/60 mb-6 min-h-[4.5rem]">{plan.description}</p>

              <div className="mb-4">
                <div className="flex flex-wrap items-baseline gap-1">
                  <span className={`${plan.name === "Enterprise" ? "text-lg xl:text-xl" : "text-xl xl:text-2xl"} font-bold text-gold tracking-tight`}>
                    {plan.name === "Top-Up Kuota" ? `Rp ${(tokenCount * 5000).toLocaleString('id-ID')}` : (isAnnual ? plan.displayAnnual : plan.displayMonthly)}
                  </span>
                  {plan.priceMonthly > 0 && <span className="text-putih/50 text-sm">{plan.name === "Top-Up Kuota" ? " / bayar" : "/bulan"}</span>}
                </div>
                {isAnnual && plan.priceMonthly > 0 && plan.name !== "Top-Up Kuota" && (
                  <p className={`text-xs mt-1 font-medium ${plan.name === "Enterprise" ? "text-putih/40 italic" : "text-green-400"}`}>
                    Ditagih {plan.displayAnnualTotal} per tahun
                  </p>
                )}
              </div>
              
              {plan.name === "Top-Up Kuota" && (
                <div className="mb-6 flex flex-col gap-2 bg-navy/50 p-3 rounded-lg border border-putih/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-putih">Jumlah Kuota:</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setTokenCount(Math.max(4, tokenCount - 1))}
                        className="w-8 h-8 rounded bg-navy-light text-putih hover:text-gold flex items-center justify-center font-bold text-lg"
                      >-</button>
                      <span className="text-xl font-bold text-putih tracking-tight">
                        {tokenCount}
                      </span>
                      <button 
                        onClick={() => setTokenCount(tokenCount + 1)}
                        className="w-8 h-8 rounded bg-navy-light text-putih hover:text-gold flex items-center justify-center font-bold text-lg"
                      >+</button>
                    </div>
                  </div>
                  <span className="text-xs text-putih/40 text-right">Rp 5.000 / Kuota (Min. 4)</span>
                </div>
              )}

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

              {plan.cta === "Berlangganan" || plan.cta === "Beli Kuota" ? (
                <button
                  onClick={() => {
                    if (!user) {
                      openAuthModal("login");
                    } else {
                      const finalPlanName = plan.name === "Top-Up Kuota" ? `Top-Up Kuota (${tokenCount} Token)` : plan.name;
                      router.push(`/checkout?plan=${encodeURIComponent(finalPlanName)}&cycle=${isAnnual ? "annual" : "monthly"}`);
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

