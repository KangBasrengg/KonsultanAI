"use client";

import { useState, useEffect, useRef } from "react";
import { User as UserIcon, ChevronDown, LogOut, Crown, Clock, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface UserProfile {
  email: string;
  fullName: string | null;
  isPremium: boolean;
  consultationCount: number;
  createdAt: string;
}

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (e) {
        console.error("Failed to load profile:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

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
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const initials = profile?.fullName
    ? profile.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : profile?.email?.slice(0, 2).toUpperCase() || "??";

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("id-ID", { year: "numeric", month: "long" })
    : "";

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-navy-light border border-putih/10 px-3 py-2 rounded-lg hover:bg-putih/10 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-bold">
          {loading ? "..." : initials}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-putih/50 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-navy-dark border border-putih/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Profile Header */}
          <div className="p-4 border-b border-putih/10 bg-navy-light/30">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold text-sm">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-putih font-semibold text-sm truncate">
                  {profile?.fullName || "Pengguna"}
                </p>
                <p className="text-putih/40 text-xs truncate">
                  {profile?.email || "..."}
                </p>
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="p-3 space-y-2">
            {/* Plan Status */}
            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              profile?.isPremium 
                ? "bg-gold/10 border border-gold/20" 
                : "bg-putih/5 border border-putih/10"
            }`}>
              <Crown className={`w-4 h-4 ${profile?.isPremium ? "text-gold" : "text-putih/30"}`} />
              <div className="flex-1">
                <p className="text-xs font-semibold text-putih">
                  {profile?.isPremium ? "Premium" : "Free Trial"}
                </p>
                <p className="text-[10px] text-putih/40">
                  {profile?.isPremium ? "Akses tidak terbatas" : "1x konsultasi gratis"}
                </p>
              </div>
              {!profile?.isPremium && (
                <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded-full font-semibold">
                  Upgrade
                </span>
              )}
            </div>

            {/* Usage */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-putih/5 border border-putih/10">
              <Clock className="w-4 h-4 text-putih/30" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-putih">Konsultasi</p>
                <p className="text-[10px] text-putih/40">
                  {profile?.consultationCount || 0} sesi{!profile?.isPremium ? " / 1 maks" : ""}
                </p>
              </div>
            </div>

            {/* Member Since */}
            {memberSince && (
              <p className="text-[10px] text-putih/30 text-center pt-1">
                Bergabung sejak {memberSince}
              </p>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-putih/10 p-2">
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
