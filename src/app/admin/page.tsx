"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Users, Crown, Shield, Search, 
  ChevronDown, Check, X, RefreshCw, 
  BarChart3, UserCheck, TrendingUp, MessageSquare,
  Clock, CheckCircle, ExternalLink, Scale, FileText, Briefcase, AlertCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/auth/LoadingScreen";
import { createClient } from "@/lib/supabase/client";

interface UserData {
  id: string;
  email: string;
  full_name: string | null;
  is_premium: boolean;
  role: string;
  tier: string;
  created_at: string;
  consultationCount: number;
  institution_name?: string | null;
  institution_type?: string | null;
  has_analytics_access?: boolean;
  token_balance?: number;
}

interface ChatData {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  created_at: string;
  updated_at: string;
  user?: {
    email: string;
    full_name: string;
  };
}

const TIER_CONFIG = {
  free: { label: "Free", color: "text-putih/50", bg: "bg-putih/5", border: "border-putih/20", badge: "bg-putih/10 text-putih/60" },
  professional: { label: "Professional", color: "text-gold", bg: "bg-gold/5", border: "border-gold/20", badge: "bg-gold/20 text-gold" },
  enterprise: { label: "Enterprise", color: "text-purple-400", bg: "bg-purple-500/5", border: "border-purple-500/20", badge: "bg-purple-500/20 text-purple-300" },
};

