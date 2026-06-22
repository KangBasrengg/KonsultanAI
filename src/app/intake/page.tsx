"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, AlertCircle, FileText, Bot, Scale, BookOpen, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { 
  CASE_TYPE_OPTIONS, 
  CASE_SUB_CATEGORIES, 
  URGENCY_OPTIONS, 
  WILAYAH_OPTIONS,
  type IntakeFormData,
  type CaseType,
  type TriageResult
} from "@/types/cases";
import Navbar from "@/components/layout/Navbar";
import LimitModal from "@/components/ui/LimitModal";

export default function IntakeFormPage() {
  const router = useRouter();
  const { user, profile, openAuthModal } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");

  const [formData, setFormData] = useState<IntakeFormData>({
    case_type: "perdata",
    sub_category: "",
    wilayah: "",
    urgency_level: "normal",
    kronologi: "",
    jumlah_nilai: undefined,
    sudah_advokat: false,
    sudah_lapor_polisi: false
  });

  const handleInputChange = (field: keyof IntakeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === "case_type") {
      setFormData(prev => ({ ...prev, sub_category: "" }));
    }
  };

  const handleNextStep = () => {
    setError("");
    if (step === 1) {
      if (!formData.case_type || !formData.sub_category || !formData.wilayah) {
        setError("Mohon lengkapi jenis kasus, sub kategori, dan wilayah Anda.");
        return;
      }
    } else if (step === 2) {
      if (!formData.kronologi || formData.kronologi.length < 100) {
        setError("Ceritakan kronologi Anda lebih detail (minimal 100 karakter).");
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    if (!user) {
      openAuthModal("login");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 && (data.error === "Limit_Exceeded" || data.message?.includes("Limit"))) {
          setIsLimitModalOpen(true);
          setLimitMessage(data.message);
          throw new Error("Limit tercapai.");
        }
        throw new Error(data.message || data.error || "Gagal mengirim data");
      }

      setTriageResult(data);
      setStep(4);
    } catch (err: any) {
      if (err.message !== "Limit tercapai.") {
        // Clean raw API error messages for user-friendly display
        let cleanedMessage = err.message || "Terjadi kesalahan. Silakan coba lagi.";
        if (cleanedMessage.includes("Freemodel API Error") || cleanedMessage.includes("503") || cleanedMessage.includes("Service Unavailable")) {
          cleanedMessage = "Server AI sedang sibuk. Silakan tunggu beberapa saat lalu coba lagi.";
        }
        setError(cleanedMessage);
      }
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />
      <LimitModal 
        isOpen={isLimitModalOpen} 
        onClose={() => setIsLimitModalOpen(false)} 
        message={limitMessage} 
      />
      
      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 pb-28 md:pb-32">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-navy dark:text-putih mb-4">
              Penerimaan Kasus <span className="text-gold">Baru</span>
            </h1>
            <p className="text-navy/60 dark:text-putih/60">
              Isi form berikut agar AI kami dapat menganalisis dan merekomendasikan solusi hukum terbaik untuk Anda.
            </p>
          </div>

          {/* Stepper indicator */}
          {step < 4 && (
            <div className="flex items-center justify-center mb-8 gap-2">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step >= num 
                      ? "bg-gold text-navy" 
                      : "bg-navy/10 dark:bg-putih/10 text-navy/40 dark:text-putih/40"
                  }`}>
                    {num}
                  </div>
                  {num < 3 && (
                    <div className={`w-12 h-1 mx-2 rounded transition-colors ${
                      step > num ? "bg-gold" : "bg-navy/10 dark:bg-putih/10"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
              {step === 3 && (
                <button
                  onClick={() => { setError(""); handleSubmit(); }}
                  className="self-end bg-red-600 dark:bg-red-500 text-white text-sm px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Coba Lagi
                </button>
              )}
            </motion.div>
          )}

          {/* Form Container */}
          <div className="bg-navy-light/40 border border-slate-200 dark:border-putih/20 rounded-3xl p-6 md:p-8 shadow-xl dark:backdrop-blur-sm transition-colors duration-300">
            <AnimatePresence mode="wait">
              {/* Step 1: Kategori */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold text-navy dark:text-putih mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gold" />
                    Kategori Kasus
                  </h2>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-navy/80 dark:text-putih/80">Jenis Hukum</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {CASE_TYPE_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => handleInputChange("case_type", opt.value)}
                          className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                            formData.case_type === opt.value 
                              ? "bg-gold/10 border-gold text-gold" 
                              : "bg-slate-50 dark:bg-navy border-slate-200 dark:border-putih/10 text-navy/70 dark:text-putih/70 hover:border-slate-300 dark:hover:border-putih/30"
                          }`}
                        >
                          <span className="text-xl">{opt.icon}</span>
                          <span className="font-medium">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.case_type && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
                      <label className="block text-sm font-medium text-navy/80 dark:text-putih/80">Sub Kategori</label>
                      <select
                        value={formData.sub_category}
                        onChange={(e) => handleInputChange("sub_category", e.target.value)}
                        className="w-full bg-slate-50 dark:bg-navy border border-slate-200 dark:border-putih/20 rounded-xl px-4 py-3.5 text-navy dark:text-putih focus:outline-none focus:border-gold transition-colors"
                      >
                        <option value="" disabled>Pilih spesifikasi kasus...</option>
                        {CASE_SUB_CATEGORIES[formData.case_type].map(sub => (
                          <option key={sub.value} value={sub.value}>{sub.label}</option>
                        ))}
                      </select>
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-navy/80 dark:text-putih/80">Wilayah / Lokasi</label>
                    <select
                      value={formData.wilayah}
                      onChange={(e) => handleInputChange("wilayah", e.target.value)}
                      className="w-full bg-slate-50 dark:bg-navy border border-slate-200 dark:border-putih/20 rounded-xl px-4 py-3.5 text-navy dark:text-putih focus:outline-none focus:border-gold transition-colors"
                    >
                      <option value="" disabled>Pilih lokasi terdekat Anda...</option>
                      {WILAYAH_OPTIONS.map(wil => (
                        <option key={wil} value={wil}>{wil}</option>
                      ))}
                    </select>
                    <p className="text-xs text-navy/50 dark:text-putih/40">
                      * Lokasi membantu kami mencarikan peraturan daerah dan advokat terdekat yang relevan.
                    </p>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      onClick={handleNextStep}
                      className="bg-gold text-navy px-8 py-3 rounded-xl font-bold hover:bg-gold-light transition-colors"
                    >
                      Lanjut
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Kronologi */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setStep(1)} className="p-2 hover:bg-slate-100 dark:hover:bg-putih/10 rounded-lg text-navy/60 dark:text-putih/60 transition-colors">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold text-navy dark:text-putih flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-gold" />
                      Detail Kronologi
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-navy/80 dark:text-putih/80">
                      Ceritakan Apa yang Terjadi
                    </label>
                    <textarea
                      value={formData.kronologi}
                      onChange={(e) => handleInputChange("kronologi", e.target.value)}
                      placeholder="Contoh: Pada tanggal 15 Mei, saya ditipu oleh rekan bisnis saya sejumlah Rp 50 juta untuk proyek bodong..."
                      className="w-full bg-slate-50 dark:bg-navy border border-slate-200 dark:border-putih/20 rounded-xl px-4 py-4 text-navy dark:text-putih focus:outline-none focus:border-gold min-h-[200px] resize-y placeholder:text-navy/40 dark:placeholder:text-putih/30 transition-colors"
                    />
                    <div className="flex justify-between text-xs">
                      <span className={formData.kronologi.length < 100 ? "text-red-500 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
                        {formData.kronologi.length} karakter (Minimal 100)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-navy/80 dark:text-putih/80">
                      Nilai Kerugian Terlibat (Jika Ada)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/50 dark:text-putih/50">Rp</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={formData.jumlah_nilai || ""}
                        onChange={(e) => handleInputChange("jumlah_nilai", e.target.value ? Number(e.target.value) : undefined)}
                        className="w-full bg-slate-50 dark:bg-navy border border-slate-200 dark:border-putih/20 rounded-xl pl-12 pr-4 py-3.5 text-navy dark:text-putih focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      onClick={handleNextStep}
                      className="bg-gold text-navy px-8 py-3 rounded-xl font-bold hover:bg-gold-light transition-colors"
                    >
                      Lanjut
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Status & Urgensi */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setStep(2)} className="p-2 hover:bg-slate-100 dark:hover:bg-putih/10 rounded-lg text-navy/60 dark:text-putih/60 transition-colors">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold text-navy dark:text-putih flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gold" />
                      Status Kasus
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-navy/80 dark:text-putih/80">Tingkat Urgensi</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {URGENCY_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => handleInputChange("urgency_level", opt.value)}
                          className={`flex flex-col gap-1 p-4 rounded-xl border text-left transition-all ${
                            formData.urgency_level === opt.value 
                              ? "bg-gold/10 border-gold" 
                              : "bg-slate-50 dark:bg-navy border-slate-200 dark:border-putih/10 hover:border-slate-300 dark:hover:border-putih/30"
                          }`}
                        >
                          <span className={`font-bold ${formData.urgency_level === opt.value ? 'text-gold' : 'text-navy/80 dark:text-putih/80'}`}>{opt.label}</span>
                          <span className={`text-xs ${opt.color.replace('text-', 'text-opacity-80 text-')}`}>{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-putih/10">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-navy border border-slate-200 dark:border-putih/10 rounded-xl transition-colors">
                      <div>
                        <p className="font-medium text-navy dark:text-putih/90">Sudah Punya Advokat?</p>
                        <p className="text-xs text-navy/60 dark:text-putih/50">Apakah Anda sudah didampingi pengacara untuk kasus ini?</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={formData.sudah_advokat}
                          onChange={(e) => handleInputChange("sudah_advokat", e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-300 dark:bg-putih/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-navy border border-slate-200 dark:border-putih/10 rounded-xl transition-colors">
                      <div>
                        <p className="font-medium text-navy dark:text-putih/90">Sudah Lapor Polisi?</p>
                        <p className="text-xs text-navy/60 dark:text-putih/50">Apakah kasus ini sudah Anda laporkan ke pihak berwajib?</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={formData.sudah_lapor_polisi}
                          onChange={(e) => handleInputChange("sudah_lapor_polisi", e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-300 dark:bg-putih/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                      </label>
                    </div>
                  </div>

                  {/* TOS Agreement Warning */}
                  <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4 mt-6">
                    <div className="flex gap-3">
                      <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-navy/70 dark:text-putih/70 leading-relaxed">
                        Dengan men-submit, informasi kasus Anda akan digunakan untuk analisis hukum yang dipersonalisasi dan rekomendasi advokat. Kami akan menganonimkan data ini untuk statistik agregat (tanpa nama/identitas) demi membantu lembaga terkait melihat tren hukum. <Link href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">Baca selengkapnya.</Link>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-gold text-navy px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gold-light transition-colors disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                          Menganalisis...
                        </>
                      ) : (
                        <>
                          Kirim ke KonsultanAI <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Triage Result (Success) */}
              {step === 4 && triageResult && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bot className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-navy dark:text-putih mb-2">Analisis Awal Selesai</h2>
                    <p className="text-navy/60 dark:text-putih/60 text-sm max-w-md mx-auto">
                      AI kami telah memproses kronologi Anda dan menentukan rekomendasi langkah hukum selanjutnya.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-navy border border-gold/30 rounded-2xl p-6 transition-colors">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-putih/10">
                      <h3 className="font-bold text-navy dark:text-putih">Hasil Triage (Tingkat Keparahan)</h3>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(lvl => (
                          <div 
                            key={lvl} 
                            className={`w-3 h-3 rounded-full ${
                              lvl <= triageResult.severity 
                                ? (triageResult.severity >= 4 ? 'bg-red-500' : triageResult.severity === 3 ? 'bg-gold' : 'bg-green-500') 
                                : 'bg-slate-200 dark:bg-putih/10'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-navy/80 dark:text-putih/80">
                      {triageResult.analysis}
                    </div>
                  </div>

                  {/* Primary Action: Lanjutkan Analisis AI (Full-width) */}
                  <div className="space-y-4 pt-4">
                    {(triageResult.recommendation === 'AI_ANALYSIS' || triageResult.recommendation === 'LEARNING_FIRST' || triageResult.recommendation === 'TEMPLATES') && (
                      <Link 
                        href={`/konsultasi?caseId=${triageResult.case_id}`}
                        onClick={() => {
                          // Store kronologi in sessionStorage so konsultasi page can auto-send
                          try {
                            sessionStorage.setItem('intake_kronologi', formData.kronologi);
                            sessionStorage.setItem('intake_case_type', `${formData.case_type} (${formData.sub_category})`);
                          } catch (e) { /* ignore */ }
                        }}
                        className="flex items-center justify-between w-full p-6 rounded-2xl border-2 border-gold bg-gold/10 hover:bg-gold/20 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gold/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Bot className="w-7 h-7 text-gold" />
                          </div>
                          <div className="text-left">
                            <span className="font-bold text-lg text-gold block">Lanjutkan Analisis AI</span>
                            <span className="text-sm text-navy/60 dark:text-putih/50">AI akan langsung menganalisis kronologi kasus Anda secara mendalam</span>
                          </div>
                        </div>
                        <div className="text-gold text-2xl group-hover:translate-x-1 transition-transform shrink-0 ml-2">→</div>
                      </Link>
                    )}

                    {/* Secondary Actions: Compact row */}
                    <div className="grid grid-cols-3 gap-3">
                      {(triageResult.recommendation === 'ADVOKAT_URGENT' || triageResult.severity >= 3) && (
                        <Link 
                          href="/marketplace"
                          className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl border border-slate-200 dark:border-putih/20 bg-white dark:bg-navy-light hover:bg-slate-50 dark:hover:bg-putih/5 hover:border-gold/50 transition-all text-center group"
                        >
                          <Scale className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
                          <span className="font-semibold text-xs text-navy dark:text-putih leading-tight">Cari Advokat</span>
                        </Link>
                      )}

                      {(triageResult.recommendation === 'LEARNING_FIRST' || triageResult.recommended_modules.length > 0) && (
                        <Link 
                          href="/learning"
                          className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl border border-slate-200 dark:border-putih/20 bg-white dark:bg-navy-light hover:bg-slate-50 dark:hover:bg-putih/5 hover:border-blue-400/50 transition-all text-center group"
                        >
                          <BookOpen className="w-5 h-5 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                          <span className="font-semibold text-xs text-navy dark:text-putih leading-tight">Modul Hukum</span>
                        </Link>
                      )}

                      {(triageResult.recommendation === 'TEMPLATES' || triageResult.recommended_templates.length > 0) && (
                        <Link 
                          href="/templates"
                          className="flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl border border-slate-200 dark:border-putih/20 bg-white dark:bg-navy-light hover:bg-slate-50 dark:hover:bg-putih/5 hover:border-green-400/50 transition-all text-center group"
                        >
                          <FileText className="w-5 h-5 text-green-500 dark:text-green-400 group-hover:scale-110 transition-transform" />
                          <span className="font-semibold text-xs text-navy dark:text-putih leading-tight">Template Dokumen</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
