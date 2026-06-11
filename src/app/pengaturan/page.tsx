"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { User, Lock, Save, Camera, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

  // Advocate State
  const [advocate, setAdvocate] = useState<any>(null);
  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState<number | "">("");
  const [casesHandled, setCasesHandled] = useState<number | "">("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    if (!isVerifying && !user) {
      router.push("/");
    }
  }, [user, isVerifying, router]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      if (profile.role === "advokat" || profile.role === "admin") {
        fetchAdvocate();
      }
    }
  }, [profile]);

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

      <Footer />
    </main>
  );
}

