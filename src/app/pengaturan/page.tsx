"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { User, Lock, Save, Camera, CheckCircle2, AlertCircle, Clock, History, MessageSquare, ChevronRight, X, Bot, Download } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { exportConsultationPDF } from "@/lib/pdf-export";

export default function SettingsPage() {
  const { user, profile, refreshProfile, isVerifying } = useAuth();
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [advocate, setAdvocate] = useState<any>(null);
  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState<number | "">("");
  const [casesHandled, setCasesHandled] = useState<number | "">("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // User Activity & Limits State
  const [history, setHistory] = useState<any[]>([]);
  const [nextResetDate, setNextResetDate] = useState<Date | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<any>(null);

  useEffect(() => {
    if (!isVerifying && !user) {
      router.push("/");
    }
  }, [user, isVerifying, router]);

  useEffect(() => {
    if (profile && user) {
      setFullName(profile.fullName || "");
      setIsPremium(profile.isPremium || profile.role === "admin");
      
      if (profile.role === "advokat" || profile.role === "admin") {
        fetchAdvocate();
      }
      
      // Fetch user activity history
      fetchActivityHistory();
    }
  }, [profile, user]);

  const fetchAdvocate = async () => {
    if (!user) return;
    const { data } = await supabase.from("advocates").select("*").eq("user_id", user.id).single();
    if (data) {
      setAdvocate(data);
      setBio(data.bio || "");
      setExperienceYears(data.experience_years || "");
      setCasesHandled(data.cases_handled || "");
      setPhotoUrl(data.photo_url || "");
    }
  };

  const fetchActivityHistory = async () => {
    if (!user) return;
    
    // Fetch last 5 consultations
    const { data } = await supabase
      .from("consultations")
      .select("id, created_at, chronology, ai_analysis")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);
      
    if (data) {
      setHistory(data);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      // 1. Update Password if provided
      if (password) {
        if (password !== confirmPassword) {
          throw new Error("Password baru dan konfirmasi tidak cocok.");
        }
        if (password.length < 6) {
          throw new Error("Password minimal 6 karakter.");
        }
        const { error: authErr } = await supabase.auth.updateUser({ password });
        if (authErr) throw authErr;
      }

      // 2. Update Users table (Name)
      const { error: userErr } = await supabase.from("users").update({ full_name: fullName }).eq("id", user.id);
      if (userErr) throw userErr;

      // 3. Update Advocate table (Bio, Experience, Cases) if applicable
      if (advocate) {
        const { error: advErr } = await supabase.from("advocates").update({ 
          bio,
          experience_years: experienceYears === "" ? null : Number(experienceYears),
          cases_handled: casesHandled === "" ? null : Number(casesHandled)
        }).eq("id", advocate.id);
        if (advErr) throw advErr;
      }

      await refreshProfile();
      setSuccessMsg("Profil berhasil diperbarui!");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memperbarui profil.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !advocate) return;

    const file = e.target.files[0];
    setUploadingPhoto(true);
    setErrorMsg("");

    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `foto_formal_${Date.now()}.${fileExt}`;
      const filePath = `advocates/${advocate.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("advocate-docs")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage.from("advocate-docs").getPublicUrl(filePath);

      // Update advocates table
      const { error: updateErr } = await supabase
        .from("advocates")
        .update({ photo_url: urlData.publicUrl })
        .eq("id", advocate.id);

      if (updateErr) throw updateErr;

      setPhotoUrl(urlData.publicUrl);
      setSuccessMsg("Foto profil berhasil diperbarui!");
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengunggah foto.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleExportHistoryPDF = (isWatermarked: boolean) => {
    if (!selectedHistory || !selectedHistory.ai_analysis) {
      alert("Detail riwayat tidak valid atau tidak memiliki analisis AI.");
      return;
    }

    // Format as AI SDK messages for the PDF generator
    const historyMessages = [
      { role: "user", content: selectedHistory.chronology },
      { role: "assistant", content: selectedHistory.ai_analysis }
    ];
    
    exportConsultationPDF(historyMessages as any, isWatermarked);
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-putih">Pengaturan Akun</h1>

        {successMsg && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-sm">{successMsg}</p>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-merah/10 border border-merah/20 rounded-xl flex items-center gap-3 text-merah">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sidebar Tabs (For visual structure) */}
          <div className="md:col-span-1">
            <div className="bg-navy-light/30 border border-putih/20 rounded-2xl p-4 sticky top-24">
              <div className="flex flex-col gap-2">
                <button className="text-left px-4 py-2.5 rounded-xl bg-gold/10 text-gold font-medium flex items-center gap-2">
                  <User className="w-4 h-4" /> Profil
                </button>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="md:col-span-2 space-y-6">

            {/* AI Activity & Limits (All Users) */}
            <div className="bg-navy-light/40 border border-putih/20 rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4 border-b border-putih/20 pb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gold" />
                Aktivitas AI & Limit Token
              </h2>
              
              {profile?.role !== "admin" && (
                <div className="mb-6 bg-navy border border-gold/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-putih text-sm">Status Paket: <span className="text-gold">{isPremium ? "Premium" : "Free Trial"}</span></h3>
                    
                    {isPremium && (
                      <div className="mt-2 mb-2 bg-gold/10 px-3 py-2 rounded-lg w-fit border border-gold/20">
                        {profile?.subscriptionStartedAt && (
                          <p className="text-xs text-gold flex items-center gap-1.5 mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Aktif Sejak: <span className="font-medium">{new Date(profile.subscriptionStartedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </p>
                        )}
                        {profile?.subscriptionExpiresAt && (
                          <p className="text-xs text-gold flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Sisa Waktu: <span className="font-bold">{Math.max(0, Math.ceil((new Date(profile.subscriptionExpiresAt).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))} hari</span> 
                            ({new Date(profile.subscriptionExpiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })})
                          </p>
                        )}
                      </div>
                    )}
                    
                    {!isPremium && (
                      <div className="mt-2">
                        <p className="text-xs text-putih/60 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-gold" />
                          Generate terpakai: 
                          <span className="font-bold text-gold">
                            {profile?.consultationCount ?? 0}/3
                          </span>
                        </p>
                        {(profile?.consultationCount ?? 0) >= 3 ? (
                          <p className="text-xs text-merah mt-1 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Limit tercapai. Upgrade untuk melanjutkan.
                          </p>
                        ) : (
                          <p className="text-xs text-green-400 mt-1 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Token AI tersedia dan siap digunakan.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  {!isPremium && (
                    <button 
                      onClick={() => router.push('/#harga')}
                      className="shrink-0 bg-gold/10 text-gold hover:bg-gold hover:text-navy px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                      Upgrade Premium
                    </button>
                  )}
                </div>
              )}

              <div>
                <h3 className="text-sm font-bold text-putih/80 mb-3 flex items-center gap-2">
                  <History className="w-4 h-4" /> Riwayat Konsultasi AI Terakhir
                </h3>
                {history.length > 0 ? (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => setSelectedHistory(item)}
                        className="w-full text-left bg-navy border border-putih/10 rounded-xl p-3 flex items-start gap-3 hover:bg-putih/5 transition-colors group cursor-pointer"
                      >
                        <div className="mt-0.5">
                          <MessageSquare className="w-4 h-4 text-putih/40 group-hover:text-gold transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-putih/50 mb-1">
                            {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                          <p className="text-sm text-putih truncate group-hover:text-gold transition-colors">
                            {item.chronology ? item.chronology.substring(0, 80) + '...' : 'Sesi konsultasi AI'}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-putih/20 group-hover:text-gold self-center" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-navy border border-putih/10 border-dashed rounded-xl p-6 text-center">
                    <p className="text-sm text-putih/50">Belum ada riwayat konsultasi AI.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Foto Profil (Advokat Only) */}
            {advocate && (
              <div className="bg-navy-light/40 border border-putih/20 rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4 border-b border-putih/20 pb-4">Foto Formal Advokat</h2>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-navy border border-putih/20 shrink-0">
                    {photoUrl ? (
                      <Image src={photoUrl} alt="Foto Profil" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-putih/20">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                    {uploadingPhoto && (
                      <div className="absolute inset-0 bg-navy/80 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="cursor-pointer bg-putih/10 hover:bg-putih/20 border border-putih/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 inline-flex">
                      <Camera className="w-4 h-4" />
                      Ubah Foto
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                    </label>
                    <p className="text-xs text-putih/40 mt-2">Disarankan ukuran 1:1 (Square). Maksimal 2MB.</p>
                  </div>
                </div>
              </div>
            )}

            {/* General Profile Form */}
            <form onSubmit={handleUpdateProfile} className="bg-navy-light/40 border border-putih/20 rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-bold mb-2 border-b border-putih/20 pb-4">Informasi Pribadi</h2>
              
              <div>
                <label className="text-sm text-putih/60 mb-1.5 block">Email (Tidak bisa diubah)</label>
                <input value={user.email} disabled className="w-full bg-navy border border-putih/15 rounded-xl px-4 py-3 text-putih/50 cursor-not-allowed" />
              </div>

              <div>
                <label className="text-sm text-putih/60 mb-1.5 block">Nama Lengkap</label>
                <input value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-navy-light border border-putih/15 rounded-xl px-4 py-3 text-putih focus:outline-none focus:border-gold/40" required />
              </div>

              {advocate && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-putih/60 mb-1.5 block">Tahun Pengalaman</label>
                    <input 
                      type="number"
                      min="0"
                      value={experienceYears} 
                      onChange={e => setExperienceYears(e.target.value === "" ? "" : Number(e.target.value))} 
                      className="w-full bg-navy-light border border-putih/15 rounded-xl px-4 py-3 text-putih focus:outline-none focus:border-gold/40" 
                    />
                  </div>
                  <div>
                    <label className="text-sm text-putih/60 mb-1.5 block">Jumlah Kasus yang Ditangani</label>
                    <input 
                      type="number"
                      min="0"
                      value={casesHandled} 
                      onChange={e => setCasesHandled(e.target.value === "" ? "" : Number(e.target.value))} 
                      className="w-full bg-navy-light border border-putih/15 rounded-xl px-4 py-3 text-putih focus:outline-none focus:border-gold/40" 
                    />
                  </div>
                  <div>
                    <label className="text-sm text-putih/60 mb-1.5 block">Biografi Singkat</label>
                    <textarea 
                      value={bio} 
                      onChange={e => setBio(e.target.value)} 
                      rows={4} 
                      className="w-full bg-navy-light border border-putih/15 rounded-xl px-4 py-3 text-putih focus:outline-none focus:border-gold/40 resize-none" 
                    />
                  </div>
                </div>
              )}

              <h2 className="text-lg font-bold mt-8 mb-2 border-b border-putih/20 pb-4">Keamanan</h2>
              
              <div>
                <label className="text-sm text-putih/60 mb-1.5 block">Password Baru</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Biarkan kosong jika tidak ingin diubah" className="w-full bg-navy-light border border-putih/15 rounded-xl px-4 py-3 text-putih focus:outline-none focus:border-gold/40" />
              </div>

              {password && (
                <div>
                  <label className="text-sm text-putih/60 mb-1.5 block">Konfirmasi Password Baru</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Ulangi password baru" className="w-full bg-navy-light border border-putih/15 rounded-xl px-4 py-3 text-putih focus:outline-none focus:border-gold/40" />
                </div>
              )}

              <div className="pt-4 border-t border-putih/20">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-gold text-navy px-8 py-3 rounded-xl font-bold hover:bg-gold-light transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>

          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-navy-dark border border-putih/20 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-putih/10 bg-navy">
                <h3 className="font-bold text-putih flex items-center gap-2">
                  <History className="w-5 h-5 text-gold" />
                  Detail Riwayat AI
                </h3>
                <div className="flex items-center gap-2">
                  {!isPremium ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExportHistoryPDF(true)}
                        className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors bg-gold/10 text-gold hover:bg-gold/20 border border-gold/30"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">PDF (Watermark)</span>
                      </button>
                      <button
                        onClick={() => {
                          alert("Fitur Download Laporan PDF Tanpa Watermark hanya tersedia untuk pengguna Premium. Silakan upgrade paket Anda.");
                          router.push('/#harga');
                        }}
                        className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors bg-putih/5 text-putih/50 hover:bg-putih/10 border border-putih/10"
                      >
                        <Lock className="w-3 h-3" />
                        <span className="hidden sm:inline">PDF (Clean)</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleExportHistoryPDF(false)}
                      className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors bg-gold text-navy hover:bg-gold-light"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Export PDF</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedHistory(null)}
                    className="p-1.5 rounded-lg hover:bg-putih/10 text-putih/60 hover:text-putih transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-putih/50 text-xs">
                    <User className="w-4 h-4" />
                    <span>Kronologi Anda ({new Date(selectedHistory.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })})</span>
                  </div>
                  <div className="bg-navy border border-putih/10 rounded-xl p-4 text-sm text-putih/90 whitespace-pre-wrap">
                    {selectedHistory.chronology}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2 text-gold text-xs font-medium">
                    <Bot className="w-4 h-4" />
                    <span>Analisis KonsultanAI</span>
                  </div>
                  <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-sm text-putih/90 prose prose-invert prose-p:leading-relaxed max-w-none">
                    {selectedHistory.ai_analysis ? (
                      <ReactMarkdown>{selectedHistory.ai_analysis}</ReactMarkdown>
                    ) : (
                      <p className="text-putih/50 italic">Analisis AI tidak tersedia atau sesi terputus.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

