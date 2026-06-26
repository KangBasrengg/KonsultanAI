"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, FileText, Send, Download, AlertTriangle, Copy, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/components/auth/AuthProvider";
import ReactMarkdown from "react-markdown";

const CONTRACT_TYPES = [
  { value: "kontrak_kerja", label: "Kontrak Kerja Karyawan", icon: "👷", desc: "PKWT / PKWTT untuk karyawan" },
  { value: "sewa_menyewa", label: "Sewa Menyewa", icon: "🏠", desc: "Sewa tempat usaha, ruko, kios" },
  { value: "jual_beli", label: "Jual Beli", icon: "🤝", desc: "Perjanjian jual beli barang/jasa" },
  { value: "kemitraan", label: "Kemitraan / Kerjasama", icon: "🤲", desc: "MoU, partnership, bagi hasil" },
  { value: "freelance", label: "Kontrak Freelance", icon: "💻", desc: "Perjanjian kerja lepas / outsource" },
  { value: "franchise", label: "Franchise / Waralaba", icon: "🍜", desc: "Perjanjian franchise / lisensi" },
];

const JENIS_USAHA = [
  "Warung / Toko Kelontong", "Konveksi / Garment", "F&B / Kuliner", "Jasa Servis / Reparasi",
  "Pertanian / Peternakan", "Startup / Tech", "Salon / Barbershop", "Bengkel", "Percetakan",
  "Lainnya",
];

