"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, Shield, Scale, LogOut, User, Users, ChevronDown, Settings, MessageSquare, FileText, TrendingUp, Briefcase } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, profile, isAdmin, isLoading, openAuthModal, logout } = useAuth();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        isScrolled ? "bg-navy/90 backdrop-blur-md shadow-lg py-4 border-b border-putih/10" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-11 h-11 group-hover:scale-105 transition-transform bg-navy-light border border-putih/20 rounded-xl shadow-md overflow-hidden" suppressHydrationWarning>
            <Image src="/images/logo-128.webp" alt="KonsultanAI Logo" fill sizes="44px" priority className="object-cover" suppressHydrationWarning />
          </div>
          <span className="hidden md:inline-block font-bold text-xl md:text-2xl tracking-tight text-putih dark:text-putih">
            Konsultan<span className="text-gold">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/tentang" className={`transition-colors ${pathname === '/tentang' ? 'text-gold font-semibold' : 'text-putih/80 hover:text-gold'}`}>Tentang</Link>
          <Link href="/intake" className={`transition-colors ${pathname === '/intake' ? 'text-gold font-semibold' : 'text-putih/80 hover:text-gold'}`}>Konsultasi AI</Link>
          <Link href="/learning" className={`transition-colors ${pathname === '/learning' || pathname?.startsWith('/learning/') ? 'text-gold font-semibold' : 'text-putih/80 hover:text-gold'}`}>Learning Center</Link>

          <Link href="/legalkita" className={`transition-colors flex items-center gap-1 ${pathname === '/legalkita' || pathname?.startsWith('/legalkita/') ? 'text-gold font-semibold' : 'text-putih/80 hover:text-gold'}`}>
            <Briefcase className="w-3.5 h-3.5" />
            LegalKita
          </Link>
          <Link href="/#harga" className={`transition-colors ${pathname === '/#harga' ? 'text-gold font-semibold' : 'text-putih/80 hover:text-gold'}`}>Harga</Link>

          {isLoading && !user ? (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-putih/10 animate-pulse rounded-full"></div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-4 relative" ref={dropdownRef}>
              <button
                aria-label="Toggle user menu"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 bg-navy-light/50 hover:bg-putih/10 border border-putih/20 rounded-full pl-1.5 pr-3 py-1.5 transition-colors"
              >
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-gold/40" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gold text-navy font-bold flex items-center justify-center text-sm">
                    {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
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
                        profile?.tier === "enterprise" ? "bg-purple-500/20 text-purple-300 border-purple-500/30" : 
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
                    className="absolute top-full right-0 mt-2 w-56 bg-navy-dark dark:bg-navy-dark bg-white border border-putih/15 rounded-2xl shadow-2xl overflow-hidden py-2"
                  >
                    <div className="px-4 py-3 border-b border-putih/20 mb-2 lg:hidden">
                      <p className="font-semibold text-putih truncate">{profile?.fullName || user.email}</p>
                      <p className="text-xs text-gold capitalize">{profile?.role || "User"}</p>
                    </div>
                    
                    <Link href="/intake" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-putih/80 hover:bg-putih/5 hover:text-gold transition-colors">
                      <Scale className="w-4 h-4" />
                      Konsultasi AI (Intake)
                    </Link>

                    <Link href="/chat" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-putih/80 hover:bg-putih/5 hover:text-gold transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      Konsultasi AI (Chat)
                    </Link>

                    <Link href="/legalkita" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-putih/80 hover:bg-putih/5 hover:text-gold transition-colors">
                      <Briefcase className="w-4 h-4" />
                      LegalKita UMKM
                    </Link>

                    <Link href="/templates" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-putih/80 hover:bg-putih/5 hover:text-gold transition-colors">
                      <FileText className="w-4 h-4" />
                      Template Dokumen
                    </Link>
                    
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-putih/80 hover:bg-putih/5 hover:text-gold transition-colors">
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    {profile?.tier === "enterprise" && (
                      <Link href="/enterprise" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-putih/80 hover:bg-putih/5 hover:text-purple-400 transition-colors">
                        <Users className="w-4 h-4" />
                        Enterprise Dashboard
                      </Link>
                    )}
                    
                    {(isAdmin || profile?.role === "government" || profile?.hasAnalyticsAccess || profile?.institutionType === "pemerintah") && (
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
                      onClick={logout}
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
          aria-label="Toggle mobile menu"
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
          className="md:hidden bg-navy-light border-t border-putih/20 mt-4 py-4 px-6 flex flex-col gap-4"
        >
          <Link href="/tentang" className={`${pathname === '/tentang' ? 'text-gold font-semibold' : 'text-putih/80 hover:text-gold'}`} onClick={() => setIsMobileMenuOpen(false)}>Tentang</Link>
          <Link href="/intake" className={`${pathname === '/intake' ? 'text-gold font-semibold' : 'text-putih/80 hover:text-gold'}`} onClick={() => setIsMobileMenuOpen(false)}>Konsultasi AI</Link>
          <Link href="/learning" className={`${pathname === '/learning' || pathname?.startsWith('/learning/') ? 'text-gold font-semibold' : 'text-putih/80 hover:text-gold'}`} onClick={() => setIsMobileMenuOpen(false)}>Learning Center</Link>

          <Link href="/legalkita" className={`flex items-center gap-1.5 ${pathname === '/legalkita' || pathname?.startsWith('/legalkita/') ? 'text-gold font-semibold' : 'text-putih/80 hover:text-gold'}`} onClick={() => setIsMobileMenuOpen(false)}>
            <Briefcase className="w-3.5 h-3.5" />
            LegalKita UMKM
          </Link>
          <Link href="/#harga" className={`${pathname === '/#harga' ? 'text-gold font-semibold' : 'text-putih/80 hover:text-gold'}`} onClick={() => setIsMobileMenuOpen(false)}>Harga</Link>


          {isLoading && !user ? (
            <div className="w-full flex justify-center py-4">
              <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin"></div>
            </div>
          ) : user ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-2 text-gold" onClick={() => setIsMobileMenuOpen(false)}>
                  <Shield className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}
              {profile?.tier === "enterprise" && (
                <Link href="/enterprise" className="flex items-center gap-2 text-purple-400" onClick={() => setIsMobileMenuOpen(false)}>
                  <Users className="w-4 h-4" />
                  Enterprise Dashboard
                </Link>
              )}
              {(isAdmin || profile?.role === "government" || profile?.hasAnalyticsAccess || profile?.institutionType === "pemerintah") && (
                <Link href="/admin/analytics" className="flex items-center gap-2 text-gold" onClick={() => setIsMobileMenuOpen(false)}>
                  <TrendingUp className="w-4 h-4" />
                  Government Analytics
                </Link>
              )}

              <Link href="/intake" className="bg-gold text-navy text-center py-3 rounded-xl font-bold mt-2" onClick={() => setIsMobileMenuOpen(false)}>
                Mulai Konsultasi AI
              </Link>
              <Link href="/pengaturan" className="flex items-center justify-center gap-2 text-putih border border-putih/20 py-3 rounded-xl font-bold mt-2 hover:bg-putih/5 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                <Settings className="w-4 h-4" />
                Pengaturan
              </Link>
              <button
                onClick={logout}
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

