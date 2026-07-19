"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Scale, AlertCircle, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, defaultView = "login" }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(defaultView === "login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(null);
      setIsLoading(false);
      setIsLogin(defaultView === "login");
    }
  }, [isOpen, defaultView]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=/intake`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat masuk dengan Google.");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = createClient();

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setError(error.message);
          setIsLoading(false);
          return;
        }
        // Success - close modal and refresh
        onClose();
        router.refresh();
        router.push("/intake");
      } else {
        const fullName = formData.get("full_name") as string;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) {
          setError(error.message);
          setIsLoading(false);
          return;
        }
        // Check if email confirmation is required
        setSuccess("Akun berhasil dibuat! Silakan cek email Anda untuk konfirmasi, atau langsung masuk.");
        setIsLogin(true);
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-navy-dark/80 backdrop-blur-md" />

          {/* Decorative glows */}
          <div className="absolute top-[10%] right-[15%] w-[400px] h-[400px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[10%] left-[15%] w-[400px] h-[400px] rounded-full bg-merah/5 blur-[120px] pointer-events-none" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="relative w-full max-w-md z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-navy-light/70 backdrop-blur-xl border border-putih/20 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-putih/5 flex items-center justify-center hover:bg-putih/10 transition-colors z-20"
              >
                <X className="w-4 h-4 text-putih/60" />
              </button>

              {/* Header with logo */}
              <div className="pt-8 pb-2 px-8">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="bg-gold p-2 rounded-lg">
                    <Scale className="text-navy w-5 h-5" />
                  </div>
                  <span className="font-bold text-xl tracking-tight text-putih">
                    Konsultan<span className="text-gold">AI</span>
                  </span>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2 text-putih">
                    {isLogin ? "Selamat Datang Kembali" : "Buat Akun Baru"}
                  </h2>
                  <p className="text-putih/60 text-sm">
                    {isLogin
                      ? "Masuk untuk melanjutkan konsultasi hukum Anda."
                      : "Daftar sekarang untuk mendapatkan analisis kasus gratis."}
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="px-8 pb-8">
                {/* Tabs */}
                <div className="flex bg-navy p-1 rounded-xl mb-6 border border-putih/20 relative">
                  <button
                    type="button"
                    onClick={() => { setIsLogin(true); setError(null); setSuccess(null); }}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all z-10 ${
                      isLogin ? "text-navy" : "text-putih/60 hover:text-putih"
                    }`}
                  >
                    Masuk
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsLogin(false); setError(null); setSuccess(null); }}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all z-10 ${
                      !isLogin ? "text-navy" : "text-putih/60 hover:text-putih"
                    }`}
                  >
                    Daftar
                  </button>
                  <motion.div
                    className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gold rounded-lg shadow-md"
                    initial={false}
                    animate={{
                      left: isLogin ? "4px" : "calc(50%)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                </div>

                {/* Google Login Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full bg-putih text-navy font-bold rounded-xl py-3 mb-4 hover:bg-gray-100 transition-all disabled:opacity-70 flex justify-center items-center gap-3 shadow-sm border border-gray-200"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Lanjutkan dengan Google
                </button>

                <div className="flex items-center gap-4 mb-4">
                  <div className="h-px bg-putih/20 flex-1"></div>
                  <span className="text-putih/50 text-sm font-medium">atau</span>
                  <div className="h-px bg-putih/20 flex-1"></div>
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-3 rounded-xl bg-merah/10 border border-merah/20 flex items-start gap-2 text-merah text-sm"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success message */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-2 text-green-400 text-sm"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>{success}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full name field (register only) */}
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1.5"
                      >
                        <label className="text-sm font-medium text-putih/80 ml-1">Nama Lengkap</label>
                        <input
                          name="full_name"
                          type="text"
                          required={!isLogin}
                          placeholder="Budi Santoso"
                          className="w-full bg-navy border border-putih/15 rounded-xl px-4 py-3 text-sm text-putih placeholder:text-putih/25 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition-all"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-putih/80 ml-1">Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="budi@example.com"
                      className="w-full bg-navy border border-putih/15 rounded-xl px-4 py-3 text-sm text-putih placeholder:text-putih/25 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition-all"
                    />
                  </div>

                  {/* Password field */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-putih/80 ml-1">Password</label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Minimal 6 karakter"
                        minLength={6}
                        className="w-full bg-navy border border-putih/15 rounded-xl px-4 py-3 pr-11 text-sm text-putih placeholder:text-putih/25 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-putih/30 hover:text-putih/60 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gold text-navy font-bold rounded-xl py-3 mt-2 hover:bg-gold-light transition-all disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-gold/20"
                  >
                    {isLoading && (
                      <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                    )}
                    {isLogin ? "Masuk" : "Daftar"}
                  </button>
                </form>

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

