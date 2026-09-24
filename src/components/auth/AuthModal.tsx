"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Scale, AlertCircle, Eye, EyeOff, ChevronDown, Phone, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: "login" | "register";
}

// Comprehensive country code list
const COUNTRY_CODES = [
  { code: "+62", country: "Indonesia", flag: "🇮🇩", iso: "ID" },
  { code: "+1", country: "United States", flag: "🇺🇸", iso: "US" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧", iso: "GB" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾", iso: "MY" },
  { code: "+65", country: "Singapore", flag: "🇸🇬", iso: "SG" },
  { code: "+61", country: "Australia", flag: "🇦🇺", iso: "AU" },
  { code: "+81", country: "Japan", flag: "🇯🇵", iso: "JP" },
  { code: "+82", country: "South Korea", flag: "🇰🇷", iso: "KR" },
  { code: "+86", country: "China", flag: "🇨🇳", iso: "CN" },
  { code: "+91", country: "India", flag: "🇮🇳", iso: "IN" },
  { code: "+66", country: "Thailand", flag: "🇹🇭", iso: "TH" },
  { code: "+63", country: "Philippines", flag: "🇵🇭", iso: "PH" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳", iso: "VN" },
  { code: "+971", country: "UAE", flag: "🇦🇪", iso: "AE" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦", iso: "SA" },
  { code: "+49", country: "Germany", flag: "🇩🇪", iso: "DE" },
  { code: "+33", country: "France", flag: "🇫🇷", iso: "FR" },
  { code: "+39", country: "Italy", flag: "🇮🇹", iso: "IT" },
  { code: "+34", country: "Spain", flag: "🇪🇸", iso: "ES" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱", iso: "NL" },
  { code: "+46", country: "Sweden", flag: "🇸🇪", iso: "SE" },
  { code: "+47", country: "Norway", flag: "🇳🇴", iso: "NO" },
  { code: "+7", country: "Russia", flag: "🇷🇺", iso: "RU" },
  { code: "+55", country: "Brazil", flag: "🇧🇷", iso: "BR" },
  { code: "+52", country: "Mexico", flag: "🇲🇽", iso: "MX" },
  { code: "+27", country: "South Africa", flag: "🇿🇦", iso: "ZA" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬", iso: "NG" },
  { code: "+20", country: "Egypt", flag: "🇪🇬", iso: "EG" },
  { code: "+90", country: "Turkey", flag: "🇹🇷", iso: "TR" },
  { code: "+48", country: "Poland", flag: "🇵🇱", iso: "PL" },
  { code: "+380", country: "Ukraine", flag: "🇺🇦", iso: "UA" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿", iso: "NZ" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩", iso: "BD" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰", iso: "PK" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰", iso: "LK" },
  { code: "+95", country: "Myanmar", flag: "🇲🇲", iso: "MM" },
  { code: "+855", country: "Cambodia", flag: "🇰🇭", iso: "KH" },
  { code: "+856", country: "Laos", flag: "🇱🇦", iso: "LA" },
  { code: "+673", country: "Brunei", flag: "🇧🇳", iso: "BN" },
  { code: "+670", country: "Timor-Leste", flag: "🇹🇱", iso: "TL" },
];

function translateAuthError(message: string): string {
  if (!message) return "Terjadi kesalahan. Silakan coba lagi.";
  const lower = message.toLowerCase();

  if (lower.includes("invalid login credentials") || lower.includes("invalid_grant")) {
    return "Email atau kata sandi salah. Silakan periksa kembali kredensial Anda.";
  }
  if (lower.includes("user already registered") || lower.includes("already registered")) {
    return "Email ini sudah terdaftar. Silakan pilih opsi Masuk.";
  }
  if (lower.includes("password should be at least") || lower.includes("at least 6 characters")) {
    return "Kata sandi minimal harus 6 karakter.";
  }
  if (lower.includes("email not confirmed")) {
    return "Email Anda belum diverifikasi. Silakan periksa kotak masuk atau spam email Anda.";
  }
  if (
    lower.includes("rate limit") ||
    lower.includes("too many requests") ||
    lower.includes("over_email_send_rate_limit") ||
    lower.includes("over_request_rate_limit")
  ) {
    return "Terlalu banyak percobaan dalam waktu singkat. Harap tunggu beberapa saat sebelum mencoba lagi.";
  }
  if (lower.includes("invalid email") || lower.includes("invalid format") || lower.includes("unable to validate email")) {
    return "Format email tidak valid. Pastikan penulisan email sudah benar.";
  }
  if (lower.includes("network") || lower.includes("failed to fetch")) {
    return "Koneksi jaringan terputus. Silakan periksa koneksi internet Anda.";
  }
  if (lower.includes("refresh token") || lower.includes("session missing")) {
    return "Sesi Anda telah berakhir. Silakan masuk kembali.";
  }

  return message;
}

export default function AuthModal({ isOpen, onClose, defaultView = "login" }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(defaultView === "login");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]); // Default: Indonesia
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(null);
      setIsLoading(false);
      setIsLogin(defaultView === "login");
      setIsForgotPassword(false);
      setEmail("");
      setResetEmail("");
      setIsCountryDropdownOpen(false);
      setCountrySearch("");
      setPassword("");
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

  // Close country dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setIsCountryDropdownOpen(false);
        setCountrySearch("");
      }
    };
    if (isCountryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCountryDropdownOpen]);

  const filteredCountries = COUNTRY_CODES.filter(c =>
    c.country.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.includes(countrySearch)
  );

  const getRedirectTarget = () => {
    if (typeof window === "undefined") return "/intake";
    const currentPath = window.location.pathname + window.location.search;
    if (!currentPath || currentPath === "/" || currentPath.startsWith("/?") || currentPath.startsWith("/#")) {
      return "/intake";
    }
    return currentPath;
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    const supabase = createClient();
    try {
      const target = getRedirectTarget();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(target)}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(translateAuthError(err.message || "Terjadi kesalahan saat masuk dengan Google."));
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const formEmail = (formData.get("email") as string)?.trim();
    const formPassword = formData.get("password") as string;
    const target = getRedirectTarget();

    const supabase = createClient();

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: formEmail, password: formPassword });
        if (error) {
          setError(translateAuthError(error.message));
          setIsLoading(false);
          return;
        }
        // Success - close modal and navigate/refresh
        onClose();
        router.refresh();
        const currentPath = window.location.pathname + window.location.search;
        if (target !== currentPath) {
          router.push(target);
        }
      } else {
        const fullName = (formData.get("full_name") as string)?.trim();
        const phoneNumberRaw = formData.get("phone_number") as string;
        const phoneNumber = phoneNumberRaw ? phoneNumberRaw.trim() : "";
        
        if (phoneNumber.startsWith("0")) {
          setError("Sesuai instruksi, mohon masukkan nomor HP tanpa angka 0 di depan.");
          setIsLoading(false);
          return;
        }
        
        const fullPhone = phoneNumber ? `${selectedCountry.code}${phoneNumber}` : "";

        const { data, error } = await supabase.auth.signUp({
          email: formEmail,
          password: formPassword,
          options: {
            data: { 
              full_name: fullName,
              phone: fullPhone,
              country_code: selectedCountry.code,
            },
          },
        });
        if (error) {
          setError(translateAuthError(error.message));
          setIsLoading(false);
          return;
        }

        // Send welcome email (fire-and-forget)
        fetch("/api/auth/welcome-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formEmail, fullName }),
        }).catch(() => {/* non-critical */});

        if (data.session) {
          // Auto-logged in!
          onClose();
          router.refresh();
          const currentPath = window.location.pathname + window.location.search;
          if (target !== currentPath) {
            router.push(target);
          }
        } else {
          // Check if email confirmation is required
          setSuccess("Akun berhasil dibuat! Silakan periksa email Anda untuk konfirmasi, atau langsung masuk.");
          setIsLogin(true);
          setIsLoading(false);
        }
      }
    } catch (err: any) {
      setError(translateAuthError(err.message || "Terjadi kesalahan. Silakan coba lagi."));
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const targetEmail = resetEmail.trim();
    if (!targetEmail) {
      setError("Silakan masukkan alamat email Anda.");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    try {
      const resetRedirect = `${window.location.origin}/api/auth/callback?next=${encodeURIComponent('/pengaturan?reset=true')}`;
      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: resetRedirect,
      });

      if (error) {
        setError(translateAuthError(error.message));
        setIsLoading(false);
        return;
      }

      setSuccess("Tautan pemulihan kata sandi telah dikirim ke email Anda! Silakan periksa kotak masuk atau spam.");
      setIsLoading(false);
    } catch (err: any) {
      setError(translateAuthError(err.message || "Gagal mengirim tautan reset kata sandi. Silakan coba lagi."));
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "bg-putih/10" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 1, label: "Lemah", color: "bg-merah" };
    if (score <= 4) return { score: 2, label: "Sedang", color: "bg-yellow-500" };
    return { score: 3, label: "Kuat", color: "bg-green-500" };
  };

  const strength = getPasswordStrength(password);

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
            className="relative w-full max-w-md z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
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
                    {isForgotPassword
                      ? "Lupa Kata Sandi"
                      : isLogin
                      ? "Selamat Datang Kembali"
                      : "Buat Akun Baru"}
                  </h2>
                  <p className="text-putih/60 text-sm">
                    {isForgotPassword
                      ? "Masukkan email akun Anda. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi."
                      : isLogin
                      ? "Masuk untuk melanjutkan konsultasi hukum Anda."
                      : "Daftar sekarang untuk mendapatkan analisis kasus gratis."}
                  </p>
                </div>
              </div>

              {/* Form container */}
              <div className="px-8 pb-8">
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

                {isForgotPassword ? (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-putih/80 ml-1">Email Terdaftar</label>
                      <input
                        name="reset_email"
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="nama@example.com"
                        className="w-full bg-navy border border-putih/15 rounded-xl px-4 py-3 text-sm text-putih placeholder:text-putih/25 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gold text-navy font-bold rounded-xl py-3 mt-2 hover:bg-gold-light transition-all disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-gold/20"
                    >
                      {isLoading && (
                        <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                      )}
                      Kirim Tautan Pemulihan
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(false);
                          setError(null);
                          setSuccess(null);
                        }}
                        className="text-xs text-putih/60 hover:text-gold transition-colors font-medium"
                      >
                        ← Kembali ke Halaman Masuk
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {/* Tabs */}
                    <div className="flex bg-navy p-1 rounded-xl mb-6 border border-putih/20 relative">
                      <button
                        type="button"
                        onClick={() => { setIsLogin(true); setError(null); setSuccess(null); setPassword(""); }}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all z-10 ${
                          isLogin ? "text-navy" : "text-putih/60 hover:text-putih"
                        }`}
                      >
                        Masuk
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsLogin(false); setError(null); setSuccess(null); setPassword(""); }}
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="budi@example.com"
                          className="w-full bg-navy border border-putih/15 rounded-xl px-4 py-3 text-sm text-putih placeholder:text-putih/25 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition-all"
                        />
                      </div>

                      {/* Phone number field (register only) */}
                      <AnimatePresence>
                        {!isLogin && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-1.5"
                          >
                            <label className="text-sm font-medium text-putih/80 ml-1 flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5" />
                              Nomor HP
                            </label>
                            <div className="flex gap-2">
                              {/* Country code selector */}
                              <div className="relative" ref={countryDropdownRef}>
                                <button
                                  type="button"
                                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                  className="flex items-center gap-1.5 bg-navy border border-putih/15 rounded-xl px-3 py-3 text-sm text-putih hover:border-putih/30 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition-all min-w-[110px]"
                                >
                                  <span className="text-base leading-none">{selectedCountry.flag}</span>
                                  <span className="font-medium">{selectedCountry.code}</span>
                                  <ChevronDown className={`w-3.5 h-3.5 text-putih/40 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown */}
                                <AnimatePresence>
                                  {isCountryDropdownOpen && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                      transition={{ duration: 0.15 }}
                                      className="absolute top-full left-0 mt-1 w-[280px] bg-navy-dark border border-putih/20 rounded-xl shadow-2xl shadow-black/60 z-50 overflow-hidden"
                                    >
                                      {/* Search */}
                                      <div className="p-2 border-b border-putih/10">
                                        <div className="relative">
                                          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-putih/30" />
                                          <input
                                            type="text"
                                            value={countrySearch}
                                            onChange={(e) => setCountrySearch(e.target.value)}
                                            placeholder="Cari negara..."
                                            autoFocus
                                            className="w-full bg-putih/5 border border-putih/10 rounded-lg pl-9 pr-3 py-2 text-xs text-putih placeholder:text-putih/30 focus:outline-none focus:border-gold/40"
                                          />
                                        </div>
                                      </div>
                                      {/* Country list */}
                                      <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                        {filteredCountries.map((country) => (
                                          <button
                                            key={country.iso}
                                            type="button"
                                            onClick={() => {
                                              setSelectedCountry(country);
                                              setIsCountryDropdownOpen(false);
                                              setCountrySearch("");
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-putih/10 transition-colors ${
                                              selectedCountry.iso === country.iso ? 'bg-gold/10 text-gold' : 'text-putih'
                                            }`}
                                          >
                                            <span className="text-base">{country.flag}</span>
                                            <span className="flex-1 text-left truncate">{country.country}</span>
                                            <span className="text-putih/50 text-xs font-mono">{country.code}</span>
                                          </button>
                                        ))}
                                        {filteredCountries.length === 0 && (
                                          <p className="text-putih/40 text-xs text-center py-4">Negara tidak ditemukan</p>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              {/* Phone number input */}
                              <input
                                name="phone_number"
                                type="tel"
                                required={!isLogin}
                                placeholder="812 3456 7890"
                                pattern="[0-9\s\-]+"
                                className="flex-1 bg-navy border border-putih/15 rounded-xl px-4 py-3 text-sm text-putih placeholder:text-putih/25 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/20 transition-all"
                              />
                            </div>
                            <p className="text-[11px] text-putih/30 ml-1">Masukkan tanpa angka 0 di depan</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Password field */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between ml-1">
                          <label className="text-sm font-medium text-putih/80">Password</label>
                          {isLogin && (
                            <button
                              type="button"
                              onClick={() => {
                                setIsForgotPassword(true);
                                setError(null);
                                setSuccess(null);
                                setResetEmail(email);
                              }}
                              className="text-xs text-gold/80 hover:text-gold hover:underline transition-colors font-medium"
                            >
                              Lupa Password?
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        {/* Password Strength Indicator */}
                        <AnimatePresence>
                          {!isLogin && password.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-1 overflow-hidden"
                            >
                              <div className="flex gap-1 mb-1.5 mt-2">
                                {[1, 2, 3].map((level) => (
                                  <div
                                    key={level}
                                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                      strength.score >= level ? strength.color : "bg-putih/10"
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className={`text-[11px] text-right font-medium ${
                                strength.score === 1 ? "text-merah" :
                                strength.score === 2 ? "text-yellow-500" :
                                "text-green-500"
                              }`}>
                                Kekuatan: {strength.label}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Terms of Service Checkbox (register only) */}
                      <AnimatePresence>
                        {!isLogin && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-1 pb-1"
                          >
                            <label className="flex items-start gap-2 cursor-pointer group">
                              <div className="relative flex items-center justify-center mt-0.5">
                                <input
                                  type="checkbox"
                                  name="agree_terms"
                                  required={!isLogin}
                                  className="peer appearance-none w-4 h-4 border border-putih/30 rounded bg-navy-dark checked:bg-gold checked:border-gold transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-gold/50"
                                />
                                <svg
                                  className="absolute w-3 h-3 text-navy pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-[12px] text-putih/60 leading-tight select-none pt-[1px]">
                                Saya menyetujui{" "}
                                <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Syarat & Ketentuan</a>
                                {" "}serta Kebijakan Privasi KonsultanAI.
                              </span>
                            </label>
                          </motion.div>
                        )}
                      </AnimatePresence>

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
                  </>
                )}

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