export default function GeneratorPage() {
  const { user, openAuthModal } = useAuth();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    contract_type: "",
    jenis_usaha: "",
    nama_pihak_1: "",
    nama_pihak_2: "",
    detail: "",
    durasi: "",
    nilai: "",
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleGenerate = async () => {
    if (!user) { openAuthModal("login"); return; }
    setIsGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/legalkita/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          setError(data.message || data.error || "Limit tercapai.");
        } else {
          throw new Error(data.error || data.message || "Gagal generate");
        }
        return;
      }
      setResult(data.contract);
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 pb-28">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/legalkita" className="p-2 hover:bg-putih/10 rounded-lg text-putih/60 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-putih flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-400" />
                Generator <span className="text-amber-400">Kontrak</span>
              </h1>
              <p className="text-putih/50 text-sm">Buat dokumen legal UMKM dalam hitungan menit</p>
            </div>
          </div>

          {/* Stepper */}
          {step < 3 && (
            <div className="flex items-center justify-center mb-8 gap-2">
              {[1, 2].map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= num ? "bg-amber-500 text-navy" : "bg-putih/10 text-putih/40"}`}>
                    {num}
                  </div>
                  {num < 2 && <div className={`w-12 h-1 mx-2 rounded ${step > num ? "bg-amber-500" : "bg-putih/10"}`} />}
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Form Container */}
          <div className="bg-navy-light/40 border border-putih/15 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-sm">
            <AnimatePresence mode="wait">
              {/* Step 1: Contract Type */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-xl font-bold text-putih flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" /> Pilih Jenis Kontrak
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CONTRACT_TYPES.map(ct => (
                      <button key={ct.value} onClick={() => update("contract_type", ct.value)}
                        className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${form.contract_type === ct.value ? "bg-amber-500/10 border-amber-500 text-amber-400" : "bg-navy border-putih/10 text-putih/70 hover:border-putih/30"}`}>
                        <span className="text-2xl">{ct.icon}</span>
                        <div>
                          <span className="font-medium block">{ct.label}</span>
                          <span className="text-xs opacity-60">{ct.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-putih/80">Jenis Usaha Anda</label>
                    <select value={form.jenis_usaha} onChange={e => update("jenis_usaha", e.target.value)}
                      className="w-full bg-navy border border-putih/20 rounded-xl px-4 py-3.5 text-putih focus:outline-none focus:border-amber-500 transition-colors">
                      <option value="" disabled>Pilih jenis usaha...</option>
                      {JENIS_USAHA.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button onClick={() => { if (!form.contract_type || !form.jenis_usaha) { setError("Pilih jenis kontrak dan jenis usaha."); return; } setError(""); setStep(2); }}
                      className="bg-amber-500 text-navy px-8 py-3 rounded-xl font-bold hover:bg-amber-400 transition-colors flex items-center gap-2">
                      Lanjut <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="flex items-center gap-4 mb-2">
                    <button onClick={() => setStep(1)} className="p-2 hover:bg-putih/10 rounded-lg text-putih/60"><ArrowLeft className="w-5 h-5" /></button>
                    <h2 className="text-xl font-bold text-putih">Detail Kontrak</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-putih/80">Nama Pihak Pertama</label>
                      <input type="text" value={form.nama_pihak_1} onChange={e => update("nama_pihak_1", e.target.value)} placeholder="Nama Anda / Perusahaan"
                        className="w-full bg-navy border border-putih/20 rounded-xl px-4 py-3 text-putih focus:outline-none focus:border-amber-500 placeholder:text-putih/30" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-putih/80">Nama Pihak Kedua</label>
                      <input type="text" value={form.nama_pihak_2} onChange={e => update("nama_pihak_2", e.target.value)} placeholder="Nama pihak lawan"
                        className="w-full bg-navy border border-putih/20 rounded-xl px-4 py-3 text-putih focus:outline-none focus:border-amber-500 placeholder:text-putih/30" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-putih/80">Durasi / Jangka Waktu</label>
                      <input type="text" value={form.durasi} onChange={e => update("durasi", e.target.value)} placeholder="Misal: 1 tahun, 6 bulan"
                        className="w-full bg-navy border border-putih/20 rounded-xl px-4 py-3 text-putih focus:outline-none focus:border-amber-500 placeholder:text-putih/30" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-putih/80">Nilai Kontrak (opsional)</label>
                      <input type="text" value={form.nilai} onChange={e => update("nilai", e.target.value)} placeholder="Misal: Rp 5.000.000/bulan"
                        className="w-full bg-navy border border-putih/20 rounded-xl px-4 py-3 text-putih focus:outline-none focus:border-amber-500 placeholder:text-putih/30" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-putih/80">Detail Tambahan & Ketentuan Khusus</label>
                    <textarea value={form.detail} onChange={e => update("detail", e.target.value)}
                      placeholder="Jelaskan detail spesifik yang ingin dicantumkan: posisi kerja, alamat properti, jenis barang, syarat khusus, dll."
                      className="w-full bg-navy border border-putih/20 rounded-xl px-4 py-4 text-putih focus:outline-none focus:border-amber-500 min-h-[150px] resize-y placeholder:text-putih/30" />
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-putih/60 leading-relaxed">
                      Dokumen ini dihasilkan oleh AI dan merupakan <strong className="text-putih/80">draft awal</strong>, bukan pengganti nasihat pengacara berlisensi.
                      Untuk kasus kompleks, konsultasikan dengan profesional hukum.
                    </p>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button onClick={() => setStep(1)} className="text-putih/50 px-6 py-3 rounded-xl hover:bg-putih/5 transition-colors">Kembali</button>
                    <button onClick={handleGenerate} disabled={isGenerating || !form.nama_pihak_1 || !form.nama_pihak_2}
                      className="bg-amber-500 text-navy px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-400 transition-colors disabled:opacity-50">
                      {isGenerating ? (<><div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> Generating...</>) : (<>Generate Kontrak <Send className="w-4 h-4" /></>)}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Result */}
              {step === 3 && result && (
                <motion.div key="s3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-putih flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" /> Kontrak Berhasil Dibuat
                    </h2>
                    <div className="flex gap-2">
                      <button onClick={handleCopy} className="flex items-center gap-2 text-sm bg-navy border border-putih/20 px-4 py-2 rounded-lg hover:bg-putih/10 transition-colors text-putih">
                        {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Tersalin!" : "Salin"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-navy border border-putih/15 rounded-2xl p-6 prose prose-sm dark:prose-invert max-w-none text-putih/90 overflow-auto max-h-[600px]">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-putih/60 leading-relaxed">
                      <strong className="text-amber-400">⚠️ Disclaimer:</strong> Dokumen ini dihasilkan oleh AI dan bukan merupakan nasihat hukum resmi.
                      Untuk kasus yang membutuhkan kepastian hukum, konsultasikan dengan pengacara berlisensi.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={() => { setStep(1); setResult(""); setForm({ contract_type: "", jenis_usaha: "", nama_pihak_1: "", nama_pihak_2: "", detail: "", durasi: "", nilai: "" }); }}
                      className="flex-1 py-3 rounded-xl border border-putih/20 text-putih font-bold hover:bg-putih/5 transition-colors">
                      Buat Kontrak Baru
                    </button>
                    <Link href="/legalkita" className="flex-1 py-3 rounded-xl bg-amber-500 text-navy font-bold text-center hover:bg-amber-400 transition-colors">
                      Kembali ke LegalKita
                    </Link>
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
