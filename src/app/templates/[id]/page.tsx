"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, FileText, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/components/auth/AuthProvider";
import { getTemplateById } from "@/lib/templates-data";

export default function TemplateViewerPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, profile } = useAuth();
  const resolvedParams = use(params);
  const template = getTemplateById(resolvedParams.id);

  const [formData, setFormData] = useState<Record<string, string>>(() => {
    if (!template) return {};
    const initial: Record<string, string> = {};
    template.placeholders.forEach(p => {
      initial[p.key] = "";
    });
    return initial;
  });

  const [isExporting, setIsExporting] = useState(false);

  const isLocked = () => {
    if (!template) return false;
    const requiredTier = template.tier_required;
    if (!requiredTier || requiredTier === "free") return false;
    if (!user) return true;
    if (profile?.role === "admin" || profile?.role === "advokat") return false;

    const userTier = (profile?.tier || "free").toLowerCase().replace("-", "");
    const tiers = ["free", "topup kuota", "pro", "enterprise"];
    const normalizedUserTier = userTier.includes("topup") ? "topup kuota" : (userTier === "professional" ? "pro" : userTier);

    const reqIndex = tiers.indexOf(requiredTier);
    const userIndex = tiers.indexOf(normalizedUserTier);

    return reqIndex > userIndex;
  };

  if (!template) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-300">
        <FileText className="w-16 h-16 text-navy/20 dark:text-putih/20 mb-4" />
        <h1 className="text-2xl font-bold text-navy dark:text-putih mb-2">Template Tidak Ditemukan</h1>
        <Link href="/templates" className="text-gold hover:underline">Kembali ke Koleksi Template</Link>
      </main>
    );
  }

  if (isLocked()) {
    return (
      <main className="min-h-screen flex flex-col transition-colors duration-300">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-28 flex items-center justify-center">
          <div className="max-w-md w-full bg-white dark:bg-navy-light/60 border border-slate-200 dark:border-putih/10 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 bg-gold/10 text-gold rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-navy dark:text-putih mb-2">Template Terkunci</h2>
            <p className="text-sm text-navy/60 dark:text-putih/60 mb-6 leading-relaxed">
              Template <span className="font-semibold text-gold">{template.title}</span> merupakan dokumen hukum yang hanya dapat diakses oleh pengguna paket <span className="font-semibold uppercase text-gold">{template.tier_required}</span>.
            </p>
            <div className="space-y-3">
              <Link
                href="/checkout?plan=Pro"
                className="w-full flex items-center justify-center gap-2 bg-gold text-white dark:text-navy py-3.5 rounded-xl font-bold hover:bg-gold-light transition-all shadow-lg shadow-gold/20"
              >
                Upgrade Paket
              </Link>
              <Link
                href="/templates"
                className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-putih/10 text-navy dark:text-putih py-3 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-putih/20 transition-all text-sm"
              >
                Kembali ke Koleksi
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }


  // Replace placeholders in content
  let parsedContent = template.content;
  template.placeholders.forEach(p => {
    const val = formData[p.key] || `[${p.key}]`;
    // Replace all instances
    parsedContent = parsedContent.split(`[${p.key}]`).join(val);
  });

  const handleExportMarkdown = () => {
    const blob = new Blob([parsedContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.id}-draft.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 500);
  };

  return (
    <main className="min-h-screen flex flex-col print:bg-white print:text-black transition-colors duration-300">
      <div className="print:hidden">
        <Navbar />
      </div>
      
      <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 print:p-0 print:m-0">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 print:block">
          
          {/* Left Column: Form (Hidden in Print) */}
          <div className="w-full lg:w-1/3 space-y-6 print:hidden">
            <Link href="/templates" className="inline-flex items-center gap-2 text-navy/60 dark:text-putih/60 hover:text-gold transition-colors mb-4 font-medium">
              <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
            </Link>

            <div className="bg-white/80 dark:bg-navy-light/40 border border-slate-200 dark:border-putih/20 rounded-3xl p-6 backdrop-blur-md shadow-lg dark:shadow-none transition-all">
              <h2 className="text-xl font-bold text-navy dark:text-putih mb-2">{template.title}</h2>
              <p className="text-sm text-navy/60 dark:text-putih/50 mb-6 leading-relaxed">{template.description}</p>

              <div className="space-y-4">
                <h3 className="font-semibold text-gold border-b border-slate-200 dark:border-putih/10 pb-2">Isi Data Dokumen</h3>
                {template.placeholders.map(p => (
                  <div key={p.key} className="space-y-1.5">
                    <label className="block text-xs font-medium text-navy/80 dark:text-putih/80">
                      {p.label} {p.required && <span className="text-red-500 dark:text-red-400">*</span>}
                    </label>
                    {p.type === 'textarea' ? (
                      <textarea
                        value={formData[p.key] || ""}
                        onChange={e => setFormData({...formData, [p.key]: e.target.value})}
                        className="w-full bg-white dark:bg-navy border border-slate-200 dark:border-putih/20 rounded-xl px-3 py-2 text-sm text-navy dark:text-putih focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 resize-y min-h-[80px] transition-all shadow-inner"
                      />
                    ) : (
                      <input
                        type={p.type}
                        value={formData[p.key] || ""}
                        onChange={e => setFormData({...formData, [p.key]: e.target.value})}
                        className="w-full bg-white dark:bg-navy border border-slate-200 dark:border-putih/20 rounded-xl px-3 py-2.5 text-sm text-navy dark:text-putih focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all shadow-inner"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3">
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="w-full flex items-center justify-center gap-2 bg-gold text-white dark:text-navy px-4 py-3.5 rounded-xl font-bold hover:bg-gold-light transition-all shadow-md shadow-gold/20"
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? "Menyiapkan PDF..." : "Cetak / Export PDF"}
                </button>
                <button
                  onClick={handleExportMarkdown}
                  className="w-full flex items-center justify-center gap-2 bg-slate-50 dark:bg-navy border border-slate-200 dark:border-putih/20 text-navy dark:text-putih px-4 py-3.5 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-putih/10 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Download Word/Markdown (.md)
                </button>
              </div>

              <div className="mt-6 flex gap-3 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
                <CheckCircle2 className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0" />
                <p className="text-[10px] sm:text-xs text-navy/70 dark:text-putih/70 leading-relaxed">
                  Data yang Anda isikan di sini hanya diproses di browser Anda (client-side) dan tidak disimpan di server kami demi privasi Anda.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Preview / Print Area */}
          <div className="w-full lg:w-2/3 print:w-full">
            <div className="bg-white text-black min-h-[842px] rounded-2xl shadow-xl border border-slate-200 dark:border-none print:shadow-none p-10 md:p-16 text-sm font-serif">
              <div className="prose prose-sm md:prose-base max-w-none text-black
                  prose-headings:text-black prose-headings:font-bold prose-headings:text-center
                  prose-p:leading-relaxed prose-p:text-justify prose-strong:text-black">
                <ReactMarkdown>
                  {parsedContent}
                </ReactMarkdown>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
