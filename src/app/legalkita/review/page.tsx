"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, AlertTriangle, CheckCircle, Copy, FileText, Upload, X, File, Sparkles, Lock } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/components/auth/AuthProvider";
import ReactMarkdown from "react-markdown";

async function extractPdfText(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "";

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item: any) => item.str).join(" ");
    pages.push(text);
  }

  return pages.join("\n\n");
}

export default function ReviewPage() {
  const { user, profile, openAuthModal } = useAuth();
  const [documentText, setDocumentText] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploadedFile(file);

    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "txt") {
      const text = await file.text();
      setDocumentText(text);
    } else if (ext === "pdf") {
      setIsExtracting(true);
      try {
        const text = await extractPdfText(file);
        if (!text.trim()) {
          setError("PDF tidak mengandung teks yang bisa diekstrak. Coba tempel teks secara manual.");
          setUploadedFile(null);
        } else {
          setDocumentText(text);
        }
      } catch (err: any) {
        console.error("PDF extraction error:", err);
        setError("Gagal membaca file PDF. Pastikan file tidak terenkripsi.");
        setUploadedFile(null);
      } finally {
        setIsExtracting(false);
      }
    } else {
      setError("Format file tidak didukung. Gunakan .pdf atau .txt");
      setUploadedFile(null);
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = () => {
    setUploadedFile(null);
    setDocumentText("");
  };

  const handleReview = async () => {
    if (!user) { openAuthModal("login"); return; }
    if (documentText.length < 100) { setError("Dokumen terlalu pendek (minimal 100 karakter)."); return; }
    setIsReviewing(true);
    setError("");
    try {
      const res = await fetch("/api/legalkita/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document: documentText }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          setError(data.message || data.error || "Limit tercapai.");
        } else {
          throw new Error(data.error || data.message || "Gagal review");
        }
        return;
      }
      setResult(data.review);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsReviewing(false);
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
                <Search className="w-6 h-6 text-emerald-400" />
                Review <span className="text-emerald-400">Dokumen</span>
              </h1>
              <p className="text-putih/50 text-sm">Upload file PDF / tempel dokumen, AI cek risiko & celah</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!result ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-navy-light/40 border border-putih/15 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-sm space-y-6">
              
              <h2 className="text-lg font-bold text-putih flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Upload atau Tempel Dokumen
              </h2>

              {/* File Upload Area */}
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />

                {!uploadedFile ? (
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-putih/20 hover:border-emerald-500/50 bg-navy/50 cursor-pointer transition-all group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-putih/80 font-medium">Klik untuk upload file</p>
                      <p className="text-putih/40 text-xs mt-1">Mendukung PDF dan TXT • Maks 10MB</p>
                    </div>
                  </label>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <File className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-putih font-medium text-sm truncate">{uploadedFile.name}</p>
                      <p className="text-putih/50 text-xs">{(uploadedFile.size / 1024).toFixed(1)} KB • Teks berhasil diekstrak</p>
                    </div>
                    <button onClick={removeFile} className="p-2 hover:bg-putih/10 rounded-lg text-putih/50 hover:text-red-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {isExtracting && (
                  <div className="flex items-center justify-center gap-2 py-4 text-emerald-400 text-sm">
                    <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                    Mengekstrak teks dari PDF...
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-putih/10" />
                <span className="text-putih/30 text-xs font-medium">atau tempel teks langsung</span>
                <div className="flex-1 h-px bg-putih/10" />
              </div>

              {/* Text Area */}
              <textarea
                value={documentText}
                onChange={e => { setDocumentText(e.target.value); if (uploadedFile) setUploadedFile(null); }}
                placeholder={"Tempel (paste) isi dokumen hukum Anda di sini.\n\nContoh:\n- Kontrak kerja karyawan\n- Perjanjian sewa tempat usaha\n- MoU kerjasama bisnis"}
                className="w-full bg-navy border border-putih/20 rounded-xl px-4 py-4 text-putih focus:outline-none focus:border-emerald-500 min-h-[200px] resize-y placeholder:text-putih/30 text-sm leading-relaxed"
              />
              <div className="flex justify-between text-xs">
                <span className={documentText.length < 100 ? "text-red-400" : "text-green-400"}>
                  {documentText.length} karakter (minimal 100)
                </span>
              </div>

              {/* Disclaimer */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-putih/60 leading-relaxed">
                  Hasil review adalah <strong className="text-putih/80">analisis AI</strong> dan bukan pengganti pendapat pengacara berlisensi.
                  Untuk dokumen bernilai tinggi, konsultasikan dengan profesional hukum.
                </p>
              </div>

              <div className="flex justify-end">
                <button onClick={handleReview} disabled={isReviewing || documentText.length < 100 || isExtracting}
                  className="bg-emerald-500 text-navy px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-400 transition-colors disabled:opacity-50">
                  {isReviewing ? (
                    <><div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> Menganalisis...</>
                  ) : (
                    <><Search className="w-4 h-4" /> Review Dokumen</>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-navy-light/40 border border-putih/15 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-sm space-y-6">
              
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-putih flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" /> Hasil Review
                </h2>
                <button onClick={handleCopy} className="flex items-center gap-2 text-sm bg-navy border border-putih/20 px-4 py-2 rounded-lg hover:bg-putih/10 transition-colors text-putih">
                  {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Tersalin!" : "Salin"}
                </button>
              </div>

              <div className="bg-navy border border-putih/15 rounded-2xl p-6 prose prose-sm dark:prose-invert max-w-none text-putih/90 overflow-auto max-h-[600px]">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-putih/60 leading-relaxed">
                  <strong className="text-amber-400">⚠️ Disclaimer:</strong> Hasil review ini dihasilkan oleh AI dan bukan merupakan nasihat hukum resmi.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => { setResult(""); setDocumentText(""); setUploadedFile(null); }}
                  className="flex-1 py-3 rounded-xl border border-putih/20 text-putih font-bold hover:bg-putih/5 transition-colors">
                  Review Dokumen Lain
                </button>
                <Link href="/legalkita" className="flex-1 py-3 rounded-xl bg-emerald-500 text-navy font-bold text-center hover:bg-emerald-400 transition-colors">
                  Kembali ke LegalKita
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
