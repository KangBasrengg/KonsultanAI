"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, Shield, Scale, LogOut, User, ChevronDown, Settings, MessageSquare, FileText, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

import LogoImage from "@/components/images/LogoUpdated.png";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, profile, isAdmin, openAuthModal } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-navy/90 backdrop-blur-md shadow-lg py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-11 h-11 group-hover:scale-105 transition-transform bg-navy-light border border-white/20 rounded-xl shadow-md overflow-hidden">
            <Image src={LogoImage} alt="KonsultanAI Logo" fill sizes="50px" className="object-contain p-1" />
          </div>
          <span className="hidden md:inline-block font-bold text-xl md:text-2xl tracking-tight text-putih">
            Konsultan<span className="text-gold">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/tentang" className="text-putih/80 hover:text-gold transition-colors">Tentang</Link>
          <Link href="/intake" className="text-putih/80 hover:text-gold transition-colors">Konsultasi AI</Link>
          <Link href="/learning" className="text-putih/80 hover:text-gold transition-colors">Learning Center</Link>
          <Link href="/templates" className="text-putih/80 hover:text-gold transition-colors flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            Template
          </Link>
          <Link href="/marketplace" className="text-putih/80 hover:text-gold transition-colors flex items-center gap-1">
            <Scale className="w-3.5 h-3.5" />
            Marketplace
          </Link>
          <Link href="/#harga" className="text-putih/80 hover:text-gold transition-colors">Harga</Link>

          {user ? (
            <div className="flex items-center gap-4 relative" ref={dropdownRef}>
              <ThemeToggle />
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 bg-navy-light/50 hover:bg-putih/10 border border-white/20 rounded-full pl-1.5 pr-3 py-1.5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gold text-navy font-bold flex items-center justify-center text-sm">
                  {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col items-start hidden lg:flex">
                  <span className="text-sm font-semibold text-putih leading-tight max-w-[100px] truncate">
                    {profile?.fullName || user.email?.split("@")[0]}
                  </span>
                  <div className="flex items-center mt-0.5">
                    {profile?.role === "admin" ? (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30">
                        Admin
                      </span>
                    ) : profile?.role === "advokat" ? (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-gold/20 text-gold px-1.5 py-0.5 rounded border border-gold/30">
                        Advokat
                      </span>
                    ) : (
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                        profile?.tier === "professional" ? "bg-gold/20 text-gold border-gold/30" : 
                        profile?.tier === "basic" ? "bg-blue-500/20 text-blue-300 border-blue-500/30" : 
                        "bg-putih/10 text-putih/60 border-putih/20"
                      }`}>
                        {profile?.tier || "Free"}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-putih/50 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-navy-dark border border-white/15 rounded-2xl shadow-2xl overflow-hidden py-2"
                  >
                    <div className="px-4 py-3 border-b border-white/20 mb-2 lg:hidden">
                      <p className="font-semibold text-putih truncate">{profile?.fullName || user.email}</p>
                      <p className="text-xs text-gold capitalize">{profile?.role || "User"}</p>
                    </div>
                    
                    <Link href="/intake" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-putih/80 hover:bg-putih/5 hover:text-gold transition-colors">
                      <Scale className="w-4 h-4" />
                      Konsultasi AI (Intake)
                    </Link>

                    <Link href="/templates" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-putih/80 hover:bg-putih/5 hover:text-gold transition-colors">
                      <FileText className="w-4 h-4" />
                      Template Dokumen
                    </Link>

                    <Link href="/konsultasi-advokat" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-putih/80 hover:bg-putih/5 hover:text-gold transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      Chat Advokat
                    </Link>
                    
                    {profile?.role === "advokat" && (
                      <Link href="/advokat" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-putih/80 hover:bg-putih/5 hover:text-gold transition-colors">
                        <User className="w-4 h-4" />
                        Dashboard Advokat
                      </Link>
                    )}
                    
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-putih/80 hover:bg-putih/5 hover:text-gold transition-colors">
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    
                    {(isAdmin || profile?.role === "government" || profile?.role === "enterprise") && (
                      <Link href="/admin/analytics" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-putih/80 hover:bg-putih/5 hover:text-gold transition-colors">
                        <TrendingUp className="w-4 h-4" />
                        Government Analytics
                      </Link>
                    )}
                    
                    <div className="h-px bg-putih/10 my-2 mx-4" />
                    
                    <Link href="/pengaturan" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-putih/80 hover:bg-putih/5 hover:text-gold transition-colors">
                      <Settings className="w-4 h-4" />
                      Pengaturan
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-merah hover:bg-merah/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="bg-gold text-navy px-6 py-2.5 rounded-full font-bold hover:bg-gold-light transition-colors transform hover:scale-105"
              >
                Masuk
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-putih p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-navy-light border-t border-white/20 mt-4 py-4 px-6 flex flex-col gap-4"
        >
          <Link href="/tentang" className="text-putih/80 hover:text-gold" onClick={() => setIsMobileMenuOpen(false)}>Tentang</Link>
          <Link href="/intake" className="text-putih/80 hover:text-gold" onClick={() => setIsMobileMenuOpen(false)}>Konsultasi AI</Link>
          <Link href="/learning" className="text-putih/80 hover:text-gold" onClick={() => setIsMobileMenuOpen(false)}>Learning Center</Link>
          <Link href="/templates" className="text-putih/80 hover:text-gold flex items-center gap-1.5" onClick={() => setIsMobileMenuOpen(false)}>
            <FileText className="w-3.5 h-3.5" />
            Template Dokumen
          </Link>
          <Link href="/marketplace" className="text-putih/80 hover:text-gold flex items-center gap-1.5" onClick={() => setIsMobileMenuOpen(false)}>
            <Scale className="w-3.5 h-3.5" />
            Marketplace Advokat
          </Link>
          <Link href="/#harga" className="text-putih/80 hover:text-gold" onClick={() => setIsMobileMenuOpen(false)}>Harga</Link>

          <div className="flex items-center justify-between py-2 border-b border-t border-white/20 my-2">
            <span className="text-putih/80 text-sm font-medium">Tema Tampilan</span>
            <ThemeToggle />
          </div>

          {user ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-2 text-gold" onClick={() => setIsMobileMenuOpen(false)}>
                  <Shield className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}
              {(isAdmin || profile?.role === "government" || profile?.role === "enterprise") && (
                <Link href="/admin/analytics" className="flex items-center gap-2 text-gold" onClick={() => setIsMobileMenuOpen(false)}>
                  <TrendingUp className="w-4 h-4" />
                  Government Analytics
                </Link>
              )}
              {profile?.role === "advokat" && (
                <Link href="/advokat" className="flex items-center gap-2 text-gold" onClick={() => setIsMobileMenuOpen(false)}>
                  <Scale className="w-4 h-4" />
                  Dashboard Advokat
                </Link>
              )}
              <Link href="/intake" className="bg-gold text-navy text-center py-3 rounded-xl font-bold mt-2" onClick={() => setIsMobileMenuOpen(false)}>
                Mulai Konsultasi AI
              </Link>
              <Link href="/pengaturan" className="flex items-center justify-center gap-2 text-putih border border-white/20 py-3 rounded-xl font-bold mt-2 hover:bg-putih/5 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                <Settings className="w-4 h-4" />
                Pengaturan
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 text-merah border border-merah/20 bg-merah/5 py-3 rounded-xl font-bold mt-2 hover:bg-merah/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => { openAuthModal("login"); setIsMobileMenuOpen(false); }}
                className="bg-gold text-navy text-center py-3 rounded-xl font-bold mt-2"
              >
                Masuk
              </button>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}

