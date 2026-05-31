"use client";

import { useState, Suspense } from "react";
import { Scale, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { login, signup } from "./actions";
import { useSearchParams } from "next/navigation";

function AuthForm() {
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get("view") !== "register");
  const errorMsg = searchParams.get("error");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-navy-light/50 border border-putih/10 backdrop-blur-md shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">
          {isLogin ? "Selamat Datang Kembali" : "Buat Akun Baru"}
        </h2>
        <p className="text-putih/60 text-sm">
          {isLogin 
            ? "Masuk untuk melanjutkan konsultasi hukum Anda." 
            : "Daftar sekarang untuk mendapatkan analisis kasus gratis."}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-merah/10 border border-merah/20 flex items-start gap-3 text-merah text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <form 
        action={isLogin ? login : signup} 
        onSubmit={() => setIsLoading(true)}
        className="space-y-5"
      >
        {!isLogin && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-putih/80 ml-1">Nama Lengkap</label>
            <input 
              name="full_name"
              type="text" 
              required={!isLogin}
              placeholder="Budi Santoso"
              className="w-full bg-navy border border-putih/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-putih/80 ml-1">Email</label>
          <input 
            name="email"
            type="email" 
            required
            placeholder="budi@example.com"
            className="w-full bg-navy border border-putih/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-putih/80 ml-1">Password</label>
          <input 
            name="password"
            type="password" 
            required
            placeholder="Minimal 6 karakter"
            minLength={6}
            className="w-full bg-navy border border-putih/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gold text-navy font-bold rounded-xl py-3 mt-4 hover:bg-gold-light transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
        >
          {isLoading && <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin"></span>}
          {isLogin ? "Masuk" : "Daftar"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-putih/60">
        {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
        <button 
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-gold font-semibold hover:underline"
        >
          {isLogin ? "Daftar di sini" : "Masuk di sini"}
        </button>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-navy flex flex-col relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-merah/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="p-6 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-putih/70 hover:text-putih transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium text-sm">Kembali ke Beranda</span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <Link href="/" className="flex items-center gap-2 group mb-8">
          <div className="bg-gold p-2 rounded-lg group-hover:scale-105 transition-transform">
            <Scale className="text-navy w-6 h-6" />
          </div>
          <span className="font-bold text-3xl tracking-tight text-putih">
            Konsultan<span className="text-gold">AI</span>
          </span>
        </Link>

        <Suspense fallback={<div className="animate-pulse w-full max-w-md h-[400px] bg-navy-light/50 rounded-3xl"></div>}>
          <AuthForm />
        </Suspense>
      </main>
    </div>
  );
}
