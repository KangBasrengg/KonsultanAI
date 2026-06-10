"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, User, Briefcase, Scale, Upload,
  Check, AlertCircle, FileText, Shield, X
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LEGAL_FIELDS, type LegalFieldId } from "@/lib/marketplace-types";
import LoadingScreen from "@/components/auth/LoadingScreen";

const STEPS = [
  { id: 1, title: "Informasi Pribadi", icon: User },
  { id: 2, title: "Informasi Profesional", icon: Briefcase },
  { id: 3, title: "Informasi Rekening", icon: FileText },
  { id: 4, title: "Bidang Hukum", icon: Scale },
  { id: 5, title: "Upload Dokumen", icon: Upload },
];

interface SpecEntry {
  field: LegalFieldId;
  expertise_percent: number;
}

function RegistrationContent() {
  const { user, isVerifying, openAuthModal, refreshProfile } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Step 1
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  // Step 2
  const [licenseNumber, setLicenseNumber] = useState("");
  const [organization, setOrganization] = useState("");
  const [experienceYears, setExperienceYears] = useState<number>(0);
  const [casesHandled, setCasesHandled] = useState<string>("");
  const [bio, setBio] = useState("");

  // Step 3
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [consultationRate, setConsultationRate] = useState<number>(50000);

  // Step 4
  const [specializations, setSpecializations] = useState<SpecEntry[]>([]);

  // Step 5
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [kartuAdvokatFile, setKartuAdvokatFile] = useState<File | null>(null);
  const [sumpahFile, setSumpahFile] = useState<File | null>(null);

  // Pre-fill email from user
  useState(() => {
    if (user?.email) setEmail(user.email);
  });

  const toggleSpecialization = (fieldId: LegalFieldId) => {
    setSpecializations(prev => {
      const exists = prev.find(s => s.field === fieldId);
      if (exists) {
        return prev.filter(s => s.field !== fieldId);
      }
      return [...prev, { field: fieldId, expertise_percent: 80 }];
    });
  };

  const updatePercent = (fieldId: LegalFieldId, value: number) => {
    setSpecializations(prev =>
      prev.map(s => s.field === fieldId ? { ...s, expertise_percent: Math.min(100, Math.max(1, value)) } : s)
    );
  };

  const canProceed = () => {
    switch (step) {
      case 1: return fullName.trim() && email.trim() && phone.trim() && city.trim();
      case 2: return licenseNumber.trim() && organization.trim() && experienceYears > 0;
      case 3: return bankName.trim() && bankAccount.trim() && consultationRate >= 10000;
      case 4: return specializations.length >= 1 && specializations.every(s => s.expertise_percent >= 1);
      case 5: return photoFile !== null && ktpFile !== null && kartuAdvokatFile !== null;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    setError(null);

    try {
      // 1. Create advocate record
      const { data: advocate, error: advErr } = await supabase
        .from("advocates")
        .insert({
          user_id: user.id,
          full_name: fullName,
          email,
          phone,
          city,
          license_number: licenseNumber,
          organization,
          experience_years: experienceYears,
          cases_handled: casesHandled ? parseInt(casesHandled) : null,
          bio,
          bank_name: bankName,
          bank_account: bankAccount,
          consultation_rate: consultationRate,
          verification_status: "pending",
        })
        .select("id")
        .single();

      if (advErr) throw new Error(advErr.message);

      // 2. Insert specializations
      const specInserts = specializations.map(s => ({
        advocate_id: advocate.id,
        field: s.field,
        expertise_percent: s.expertise_percent,
      }));
      const { error: specErr } = await supabase.from("advocate_specializations").insert(specInserts);
      if (specErr) throw new Error(specErr.message);

      // 3. Upload documents
      const uploadDoc = async (file: File, type: string) => {
        const ext = file.name.split(".").pop();
        const path = `advocates/${advocate.id}/${type}_${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("advocate-docs").upload(path, file);
        if (upErr) throw new Error(`Upload ${type} gagal: ${upErr.message}`);
        
        const { data: urlData } = supabase.storage.from("advocate-docs").getPublicUrl(path);
        
        if (type === "foto_formal") {
          await supabase.from("advocates").update({ photo_url: urlData.publicUrl }).eq("id", advocate.id);
        } else {
          await supabase.from("advocate_documents").insert({
            advocate_id: advocate.id,
            document_type: type,
            file_url: urlData.publicUrl,
          });
        }
      };

      await uploadDoc(photoFile!, "foto_formal");

      await uploadDoc(ktpFile!, "ktp");
      await uploadDoc(kartuAdvokatFile!, "kartu_advokat");
      if (sumpahFile) {
        await uploadDoc(sumpahFile, "berita_acara_sumpah");
      }

      // 4. Update user role
      const { error: userErr } = await supabase.from("users").update({ role: "advokat", advocate_id: advocate.id }).eq("id", user.id);
      if (userErr) throw new Error(`Gagal mengupdate role: ${userErr.message}`);
      
      await refreshProfile();

      setSuccess(true);
    } catch (e: any) {
      console.error("Registration failed:", e);
      setError(e.message || "Pendaftaran gagal. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isVerifying) return <LoadingScreen />;

  if (!user) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="bg-navy-light/50 border border-putih/20 p-8 rounded-3xl">
            <Scale className="w-16 h-16 text-gold/80 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-3">Pendaftaran Advokat</h1>
            <p className="text-putih/60 mb-8 text-sm leading-relaxed">
              Untuk mendaftar sebagai advokat, Anda harus memiliki akun KonsultanAI terlebih dahulu. Silakan login atau buat akun baru.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => openAuthModal("register")} 
                className="w-full bg-gold text-navy px-8 py-3.5 rounded-xl font-bold hover:bg-gold-light transition-colors"
              >
                Buat Akun Baru
              </button>
              <button 
                onClick={() => openAuthModal("login")} 
                className="w-full bg-putih/5 text-putih px-8 py-3.5 rounded-xl font-semibold hover:bg-putih/10 transition-colors"
              >
                Sudah Punya Akun? Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Pendaftaran Berhasil!</h1>
          <p className="text-putih/60 mb-2">Akun advokat Anda sedang dalam proses verifikasi.</p>
          <p className="text-putih/40 text-sm mb-8">
            Kami akan memverifikasi data Anda dalam <strong className="text-gold">maksimal 2 hari kerja</strong>. Anda akan menerima notifikasi melalui email.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/" className="bg-navy-light border border-putih/15 text-putih px-6 py-2.5 rounded-full font-medium hover:bg-putih/10 transition-colors">
              Kembali
            </Link>
            <Link href="/marketplace" className="bg-gold text-navy px-6 py-2.5 rounded-full font-bold hover:bg-gold-light transition-colors">
              Lihat Marketplace
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy text-putih">
      {/* Header */}
      <header className="bg-navy-dark border-b border-putih/20 py-4 px-6 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/marketplace" className="w-9 h-9 rounded-full bg-navy-light flex items-center justify-center hover:bg-putih/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-bold text-lg flex items-center gap-2">
                <Scale className="w-5 h-5 text-gold" />
                Daftar Advokat
              </h1>
              <p className="text-xs text-putih/50">Langkah {step} dari 5</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-10">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    isDone ? "bg-green-500/20 text-green-400" :
                    isActive ? "bg-gold/20 text-gold border border-gold/30" :
                    "bg-putih/5 text-putih/30"
                  }`}>
                    {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-[10px] mt-2 hidden sm:block ${isActive ? "text-gold" : "text-putih/30"}`}>
                    {s.title}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-3 transition-colors ${isDone ? "bg-green-500/40" : "bg-putih/10"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-300 font-medium">Error</p>
              <p className="text-xs text-red-400/80 mt-1">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-auto"><X className="w-4 h-4 text-red-400" /></button>
          </div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 1: Personal */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold mb-6">Informasi Pribadi</h2>
                <div>
                  <label className="text-sm text-putih/60 mb-1.5 block">Nama Lengkap *</label>
                  <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Dr. Ahmad Sudirman, S.H., M.H." className="w-full bg-navy-light border border-putih/15 rounded-xl px-4 py-3 text-putih placeholder:text-putih/25 focus:outline-none focus:border-gold/40" />
                </div>
                <div>
                  <label className="text-sm text-putih/60 mb-1.5 block">Email *</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="advokat@email.com" className="w-full bg-navy-light border border-putih/15 rounded-xl px-4 py-3 text-putih placeholder:text-putih/25 focus:outline-none focus:border-gold/40" />
                </div>
                <div>
                  <label className="text-sm text-putih/60 mb-1.5 block">Nomor HP *</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="08123456789" className="w-full bg-navy-light border border-putih/15 rounded-xl px-4 py-3 text-putih placeholder:text-putih/25 focus:outline-none focus:border-gold/40" />
                </div>
                <div>
                  <label className="text-sm text-putih/60 mb-1.5 block">Kota Domisili *</label>
                  <input value={city} onChange={e => setCity(e.target.value)} placeholder="Jakarta" className="w-full bg-navy-light border border-putih/15 rounded-xl px-4 py-3 text-putih placeholder:text-putih/25 focus:outline-none focus:border-gold/40" />
                </div>
              </div>
            )}

            {/* Step 2: Professional */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold mb-6">Informasi Profesional</h2>
                <div>
                  <label className="text-sm text-putih/60 mb-1.5 block">Nomor Induk Advokat *</label>
                  <input value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder="01.12345" className="w-full bg-navy-light border border-putih/15 rounded-xl px-4 py-3 text-putih placeholder:text-putih/25 focus:outline-none focus:border-gold/40" />
                </div>
                <div>
                  <label className="text-sm text-putih/60 mb-1.5 block">Organisasi Advokat *</label>
                  <input value={organization} onChange={e => setOrganization(e.target.value)} placeholder="PERADI" className="w-full bg-navy-light border border-putih/15 rounded-xl px-4 py-3 text-putih placeholder:text-putih/25 focus:outline-none focus:border-gold/40" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-putih/60 mb-1.5 block">Pengalaman (Tahun) *</label>
                    <input value={experienceYears || ""} onChange={e => setExperienceYears(parseInt(e.target.value) || 0)} type="number" min="1" placeholder="5" className="w-full bg-navy-light border border-putih/15 rounded-xl px-4 py-3 text-putih placeholder:text-putih/25 focus:outline-none focus:border-gold/40" />
                  </div>
                  <div>
                    <label className="text-sm text-putih/60 mb-1.5 block">Kasus Ditangani</label>
                    <input value={casesHandled} onChange={e => setCasesHandled(e.target.value)} type="number" min="0" placeholder="Opsional" className="w-full bg-navy-light border border-putih/15 rounded-xl px-4 py-3 text-putih placeholder:text-putih/25 focus:outline-none focus:border-gold/40" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-putih/60 mb-1.5 block">Biografi Singkat</label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} placeholder="Ceritakan tentang keahlian dan pengalaman Anda..." className="w-full bg-navy-light border border-putih/15 rounded-xl px-4 py-3 text-putih placeholder:text-putih/25 focus:outline-none focus:border-gold/40 resize-none" />
                </div>
              </div>
            )}

            {/* Step 3: Bank Account */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold mb-6">Informasi Rekening Bank</h2>
                <div className="bg-navy-light/40 border border-putih/20 rounded-2xl p-5 mb-6">
                  <p className="text-sm text-putih/60">
                    <strong className="text-gold">Perhatian:</strong> Informasi rekening bank ini <strong className="text-putih">TIDAK AKAN DITAMPILKAN KEPADA PUBLIK</strong>. 
                    Hanya digunakan oleh platform KonsultanAI untuk memproses penarikan saldo pendapatan Anda.
                  </p>
                </div>
                <div>
                  <label className="text-sm text-putih/60 mb-1.5 block">Nama Bank *</label>
                  <input value={bankName} onChange={e => setBankName(e.target.value)} placeholder="Contoh: BCA, Mandiri, BNI" className="w-full bg-navy-light border border-putih/15 rounded-xl px-4 py-3 text-putih placeholder:text-putih/25 focus:outline-none focus:border-gold/40" />
                </div>
                <div>
                  <label className="text-sm text-putih/60 mb-1.5 block">Nomor Rekening *</label>
                  <input value={bankAccount} onChange={e => setBankAccount(e.target.value)} placeholder="Contoh: 1234567890 (a.n Dr. Ahmad Sudirman)" className="w-full bg-navy-light border border-putih/15 rounded-xl px-4 py-3 text-putih placeholder:text-putih/25 focus:outline-none focus:border-gold/40" />
                </div>
                <div>
                  <label className="text-sm text-putih/60 mb-1.5 block">Tarif Konsultasi (Rp/Sesi) *</label>
                  <input value={consultationRate || ""} onChange={e => setConsultationRate(parseInt(e.target.value) || 0)} type="number" min="10000" step="10000" placeholder="50000" className="w-full bg-navy-light border border-putih/15 rounded-xl px-4 py-3 text-putih placeholder:text-putih/25 focus:outline-none focus:border-gold/40" />
                </div>
              </div>
            )}

            {/* Step 4: Specializations */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold mb-2">Bidang Hukum</h2>
                  <p className="text-sm text-putih/50 mb-6">Pilih minimal 1 bidang dan tentukan persentase keahlian Anda (1-100%).</p>
                </div>
                <div className="space-y-3">
                  {LEGAL_FIELDS.map(field => {
                    const entry = specializations.find(s => s.field === field.id);
                    const isSelected = !!entry;
                    return (
                      <div
                        key={field.id}
                        className={`border rounded-xl p-4 transition-all ${
                          isSelected
                            ? "bg-gold/5 border-gold/30"
                            : "bg-navy-light/30 border-putih/20 hover:border-putih/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => toggleSpecialization(field.id)}
                            className="flex items-center gap-3"
                          >
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              isSelected ? "bg-gold border-gold" : "border-putih/30"
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-navy" />}
                            </div>
                            <span className={`text-sm font-medium ${isSelected ? "text-putih" : "text-putih/60"}`}>
                              {field.label}
                            </span>
                          </button>
                          {isSelected && (
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="1"
                                max="100"
                                value={entry!.expertise_percent}
                                onChange={e => updatePercent(field.id, parseInt(e.target.value))}
                                className="w-24 accent-gold"
                              />
                              <span className="text-xs font-bold text-gold w-10 text-right">
                                {entry!.expertise_percent}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 5: Documents */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Upload Dokumen</h2>
                  <p className="text-sm text-putih/50 mb-6">Unggah dokumen untuk verifikasi akun advokat Anda.</p>
                </div>

                {/* Foto Formal */}
                <FileUploadField
                  label="Foto Formal (Tampil di Publik) *"
                  file={photoFile}
                  onFileChange={setPhotoFile}
                  accept="image/*"
                />

                {/* KTP */}
                <FileUploadField
                  label="KTP *"
                  file={ktpFile}
                  onFileChange={setKtpFile}
                  accept="image/*,.pdf"
                />

                {/* Kartu Advokat */}
                <FileUploadField
                  label="Kartu Advokat *"
                  file={kartuAdvokatFile}
                  onFileChange={setKartuAdvokatFile}
                  accept="image/*,.pdf"
                />

                {/* Berita Acara Sumpah */}
                <FileUploadField
                  label="Berita Acara Sumpah (Opsional)"
                  file={sumpahFile}
                  onFileChange={setSumpahFile}
                  accept="image/*,.pdf"
                  optional
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-putih/20">
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="flex items-center gap-2 text-sm text-putih/60 hover:text-putih transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Sebelumnya
          </button>

          {step < 5 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-gold text-navy px-6 py-2.5 rounded-xl font-bold hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Selanjutnya
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || submitting}
              className="flex items-center gap-2 bg-gold text-navy px-6 py-2.5 rounded-xl font-bold hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
              {submitting ? "Mendaftar..." : "Kirim Pendaftaran"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

// File Upload Component
function FileUploadField({
  label,
  file,
  onFileChange,
  accept = "image/*,.pdf",
  optional = false
}: {
  label: string;
  file: File | null;
  onFileChange: (f: File | null) => void;
  accept?: string;
  optional?: boolean;
}) {
  return (
    <div className={`border-2 border-dashed rounded-xl p-5 transition-all ${
      file ? "border-green-500/30 bg-green-500/5" : "border-putih/15 hover:border-gold/30"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {file ? (
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-400" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-putih/5 flex items-center justify-center">
              <FileText className="w-5 h-5 text-putih/30" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-putih">{label}</p>
            {file ? (
              <p className="text-xs text-green-400">{file.name}</p>
            ) : (
              <p className="text-xs text-putih/40">{optional ? "Opsional" : "Wajib"} • JPG, PNG, PDF</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {file && (
            <button onClick={() => onFileChange(null)} className="p-1 hover:bg-putih/10 rounded-lg">
              <X className="w-4 h-4 text-putih/40" />
            </button>
          )}
          <label className="cursor-pointer bg-navy-light border border-putih/15 text-putih text-xs font-medium px-3 py-2 rounded-lg hover:bg-putih/10 transition-colors">
            {file ? "Ganti" : "Pilih File"}
            <input type="file" accept={accept} className="hidden" onChange={e => onFileChange(e.target.files?.[0] || null)} />
          </label>
        </div>
      </div>
    </div>
  );
}

export default function DaftarAdvokatPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RegistrationContent />
    </Suspense>
  );
}

