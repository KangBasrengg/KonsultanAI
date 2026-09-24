"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Search, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/components/auth/AuthProvider";
import { TEMPLATE_CATEGORIES, type TemplateCategory } from "@/types/cases";
import { templates } from "@/lib/templates-data";

export default function TemplatesPage() {
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState<TemplateCategory | "all">("all");

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === "all" || t.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const getTierColor = (tier: string) => {
    switch(tier.toLowerCase()) {
      case 'free': return 'bg-green-100 text-gold border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20';
      case 'topup kuota':
      case 'top-up kuota': return 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
      case 'pro':
      case 'professional': return 'bg-yellow-100 text-gold border-yellow-200 dark:bg-gold/10 dark:text-gold dark:border-gold/20';
      case 'enterprise': return 'bg-purple-100 text-purple-600 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20';
      default: return 'bg-slate-100 text-slate-600 dark:bg-putih/10 dark:text-putih/60';
    }
  };

  const isLocked = (requiredTier: string) => {
    if (!user) return requiredTier !== "free";
    if (profile?.role === "admin" || profile?.role === "advokat") return false;
    
    const userTier = (profile?.tier || "free").toLowerCase().replace("-", "");
    const tiers = ["free", "topup kuota", "pro", "enterprise"];
    const normalizedUserTier = userTier.includes("topup") ? "topup kuota" : (userTier === "professional" ? "pro" : userTier);
    const normalizedReqTier = requiredTier.toLowerCase().includes("topup") ? "topup kuota" : (requiredTier === "professional" ? "pro" : requiredTier.toLowerCase());
    
    return tiers.indexOf(normalizedReqTier) > tiers.indexOf(normalizedUserTier);
  };

  return (
    <main className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative shrink-0">
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-gold/5 dark:bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/50 dark:bg-gold/10 border border-slate-200 dark:border-gold/20 text-gold text-sm font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm shadow-sm dark:shadow-none">
              <FileText className="w-4 h-4" />
              Template Dokumen
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-navy dark:text-white">
              Koleksi <span className="text-gold">Draft Hukum</span>
            </h1>
            <p className="text-navy/60 dark:text-putih/60 text-lg max-w-2xl mx-auto">
              Draft dokumen hukum siap pakai untuk berbagai keperluan. Isi form dan langsung download dalam format PDF atau Word.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/30 dark:text-putih/30 transition-colors group-focus-within:text-gold" />
              <input
                type="text"
                placeholder="Cari jenis surat (contoh: Somasi, Perjanjian)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/70 dark:bg-navy-light/60 border border-slate-200 dark:border-putih/20 rounded-2xl pl-12 pr-4 py-4 text-navy dark:text-putih focus:outline-none focus:border-gold/50 backdrop-blur-md shadow-sm dark:shadow-none transition-all placeholder:text-navy/30 dark:placeholder:text-putih/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 pb-24 flex-1">
        <div className="container mx-auto max-w-6xl">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center sm:justify-start">
            <button
              onClick={() => setSelectedCat("all")}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all backdrop-blur-sm shadow-sm dark:shadow-none ${
                selectedCat === "all" 
                  ? "bg-gold text-white dark:text-navy shadow-gold/20 border border-gold/50" 
                  : "bg-white/60 dark:bg-navy-light border border-slate-200 dark:border-putih/20 text-navy/70 dark:text-putih/70 hover:bg-white dark:hover:bg-putih/10 hover:border-slate-300"
              }`}
            >
              Semua Template
            </button>
            {TEMPLATE_CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCat(cat.value)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all backdrop-blur-sm shadow-sm dark:shadow-none ${
                  selectedCat === cat.value 
                    ? "bg-gold text-white dark:text-navy shadow-gold/20 border border-gold/50" 
                    : "bg-white/60 dark:bg-navy-light border border-slate-200 dark:border-putih/20 text-navy/70 dark:text-putih/70 hover:bg-white dark:hover:bg-putih/10 hover:border-slate-300"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, idx) => {
              const locked = isLocked(template.tier_required);
              
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`bg-white/80 dark:bg-navy-light/40 border rounded-2xl overflow-hidden flex flex-col backdrop-blur-sm transition-all relative group shadow-sm dark:shadow-none hover:shadow-lg dark:hover:shadow-none ${
                    locked ? "border-slate-200 dark:border-putih/10 opacity-90" : "border-slate-200 dark:border-putih/20 hover:border-gold/30 dark:hover:border-gold/30"
                  }`}
                >
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${getTierColor(template.tier_required)}`}>
                        {template.tier_required} Tier
                      </div>
                      {locked && (
                        <div className="bg-slate-100 dark:bg-navy-dark/80 p-2 rounded-full text-slate-400 dark:text-putih/50">
                          <Lock className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-navy dark:text-putih mb-2 group-hover:text-gold transition-colors">
                      {template.title}
                    </h3>
                    <p className="text-sm text-navy/60 dark:text-putih/50 line-clamp-3 leading-relaxed">
                      {template.description}
                    </p>
                  </div>

                  <div className="p-6 pt-0 mt-auto">
                    {locked ? (
                      <Link 
                        href="/#harga"
                        className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-putih/5 text-slate-500 dark:text-putih/60 py-3 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-putih/10 transition-colors"
                      >
                        <Lock className="w-4 h-4" />
                        Upgrade untuk Akses
                      </Link>
                    ) : (
                      <Link 
                        href={`/templates/${template.id}`}
                        className="w-full flex items-center justify-center gap-2 bg-gold/10 dark:bg-gold/10 text-gold border border-gold/20 py-3 rounded-xl font-bold hover:bg-gold hover:text-white dark:hover:text-navy transition-all"
                      >
                        Gunakan Template <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-20 text-navy/40 dark:text-putih/40">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Tidak ada template yang sesuai dengan pencarian Anda.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