export default function AdminDashboard() {
  const { profile, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [users, setUsers] = useState<UserData[]>([]);
  const [chats, setChats] = useState<ChatData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingChats, setLoadingChats] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "advocates" | "bookings" | "enterprise">("users");
  const [transactionTab, setTransactionTab] = useState<"consultations" | "listings">("consultations");
  const [advocates, setAdvocates] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loadingAdvocates, setLoadingAdvocates] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingListings, setLoadingListings] = useState(true);
  
  // Edit user state
  const [editUserModal, setEditUserModal] = useState<{isOpen: boolean, user: UserData | null}>({isOpen: false, user: null});
  const [editFormData, setEditFormData] = useState({full_name: "", role: "", institution_name: "", token_balance: 0, institution_type: "swasta", has_analytics_access: false});
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

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

  const fetchChats = useCallback(async () => {
    setLoadingChats(true);
    try {
      const { data: chatsData, error: chatsError } = await supabase
        .from("chats")
        .select("id, user_id, plan, status, created_at, updated_at")
        .order("updated_at", { ascending: false });

      if (chatsError) {
        console.error("Supabase Chats Error:", chatsError);
        setChats([]);
        return;
      }

      if (chatsData && chatsData.length > 0) {
        const userIds = [...new Set(chatsData.map((c: any) => c.user_id).filter(Boolean))];
        const { data: usersData } = await supabase
          .from("users")
          .select("id, email, full_name")
          .in("id", userIds);

        const userMap = new Map();
        if (usersData) {
          usersData.forEach((u: any) => userMap.set(u.id, u));
        }

        const mergedChats = chatsData.map((c: any) => ({
          ...c,
          user: userMap.get(c.user_id) || { email: "Unknown", full_name: "Unknown User" }
        }));

        setChats(mergedChats as any);
      } else {
        setChats([]);
      }
    } catch (e) {
      console.error("Failed to fetch chats:", e);
      setChats([]);
    } finally {
      setLoadingChats(false);
    }
  }, [supabase]);

  const fetchAdvocates = useCallback(async () => {
    setLoadingAdvocates(true);
    try {
      const res = await fetch("/api/admin/advocates");
      if (res.ok) {
        const data = await res.json();
        setAdvocates(data.advocates || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAdvocates(false);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    setLoadingBookings(true);
    try {
      // Fetch bookings with advocate details
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select(`
          id, consultation_rate, status, created_at, payment_status, user_id,
          advocate:advocates(full_name)
        `)
        .order("created_at", { ascending: false });
        
      if (bookingsError) {
        console.error("Supabase Bookings Error:", bookingsError);
        return;
      }
        
      if (bookingsData && bookingsData.length > 0) {
        // Fetch user details separately to avoid foreign key issues to auth.users
        const userIds = [...new Set(bookingsData.map((b: any) => b.user_id))];
        const { data: usersData } = await supabase
          .from("users")
          .select("id, full_name, email")
          .in("id", userIds);
          
        const userMap = new Map();
        if (usersData) {
          usersData.forEach((u: any) => userMap.set(u.id, u));
        }
        
        // Merge data
        const mergedBookings = bookingsData.map((b: any) => ({
          ...b,
          client: userMap.get(b.user_id) || { full_name: "Unknown", email: "" }
        }));
        
        setBookings(mergedBookings);
      } else {
        setBookings([]);
      }
    } catch (e) {
      console.error("Failed to fetch bookings:", e);
    } finally {
      setLoadingBookings(false);
    }
  }, [supabase]); // supabase is now stable via useMemo

  const fetchListings = useCallback(async () => {
    setLoadingListings(true);
    try {
      const { data, error } = await supabase
        .from("listings")
        .select(`
          id, payment_amount, listing_status, listing_start_date, listing_expired_date, payment_order_id,
          advocate:advocates(full_name)
        `)
        .order("listing_start_date", { ascending: false });
        
      if (!error && data) {
        setListings(data);
      }
    } catch (e) {
      console.error("Failed to fetch listings:", e);
    } finally {
      setLoadingListings(false);
    }
  }, [supabase]); // supabase is now stable via useMemo

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchChats();
      fetchAdvocates();
      fetchBookings();
      fetchListings();
    }
  }, [isAdmin, fetchUsers, fetchChats, fetchAdvocates, fetchBookings, fetchListings]);

  const handleVerifyAdvocate = async (advocateId: string, action: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/admin/advocates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ advocateId, action }),
      });
      if (res.ok) {
        setAdvocates(prev => prev.map(a => a.id === advocateId ? { ...a, verification_status: action } : a));
      }
    } catch (e) {
      console.error(e);
    }
  };

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
      } else {
        const errorData = await res.json();
        showNotification("Gagal mengupdate tier: " + (errorData.error || "Server Error"), "error");
      }
    } catch (e) {
      console.error("Failed to update tier:", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateUser = async () => {
    if (!editUserModal.user) return;
    setUpdatingId(editUserModal.user.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editUserModal.user.id,
          full_name: editFormData.full_name,
          role: editFormData.role,
          institution_name: editFormData.institution_name,
          token_balance: editFormData.token_balance,
          institution_type: editFormData.institution_type,
          has_analytics_access: editFormData.has_analytics_access
        }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui");
      
      setUsers(prev => prev.map(u => 
        u.id === editUserModal.user?.id ? { ...u, full_name: editFormData.full_name, role: editFormData.role, institution_name: editFormData.institution_name, token_balance: editFormData.token_balance, institution_type: editFormData.institution_type, has_analytics_access: editFormData.has_analytics_access } : u
      ));
      setEditUserModal({isOpen: false, user: null});
      showNotification("Pengguna berhasil diperbarui", "success");
    } catch (error) {
      console.error("Error updating user:", error);
      showNotification("Gagal memperbarui pengguna", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun ${name}? Data tidak dapat dikembalikan.`)) return;
    
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Gagal menghapus pengguna");
      
      setUsers(prev => prev.filter(u => u.id !== userId));
      showNotification("Pengguna berhasil dihapus", "success");
    } catch (error) {
      console.error("Error deleting user:", error);
      showNotification("Gagal menghapus pengguna", "error");
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", bookingId);
      if (error) throw error;
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    } catch (e) {
      console.error("Failed to update booking status:", e);
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
  const openChats = chats.filter(c => c.status === "open").length;
  const resolvedChats = chats.filter(c => c.status === "resolved").length;

  if (isLoading || !isAdmin) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-navy-dark border-b border-putih/20 py-4 px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-10 h-10 rounded-full bg-navy-light flex items-center justify-center hover:bg-putih/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-putih" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-navy-light border border-putih/20 rounded-xl shadow-md overflow-hidden">
                <Image src="/images/logo-128.webp" alt="KonsultanAI Logo" fill sizes="40px" className="object-cover" priority />
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
            <Link 
              href="/admin/chat" 
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-navy font-bold text-sm hover:bg-gold-light transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Live Chat
            </Link>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              {profile?.fullName || profile?.email}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="bg-navy-light/40 border border-putih/20 rounded-2xl p-6 group hover:border-putih/20 transition-colors"
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
            className="bg-navy-light/40 border border-putih/20 rounded-2xl p-6 group hover:border-gold/20 transition-colors"
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
            className="bg-navy-light/40 border border-putih/20 rounded-2xl p-6 group hover:border-green-500/20 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-sm text-putih/60 font-medium">Total Konsultasi</span>
            </div>
            <p className="text-3xl font-bold text-putih">{totalConsultations}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-navy-light/40 border border-putih/20 rounded-2xl p-6 group hover:border-orange-500/20 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-sm text-putih/60 font-medium">Transaksi Masuk</span>
            </div>
            <p className="text-3xl font-bold text-putih">{chats.length}</p>
            <p className="text-xs text-putih/40 mt-1">
              <span className="text-green-400">{openChats} open</span> · <span className="text-putih/50">{resolvedChats} selesai</span>
            </p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-putih/20 pb-2">
          <button
            onClick={() => setActiveTab("users")}
            className={`font-bold pb-2 border-b-2 transition-colors ${activeTab === "users" ? "border-gold text-gold" : "border-transparent text-putih/50 hover:text-putih"}`}
          >
            Pengguna
          </button>
          <button
            onClick={() => setActiveTab("advocates")}
            className={`font-bold pb-2 border-b-2 transition-colors ${activeTab === "advocates" ? "border-gold text-gold" : "border-transparent text-putih/50 hover:text-putih"}`}
          >
            Verifikasi Advokat
            {advocates.filter(a => a.verification_status === "pending").length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {advocates.filter(a => a.verification_status === "pending").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`font-bold pb-2 border-b-2 transition-colors ${activeTab === "bookings" ? "border-gold text-gold" : "border-transparent text-putih/50 hover:text-putih"}`}
          >
            Transaksi Advokat
          </button>
          <button
            onClick={() => setActiveTab("enterprise")}
            className={`font-bold pb-2 border-b-2 transition-colors ${activeTab === "enterprise" ? "border-gold text-gold" : "border-transparent text-putih/50 hover:text-putih"}`}
          >
            Klien Enterprise
          </button>
        </div>

        {activeTab === "users" ? (
          <div className="space-y-8">
            {/* Users Table Section */}
            <div className="bg-navy-light/30 border border-putih/20 rounded-2xl overflow-hidden">
          {/* Table Header / Controls */}
          <div className="p-4 border-b border-putih/20 flex flex-col md:flex-row gap-3 md:items-center justify-between">
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
                <option value="professional">Professional</option>
                <option value="enterprise">Enterprise</option>
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
                    <th className="text-center py-3 px-4 font-semibold">Saldo Token</th>
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

                        {/* Token Balance */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-gold font-bold">{u.token_balance || 0}</span>
                            {u.tier === 'free' && (
                              <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded mt-0.5">
                                +{Math.max(0, 3 - (u.consultationCount || 0))} Trial
                              </span>
                            )}
                          </div>
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
                                Opsi
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
                                    <div className="px-3 py-2 text-xs font-semibold text-putih/40 border-b border-putih/20 uppercase tracking-wider">
                                      Tingkat AI
                                    </div>
                                    {Object.entries(TIER_CONFIG).map(([key, config]) => (
                                      <button
                                        key={key}
                                        type="button"
                                        onClick={() => handleTierChange(u.id, key)}
                                        className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-putih/5 transition-colors ${
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
                                    <div className="px-3 py-2 text-xs font-semibold text-putih/40 border-y border-putih/20 uppercase tracking-wider mt-1">
                                      Manajemen
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenDropdownId(null);
                                        setEditFormData({full_name: u.full_name || "", role: u.role, institution_name: u.institution_name || "", token_balance: u.token_balance || 0, institution_type: u.institution_type || "swasta", has_analytics_access: u.has_analytics_access || false});
                                        setEditUserModal({isOpen: true, user: u});
                                      }}
                                      className="w-full text-left px-3 py-2.5 text-sm text-putih hover:bg-putih/5 transition-colors flex items-center gap-2"
                                    >
                                      Edit Profil
                                    </button>
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

        {/* Recent Transactions Section */}
        <div className="bg-navy-light/30 border border-putih/20 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-putih/20 flex flex-col md:flex-row gap-3 md:items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-gold" />
              <h2 className="font-bold text-lg">Status Transaksi</h2>
              <span className="text-xs bg-putih/10 px-2 py-0.5 rounded-full text-putih/50">
                {chats.length}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={fetchChats}
                className="p-2 bg-navy border border-putih/15 rounded-lg hover:bg-putih/5 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 text-putih/50 ${loadingChats ? "animate-spin" : ""}`} />
              </button>
              <Link
                href="/admin/chat"
                className="flex items-center gap-1.5 text-xs font-medium bg-gold text-navy px-3 py-2 rounded-lg hover:bg-gold-light transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Buka Live Chat
              </Link>
            </div>
          </div>

          {loadingChats ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
              <p className="text-putih/40 text-sm">Memuat data transaksi...</p>
            </div>
          ) : chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <MessageSquare className="w-10 h-10 text-putih/15" />
              <p className="text-putih/40 text-sm">Belum ada transaksi</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-navy-dark/50 text-putih/50 text-xs uppercase tracking-wider">
                    <th className="text-left py-3 px-4 font-semibold">Pengguna</th>
                    <th className="text-left py-3 px-4 font-semibold hidden md:table-cell">Paket</th>
                    <th className="text-center py-3 px-4 font-semibold">Status</th>
                    <th className="text-center py-3 px-4 font-semibold hidden sm:table-cell">Tanggal</th>
                    <th className="text-center py-3 px-4 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-putih/5">
                  {chats.map((chat) => {
                    const userName = chat.user?.full_name || chat.user?.email || "Unknown";
                    const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
                    return (
                      <tr key={chat.id} className="hover:bg-putih/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-putih/10 flex items-center justify-center text-xs font-bold text-putih/70 shrink-0">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-putih truncate">{userName}</p>
                              <p className="text-xs text-putih/40 md:hidden">{chat.plan}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <span className="text-gold font-semibold text-xs bg-gold/10 px-2.5 py-1 rounded-full">
                            {chat.plan}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                            chat.status === "open" 
                              ? "bg-orange-500/15 text-orange-400" 
                              : "bg-green-500/15 text-green-400"
                          }`}>
                            {chat.status === "open" ? (
                              <><Clock className="w-3 h-3" /> Menunggu</>
                            ) : (
                              <><CheckCircle className="w-3 h-3" /> Selesai</>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center hidden sm:table-cell">
                          <span className="text-putih/40 text-xs">
                            {new Date(chat.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Link
                            href="/admin/chat"
                            className="inline-flex items-center gap-1 text-xs font-medium text-gold hover:text-gold-light transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Balas
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
          </div>
        ) : activeTab === "advocates" ? (
          <div className="bg-navy-light/30 border border-putih/20 rounded-2xl overflow-hidden p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-putih/20 pb-4">
              <Scale className="w-5 h-5 text-gold" />
              <h2 className="font-bold text-lg">Verifikasi Advokat</h2>
            </div>
            
            {loadingAdvocates ? (
              <div className="flex justify-center py-10"><RefreshCw className="w-6 h-6 animate-spin text-gold" /></div>
            ) : advocates.length === 0 ? (
              <p className="text-center text-putih/50 py-10">Belum ada data pendaftaran advokat.</p>
            ) : (
              <div className="space-y-4">
                {advocates.map(adv => (
                  <div key={adv.id} className="bg-navy border border-putih/20 rounded-xl p-5 flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-putih">{adv.full_name}</h3>
                          <p className="text-sm text-putih/60">{adv.email} • {adv.phone}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          adv.verification_status === "pending" ? "bg-orange-500/20 text-orange-400" :
                          adv.verification_status === "approved" ? "bg-green-500/20 text-green-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>
                          {adv.verification_status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-putih/50 text-xs mb-1">NIA & Organisasi</p>
                          <p>{adv.license_number} ({adv.organization})</p>
                        </div>
                        <div>
                          <p className="text-putih/50 text-xs mb-1">Pengalaman</p>
                          <p>{adv.experience_years} Tahun</p>
                        </div>
                        <div className="col-span-2 bg-putih/5 p-3 rounded-lg border border-putih/20">
                          <p className="text-putih/50 text-xs mb-1 font-semibold text-gold">Informasi Rekening Bank (Private)</p>
                          <p className="font-medium">{adv.bank_name} - {adv.bank_account}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-putih/50 text-xs mb-2">Dokumen Terlampir</p>
                          <div className="flex flex-wrap gap-2">
                            {adv.documents?.map((doc: any) => (
                              <a key={doc.id} href={doc.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-xs hover:bg-blue-500/20">
                                <FileText className="w-3.5 h-3.5" />
                                {doc.document_type}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {adv.verification_status === "pending" && (
                      <div className="flex flex-row md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-putih/20 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                        <button
                          onClick={() => handleVerifyAdvocate(adv.id, "approved")}
                          className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 font-semibold py-2 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Setujui
                        </button>
                        <button
                          onClick={() => handleVerifyAdvocate(adv.id, "rejected")}
                          className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 font-semibold py-2 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Tolak
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "bookings" ? (
          <div className="bg-navy-light/30 border border-putih/20 rounded-2xl overflow-hidden p-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between border-b border-putih/20 pb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gold" />
                <h2 className="font-bold text-lg">Riwayat Keuangan</h2>
              </div>
              <div className="flex items-center gap-2 bg-navy border border-putih/20 rounded-lg p-1">
                <button
                  onClick={() => setTransactionTab("consultations")}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${transactionTab === "consultations" ? "bg-putih/10 text-putih" : "text-putih/50 hover:text-putih"}`}
                >
                  Konsultasi (Klien ➡️ Advokat)
                </button>
                <button
                  onClick={() => setTransactionTab("listings")}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${transactionTab === "listings" ? "bg-putih/10 text-putih" : "text-putih/50 hover:text-putih"}`}
                >
                  Listing (Advokat ➡️ Platform)
                </button>
              </div>
              <button
                type="button"
                onClick={transactionTab === "consultations" ? fetchBookings : fetchListings}
                className="hidden sm:block p-2 bg-navy border border-putih/15 rounded-lg hover:bg-putih/5 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 text-putih/50 ${(transactionTab === "consultations" ? loadingBookings : loadingListings) ? "animate-spin" : ""}`} />
              </button>
            </div>
            
            {transactionTab === "consultations" ? (
              // Consultations Table
              loadingBookings ? (
                <div className="flex justify-center py-10"><RefreshCw className="w-6 h-6 animate-spin text-gold" /></div>
              ) : bookings.length === 0 ? (
                <p className="text-center text-putih/50 py-10">Belum ada transaksi konsultasi advokat.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-navy-dark/50 text-putih/50 text-xs uppercase tracking-wider">
                        <th className="text-left py-3 px-4 font-semibold">ID</th>
                        <th className="text-left py-3 px-4 font-semibold">Klien</th>
                        <th className="text-left py-3 px-4 font-semibold">Advokat</th>
                        <th className="text-center py-3 px-4 font-semibold">Nominal</th>
                        <th className="text-center py-3 px-4 font-semibold">Status</th>
                        <th className="text-center py-3 px-4 font-semibold">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-putih/5">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-putih/[0.02] transition-colors">
                          <td className="py-3 px-4 text-xs font-mono text-putih/50">{booking.id.split('-')[0]}</td>
                          <td className="py-3 px-4 font-medium">{booking.client?.full_name || booking.client?.email}</td>
                          <td className="py-3 px-4 text-gold">{booking.advocate?.full_name}</td>
                          <td className="py-3 px-4 text-center font-bold">
                            Rp {(booking.consultation_rate || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <select
                              value={booking.status}
                              onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                              className={`text-xs font-semibold px-2 py-1 rounded-md outline-none cursor-pointer appearance-none text-center ${
                                booking.status === "completed" 
                                  ? "bg-green-500/15 text-green-400 border border-green-500/30" 
                                  : booking.status === "pending"
                                    ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                                    : booking.status === "confirmed"
                                      ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                                      : "bg-red-500/15 text-red-400 border border-red-500/30"
                              }`}
                            >
                              <option value="pending" className="bg-navy text-putih">pending</option>
                              <option value="confirmed" className="bg-navy text-putih">confirmed</option>
                              <option value="completed" className="bg-navy text-putih">completed</option>
                              <option value="cancelled" className="bg-navy text-putih">cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-center text-putih/50 text-xs">
                            {new Date(booking.created_at).toLocaleString("id-ID")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              // Listings Table
              loadingListings ? (
                <div className="flex justify-center py-10"><RefreshCw className="w-6 h-6 animate-spin text-gold" /></div>
              ) : listings.length === 0 ? (
                <p className="text-center text-putih/50 py-10">Belum ada transaksi pembayaran listing.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-navy-dark/50 text-putih/50 text-xs uppercase tracking-wider">
                        <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                        <th className="text-left py-3 px-4 font-semibold">Advokat</th>
                        <th className="text-center py-3 px-4 font-semibold">Nominal</th>
                        <th className="text-center py-3 px-4 font-semibold">Status Listing</th>
                        <th className="text-center py-3 px-4 font-semibold">Tgl Mulai</th>
                        <th className="text-center py-3 px-4 font-semibold">Tgl Berakhir</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-putih/5">
                      {listings.map((listing) => (
                        <tr key={listing.id} className="hover:bg-putih/[0.02] transition-colors">
                          <td className="py-3 px-4 text-xs font-mono text-putih/50">{listing.payment_order_id || listing.id.split('-')[0]}</td>
                          <td className="py-3 px-4 font-medium text-gold">{listing.advocate?.full_name}</td>
                          <td className="py-3 px-4 text-center font-bold text-green-400">
                            +Rp {listing.payment_amount?.toLocaleString("id-ID") || "50.000"}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                              listing.listing_status === "active" 
                                ? "bg-green-500/15 text-green-400" 
                                : listing.listing_status === "expired"
                                  ? "bg-red-500/15 text-red-400"
                                  : "bg-putih/10 text-putih/50"
                            }`}>
                              {listing.listing_status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-putih/50 text-xs">
                            {new Date(listing.listing_start_date).toLocaleDateString("id-ID")}
                          </td>
                          <td className="py-3 px-4 text-center text-putih/50 text-xs">
                            {new Date(listing.listing_expired_date).toLocaleDateString("id-ID")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        ) : activeTab === "enterprise" ? (
          <div className="bg-navy-light/30 border border-putih/20 rounded-2xl overflow-hidden p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-putih/20 pb-4">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-gold" />
                <h2 className="font-bold text-lg">Kelola Klien Enterprise</h2>
              </div>
              <button
                type="button"
                onClick={fetchUsers}
                className="p-2 bg-navy border border-putih/15 rounded-lg hover:bg-putih/5 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 text-putih/50 ${loadingUsers ? "animate-spin" : ""}`} />
              </button>
            </div>
            
            {loadingUsers ? (
              <div className="flex justify-center py-10"><RefreshCw className="w-6 h-6 animate-spin text-gold" /></div>
            ) : users.filter(u => u.tier === "enterprise").length === 0 ? (
              <div className="text-center text-putih/50 py-10 flex flex-col items-center">
                <Briefcase className="w-10 h-10 mb-3 opacity-30" />
                <p>Belum ada klien Enterprise yang terdaftar.</p>
                <p className="text-sm mt-1">Ubah tier pengguna menjadi 'Enterprise' di tab Pengguna.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {users.filter(u => u.tier === "enterprise").map(instansi => {
                  const subAccounts = users.filter(u => u.parent_id === instansi.id);
                  const isExpired = instansi.subscription_expires_at ? new Date(instansi.subscription_expires_at) < new Date() : false;
                  
                  return (
                    <div key={instansi.id} className="bg-navy border border-putih/20 rounded-xl p-5">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4 border-b border-putih/10 pb-4">
                        <div>
                          <h3 className="font-bold text-xl text-putih">{instansi.institution_name || "Instansi Tanpa Nama"}</h3>
                          <p className="text-sm text-putih/60 mt-1">Admin: {instansi.full_name} ({instansi.email})</p>
                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-xs bg-gold/10 text-gold px-2 py-1 rounded font-bold border border-gold/20">
                              Saldo Induk: {instansi.token_balance || 0}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded font-bold border ${isExpired ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}>
                              Berakhir: {instansi.subscription_expires_at ? new Date(instansi.subscription_expires_at).toLocaleDateString("id-ID") : "Tidak ditentukan"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded font-bold border border-blue-500/20 capitalize">
                              {instansi.institution_type === 'pemerintah' ? 'Pemerintahan' : 'Swasta'}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded font-bold border ${instansi.has_analytics_access ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-putih/10 text-putih/40 border-putih/20"}`}>
                              Gov Analytics: {instansi.has_analytics_access ? "Akses Diberikan" : "Tidak Ada Akses"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <div className="text-right">
                            <p className="text-sm text-putih/50">Total Akun Cabang</p>
                            <p className="text-2xl font-bold text-putih">{subAccounts.length} / 5</p>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => {
                                setEditFormData({full_name: instansi.full_name || "", role: instansi.role, institution_name: instansi.institution_name || "", token_balance: instansi.token_balance || 0, institution_type: instansi.institution_type || "swasta", has_analytics_access: instansi.has_analytics_access || false});
                                setEditUserModal({isOpen: true, user: instansi});
                              }}
                              className="text-xs text-gold border border-gold/30 hover:bg-gold/10 px-3 py-1.5 rounded transition-colors"
                            >
                              Edit Instansi
                            </button>
                            <button
                              onClick={() => handleDeleteUser(instansi.id, instansi.institution_name || instansi.full_name || instansi.email)}
                              className="text-xs text-red-400 border border-red-500/30 hover:bg-red-500/10 px-3 py-1.5 rounded transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Sub accounts list */}
                      <div>
                        <h4 className="text-sm font-semibold text-putih/70 mb-3">Daftar Akun Karyawan / Cabang</h4>
                        {subAccounts.length === 0 ? (
                          <p className="text-xs text-putih/40 italic">Belum ada akun cabang yang dibuat oleh instansi ini.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-left text-putih/40 text-xs border-b border-putih/10">
                                  <th className="pb-2 font-medium">Nama & Email</th>
                                  <th className="pb-2 font-medium text-center">Saldo Token</th>
                                  <th className="pb-2 font-medium text-right">Dibuat Pada</th>
                                  <th className="pb-2 font-medium text-right">Aksi</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-putih/5">
                                {subAccounts.map(sub => (
                                  <tr key={sub.id}>
                                    <td className="py-2">
                                      <p className="text-putih">{sub.full_name || "Tanpa Nama"}</p>
                                      <p className="text-xs text-putih/40">{sub.email}</p>
                                    </td>
                                    <td className="py-2 text-center">
                                      <span className="text-gold font-bold">{sub.token_balance || 0}</span>
                                    </td>
                                    <td className="py-2 text-right text-xs text-putih/40">
                                      {new Date(sub.created_at).toLocaleDateString("id-ID")}
                                    </td>
                                    <td className="py-2 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <button
                                          onClick={() => {
                                            setEditFormData({full_name: sub.full_name || "", role: sub.role, institution_name: sub.institution_name || "", token_balance: sub.token_balance || 0, institution_type: sub.institution_type || "swasta", has_analytics_access: sub.has_analytics_access || false});
                                            setEditUserModal({isOpen: true, user: sub});
                                          }}
                                          className="text-[10px] text-gold border border-gold/30 hover:bg-gold/10 px-2 py-1 rounded transition-colors"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDeleteUser(sub.id, sub.full_name || sub.email)}
                                          className="text-[10px] text-red-400 border border-red-500/30 hover:bg-red-500/10 px-2 py-1 rounded transition-colors"
                                        >
                                          Hapus
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}
      </main>

      {/* Edit User Modal */}
      {editUserModal.isOpen && editUserModal.user && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setEditUserModal({isOpen: false, user: null})}>
          <div className="bg-navy-light border border-putih/20 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-xl mb-4 text-putih">Edit Pengguna</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-putih/70 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={editFormData.full_name}
                  onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})}
                  className="w-full bg-navy border border-putih/15 rounded-lg px-4 py-2 text-putih focus:outline-none focus:border-gold/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-putih/70 mb-1">Role</label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                  className="w-full bg-navy border border-putih/15 rounded-lg px-4 py-2 text-putih focus:outline-none focus:border-gold/40"
                >
                  <option value="user">User</option>
                  <option value="advocate">Advocate</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {editUserModal.user.tier === 'enterprise' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-putih/70 mb-1">Nama Instansi (Khusus Enterprise)</label>
                    <input
                      type="text"
                      value={editFormData.institution_name}
                      onChange={(e) => setEditFormData({...editFormData, institution_name: e.target.value})}
                      placeholder="Kosongkan jika bukan enterprise..."
                      className="w-full bg-navy border border-putih/15 rounded-lg px-4 py-2 text-putih focus:outline-none focus:border-gold/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-putih/70 mb-1">Tipe Instansi (Khusus Enterprise)</label>
                    <select
                      value={editFormData.institution_type}
                      onChange={(e) => setEditFormData({...editFormData, institution_type: e.target.value})}
                      className="w-full bg-navy border border-putih/15 rounded-lg px-4 py-2 text-putih focus:outline-none focus:border-gold/40"
                    >
                      <option value="swasta">Swasta</option>
                      <option value="pemerintah">Pemerintahan</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-3 p-3 bg-navy border border-putih/15 rounded-lg cursor-pointer hover:bg-putih/5 transition-colors">
                      <input
                        type="checkbox"
                        checked={editFormData.has_analytics_access}
                        onChange={(e) => setEditFormData({...editFormData, has_analytics_access: e.target.checked})}
                        className="w-5 h-5 accent-gold cursor-pointer rounded border-putih/20"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-putih">Akses Government Analytics</span>
                        <span className="text-xs text-putih/50">Izinkan instansi ini untuk melihat data analitik</span>
                      </div>
                    </label>
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-putih/70 mb-1">Saldo Token</label>
                <input
                  type="number"
                  min="0"
                  value={editFormData.token_balance}
                  onChange={(e) => setEditFormData({...editFormData, token_balance: parseInt(e.target.value) || 0})}
                  className="w-full bg-navy border border-putih/15 rounded-lg px-4 py-2 text-putih focus:outline-none focus:border-gold/40"
                />
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-lg text-xs text-orange-400">
                <span className="font-bold block mb-1">Peringatan:</span>
                Mengubah Role dapat memberikan akses khusus ke pengguna ini.
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setEditUserModal({isOpen: false, user: null})}
                className="flex-1 bg-putih/10 hover:bg-putih/20 text-putih py-2 rounded-xl font-bold transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleUpdateUser}
                disabled={updatingId !== null}
                className="flex-1 bg-gold hover:bg-gold-light text-navy py-2 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updatingId !== null ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Click outside to close dropdown */}
      {openDropdownId && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setOpenDropdownId(null)}
        />
      )}

      {/* Floating Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md min-w-[300px] max-w-[90vw] ${
              notification.type === 'success' 
                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {notification.type === 'success' && <CheckCircle className="w-6 h-6 shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-6 h-6 shrink-0" />}
            
            <p className="font-medium text-sm flex-1">{notification.message}</p>
            
            <button 
              onClick={() => setNotification(null)}
              className="p-1 hover:bg-putih/10 rounded-full transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

