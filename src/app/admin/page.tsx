"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Users, Crown, Shield, Search, 
  ChevronDown, Check, X, RefreshCw, 
  BarChart3, UserCheck, TrendingUp 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LogoImage from "@/components/images/LogoUpdated.png";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/auth/LoadingScreen";

interface UserData {
  id: string;
  email: string;
  full_name: string | null;
  is_premium: boolean;
  role: string;
  tier: string;
  created_at: string;
  consultationCount: number;
}

const TIER_CONFIG = {
  free: { label: "Free", color: "text-putih/50", bg: "bg-putih/5", border: "border-putih/10", badge: "bg-putih/10 text-putih/60" },
  basic: { label: "Basic", color: "text-blue-400", bg: "bg-blue-500/5", border: "border-blue-500/20", badge: "bg-blue-500/20 text-blue-300" },
  professional: { label: "Professional", color: "text-gold", bg: "bg-gold/5", border: "border-gold/20", badge: "bg-gold/20 text-gold" },
};

export default function AdminDashboard() {
  const { profile, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Redirect non-admins
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/");
    }
  }, [isLoading, isAdmin, router]);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e) {
      console.error("Failed to fetch users:", e);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin, fetchUsers]);

  const handleTierChange = async (userId: string, newTier: string) => {
    setUpdatingId(userId);
    setOpenDropdownId(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, tier: newTier }),
      });
      if (res.ok) {
        setUsers(prev =>
          prev.map(u =>
            u.id === userId
              ? { ...u, tier: newTier, is_premium: newTier !== "free" }
              : u
          )
        );
      }
    } catch (e) {
      console.error("Failed to update tier:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.full_name && u.full_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTier = tierFilter === "all" || u.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  // Stats
  const totalUsers = users.length;
  const premiumUsers = users.filter(u => u.is_premium).length;
  const totalConsultations = users.reduce((sum, u) => sum + u.consultationCount, 0);

  if (isLoading || !isAdmin) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-navy text-putih">
      {/* Header */}
      <header className="bg-navy-dark border-b border-putih/10 py-4 px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-10 h-10 rounded-full bg-navy-light flex items-center justify-center hover:bg-putih/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-putih" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-navy-light border border-putih/20 rounded-xl shadow-md overflow-hidden">
                <Image src={LogoImage} alt="KonsultanAI Logo" fill sizes="50px" className="object-contain p-1" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight text-putih flex items-center gap-2">
                  Admin Dashboard
                  <Shield className="w-4 h-4 text-gold" />
                </h1>
                <p className="text-xs text-putih/50">
                  Kelola pengguna KonsultanAI
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              {profile?.fullName || profile?.email}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="bg-navy-light/40 border border-putih/10 rounded-2xl p-6 group hover:border-putih/20 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-sm text-putih/60 font-medium">Total Pengguna</span>
            </div>
            <p className="text-3xl font-bold text-putih">{totalUsers}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-navy-light/40 border border-putih/10 rounded-2xl p-6 group hover:border-gold/20 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-gold/10 text-gold">
                <Crown className="w-5 h-5" />
              </div>
              <span className="text-sm text-putih/60 font-medium">Premium Users</span>
            </div>
            <p className="text-3xl font-bold text-gold">{premiumUsers}</p>
            <p className="text-xs text-putih/40 mt-1">
              {totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0}% dari total
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-navy-light/40 border border-putih/10 rounded-2xl p-6 group hover:border-green-500/20 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-sm text-putih/60 font-medium">Total Konsultasi</span>
            </div>
            <p className="text-3xl font-bold text-putih">{totalConsultations}</p>
          </motion.div>
        </div>

        {/* Users Table Section */}
        <div className="bg-navy-light/30 border border-putih/10 rounded-2xl overflow-hidden">
          {/* Table Header / Controls */}
          <div className="p-4 border-b border-putih/10 flex flex-col md:flex-row gap-3 md:items-center justify-between">
            <div className="flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-gold" />
              <h2 className="font-bold text-lg">Daftar Pengguna</h2>
              <span className="text-xs bg-putih/10 px-2 py-0.5 rounded-full text-putih/50">
                {filteredUsers.length}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-putih/30" />
                <input
                  type="text"
                  placeholder="Cari nama atau email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 bg-navy border border-putih/15 rounded-lg pl-9 pr-4 py-2 text-sm text-putih placeholder:text-putih/25 focus:outline-none focus:border-gold/40 transition-colors"
                />
              </div>

              {/* Tier Filter */}
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="bg-navy border border-putih/15 rounded-lg px-3 py-2 text-sm text-putih focus:outline-none focus:border-gold/40 transition-colors"
              >
                <option value="all">Semua Tier</option>
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="professional">Professional</option>
              </select>

              {/* Refresh */}
              <button
                type="button"
                onClick={fetchUsers}
                className="p-2 bg-navy border border-putih/15 rounded-lg hover:bg-putih/5 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 text-putih/50 ${loadingUsers ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Table */}
          {loadingUsers ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
              <p className="text-putih/40 text-sm">Memuat data pengguna...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Users className="w-10 h-10 text-putih/15" />
              <p className="text-putih/40 text-sm">Tidak ada pengguna ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto min-h-[280px]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-navy-dark/50 text-putih/50 text-xs uppercase tracking-wider">
                    <th className="text-left py-3 px-4 font-semibold">Pengguna</th>
                    <th className="text-left py-3 px-4 font-semibold hidden md:table-cell">Email</th>
                    <th className="text-center py-3 px-4 font-semibold">Tier</th>
                    <th className="text-center py-3 px-4 font-semibold hidden sm:table-cell">Konsultasi</th>
                    <th className="text-center py-3 px-4 font-semibold hidden lg:table-cell">Bergabung</th>
                    <th className="text-center py-3 px-4 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-putih/5">
                  {filteredUsers.map((u, index) => {
                    const tierConfig = TIER_CONFIG[u.tier as keyof typeof TIER_CONFIG] || TIER_CONFIG.free;
                    const initials = u.full_name
                      ? u.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
                      : u.email.slice(0, 2).toUpperCase();

                    return (
                      <tr key={u.id} className="hover:bg-putih/[0.02] transition-colors group">
                        {/* User */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              u.role === "admin" ? "bg-gold/20 text-gold" : "bg-putih/10 text-putih/70"
                            }`}>
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-putih truncate flex items-center gap-1.5">
                                {u.full_name || "Tanpa Nama"}
                                {u.role === "admin" && (
                                  <Shield className="w-3 h-3 text-gold shrink-0" />
                                )}
                              </p>
                              <p className="text-xs text-putih/40 md:hidden truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-3 px-4 hidden md:table-cell">
                          <span className="text-putih/60 truncate block max-w-[200px]">{u.email}</span>
                        </td>

                        {/* Tier Badge */}
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${tierConfig.badge}`}>
                            {u.is_premium && <Crown className="w-3 h-3" />}
                            {tierConfig.label}
                          </span>
                        </td>

                        {/* Consultation Count */}
                        <td className="py-3 px-4 text-center hidden sm:table-cell">
                          <span className="text-putih/60">{u.consultationCount}</span>
                        </td>

                        {/* Joined Date */}
                        <td className="py-3 px-4 text-center hidden lg:table-cell">
                          <span className="text-putih/40 text-xs">
                            {new Date(u.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-center">
                          {u.role === "admin" ? (
                            <span className="text-xs text-putih/30 italic">Admin</span>
                          ) : (
                            <div className="relative inline-block">
                              <button
                                type="button"
                                disabled={updatingId === u.id}
                                onClick={() => setOpenDropdownId(openDropdownId === u.id ? null : u.id)}
                                className="inline-flex items-center gap-1.5 text-xs font-medium bg-navy border border-putih/15 rounded-lg px-3 py-1.5 hover:border-gold/30 hover:text-gold transition-all disabled:opacity-50"
                              >
                                {updatingId === u.id ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : (
                                  <TrendingUp className="w-3 h-3" />
                                )}
                                Ubah Tier
                                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdownId === u.id ? "rotate-180" : ""}`} />
                              </button>

                              {/* Dropdown */}
                              <AnimatePresence>
                                {openDropdownId === u.id && (
                                  <motion.div
                                    initial={{ opacity: 0, y: (index >= filteredUsers.length - 2 && filteredUsers.length > 2) ? 4 : -4, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: (index >= filteredUsers.length - 2 && filteredUsers.length > 2) ? 4 : -4, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className={`absolute right-0 ${
                                      index >= filteredUsers.length - 2 && filteredUsers.length > 2
                                        ? "bottom-full mb-1 origin-bottom-right"
                                        : "top-full mt-1 origin-top-right"
                                    } w-44 bg-navy-dark border border-putih/15 rounded-xl shadow-2xl z-50 overflow-hidden`}
                                  >
                                    {Object.entries(TIER_CONFIG).map(([key, config]) => (
                                      <button
                                        key={key}
                                        type="button"
                                        onClick={() => handleTierChange(u.id, key)}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-putih/5 transition-colors ${
                                          u.tier === key ? config.color + " font-semibold" : "text-putih/70"
                                        }`}
                                      >
                                        <span className="flex items-center gap-2">
                                          {key !== "free" && <Crown className="w-3 h-3" />}
                                          {config.label}
                                        </span>
                                        {u.tier === key && <Check className="w-3.5 h-3.5" />}
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Click outside to close dropdown */}
      {openDropdownId && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setOpenDropdownId(null)}
        />
      )}
    </div>
  );
}
