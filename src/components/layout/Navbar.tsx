"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, LogIn, Shield } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

import LogoImage from "@/components/images/LogoUpdated.png";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, openAuthModal } = useAuth();

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
          <div className="relative w-11 h-11 group-hover:scale-105 transition-transform bg-navy-light border border-putih/20 rounded-xl shadow-md overflow-hidden">
            <Image src={LogoImage} alt="KonsultanAI Logo" fill sizes="50px" className="object-contain p-1" />
          </div>
          <span className="font-bold text-xl md:text-2xl tracking-tight text-putih">
            Konsultan<span className="text-gold">AI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/tentang" className="text-putih/80 hover:text-gold transition-colors">Tentang</Link>
          <Link href="/#cara-kerja" className="text-putih/80 hover:text-gold transition-colors">Cara Kerja</Link>
          <Link href="/#fitur" className="text-putih/80 hover:text-gold transition-colors">Fitur</Link>
          <Link href="/#harga" className="text-putih/80 hover:text-gold transition-colors">Harga</Link>

          {user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="flex items-center gap-1.5 text-gold/80 hover:text-gold transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              )}
              <Link href="/konsultasi" className="bg-gold text-navy px-6 py-2.5 rounded-full font-bold hover:bg-gold-light transition-colors transform hover:scale-105">
                Konsultasi
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="flex items-center gap-1.5 text-putih/80 hover:text-gold transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Masuk
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("register")}
                className="bg-gold text-navy px-6 py-2.5 rounded-full font-bold hover:bg-gold-light transition-colors transform hover:scale-105"
              >
                Daftar
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
          className="md:hidden bg-navy-light border-t border-putih/10 mt-4 py-4 px-6 flex flex-col gap-4"
        >
          <Link href="/tentang" className="text-putih/80 hover:text-gold" onClick={() => setIsMobileMenuOpen(false)}>Tentang</Link>
          <Link href="/#cara-kerja" className="text-putih/80 hover:text-gold" onClick={() => setIsMobileMenuOpen(false)}>Cara Kerja</Link>
          <Link href="/#fitur" className="text-putih/80 hover:text-gold" onClick={() => setIsMobileMenuOpen(false)}>Fitur</Link>
          <Link href="/#harga" className="text-putih/80 hover:text-gold" onClick={() => setIsMobileMenuOpen(false)}>Harga</Link>

          {user ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-2 text-gold" onClick={() => setIsMobileMenuOpen(false)}>
                  <Shield className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}
              <Link href="/konsultasi" className="bg-gold text-navy text-center py-3 rounded-xl font-bold mt-2" onClick={() => setIsMobileMenuOpen(false)}>
                Konsultasi
              </Link>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => { openAuthModal("login"); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-2 text-putih/80 hover:text-gold"
              >
                <LogIn className="w-4 h-4" />
                Masuk
              </button>
              <button
                type="button"
                onClick={() => { openAuthModal("register"); setIsMobileMenuOpen(false); }}
                className="bg-gold text-navy text-center py-3 rounded-xl font-bold mt-2"
              >
                Daftar Gratis
              </button>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}
