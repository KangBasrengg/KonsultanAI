"use client";

import { useState, useEffect, useRef } from "react";
import { User as UserIcon, ChevronDown, LogOut, Crown, Clock, X, Shield } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { profile, isAdmin, logout, isLoading } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  const initials = profile?.fullName
    ? profile.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : profile?.email?.slice(0, 2).toUpperCase() || "??";

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("id-ID", { year: "numeric", month: "long" })
    : "";

  const tierLabel = isAdmin ? "Admin" : profile?.tier === "professional" ? "Professional" : profile?.tier === "basic" ? "Basic" : "Free Trial";

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-navy-light border border-putih/20 px-3 py-2 rounded-lg hover:bg-putih/10 transition-colors"
      >
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
          isAdmin ? "bg-gold/20 text-gold" : "bg-gold/20 text-gold"
        }`}>
          {isLoading ? "..." : initials}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-putih/50 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-navy-dark border border-putih/20 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Profile Header */}
          <Link href="/pengaturan" onClick={() => setIsOpen(false)} className="block p-4 border-b border-putih/20 bg-navy-light/30 hover:bg-putih/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${
                isAdmin ? "bg-gold/20 text-gold" : "bg-gold/20 text-gold"
              }`}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-putih font-semibold text-sm truncate flex items-center gap-1.5">
                  {profile?.fullName || "Pengguna"}
                  {isAdmin && <Shield className="w-3 h-3 text-gold" />}
                </p>
                <p className="text-putih/40 text-xs truncate">
                  {profile?.email || "..."}
                </p>
              </div>
            </div>
          </Link>

          {/* Status Cards */}
          <div className="p-3 space-y-2">
            {/* Plan Status */}
            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              profile?.isPremium 
                ? "bg-gold/10 border border-gold/20" 
                : "bg-putih/5 border border-putih/20"
            }`}>
              <Crown className={`w-4 h-4 ${(isAdmin || profile?.isPremium) ? "text-gold" : "text-putih/30"}`} />
              <div className="flex-1">
                <p className="text-xs font-semibold text-putih">
                  {tierLabel}
                </p>
                <p className="text-[10px] text-putih/40">
                  {(isAdmin || profile?.isPremium) ? "Akses tidak terbatas" : "3x konsultasi gratis"}
                </p>
              </div>
              {!isAdmin && !profile?.isPremium && (
                <Link
                  href="/#harga"
                  onClick={() => setIsOpen(false)}
                  className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded-full font-semibold hover:bg-gold hover:text-navy transition-colors"
                >
                  Upgrade
                </Link>
              )}
            </div>

            {/* Usage */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-putih/5 border border-putih/20">
              <Clock className="w-4 h-4 text-putih/30" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-putih">Konsultasi</p>
                <p className="text-[10px] text-putih/40">
                  {profile?.consultationCount || 0} sesi{(!isAdmin && !profile?.isPremium) ? " / 3 maks" : ""}
                </p>
              </div>
            </div>

            {/* Admin Link */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg bg-gold/5 border border-gold/15 hover:bg-gold/10 transition-colors"
              >
                <Shield className="w-4 h-4 text-gold" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gold">Admin Dashboard</p>
                  <p className="text-[10px] text-putih/40">Kelola pengguna</p>
                </div>
              </Link>
            )}

            {/* Member Since */}
            {memberSince && (
              <p className="text-[10px] text-putih/30 text-center pt-1">
                Bergabung sejak {memberSince}
              </p>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-putih/20 p-2">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar dari Akun
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

