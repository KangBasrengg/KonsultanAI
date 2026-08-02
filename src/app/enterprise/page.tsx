"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Trash2, ShieldAlert, Coins, RefreshCw, X, ArrowLeft, Send, CheckCircle, AlertCircle, Settings } from "lucide-react";
import Link from "next/link";

export default function EnterpriseDashboard() {
  const { user, profile, isVerifying, refreshProfile } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminBalance, setAdminBalance] = useState(0);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<{isOpen: boolean, empId: string | null, type: 'give' | 'take'}>({ isOpen: false, empId: null, type: 'give' });

  // Add form state
  const [addForm, setAddForm] = useState({ name: "", email: "", password: "", initialTokens: 0 });
  const [transferAmount, setTransferAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  const [editModal, setEditModal] = useState<{isOpen: boolean, emp: any, activeTab: 'profile' | 'token'}>({ isOpen: false, emp: null, activeTab: 'profile' });
  const [editForm, setEditForm] = useState({ name: "", email: "", password: "" });

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  useEffect(() => {
    if (!isVerifying && !user) {
      router.replace("/?login=true");
      return;
    }
    if (!isVerifying && profile && profile.tier !== "enterprise" && profile.role !== "admin") {
      showNotification("Akses ditolak. Halaman ini khusus untuk paket Enterprise.", "error");
      router.replace("/");
      return;
    }
    if (user && profile) {
      fetchEmployees();
    }
  }, [user, profile, isVerifying, router]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/enterprise/users");
      const data = await res.json();
      if (res.ok) {
        setEmployees(data.employees || []);
        setAdminBalance(data.token_balance || 0);
      } else {
        showNotification(data.error || "Gagal mengambil data karyawan", "error");
      }
    } catch (error) {
      showNotification("Terjadi kesalahan jaringan", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addForm.initialTokens > adminBalance) {
      return showNotification("Saldo token Anda tidak mencukupi untuk dialokasikan.", "error");
    }
    if (employees.length >= 5) {
      return showNotification("Maksimal 5 akun karyawan untuk paket Enterprise.", "error");
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/enterprise/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: addForm.name,
          email: addForm.email,
          password: addForm.password,
          initial_tokens: addForm.initialTokens
        })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("Karyawan berhasil ditambahkan!", "success");
        setIsAddModalOpen(false);
        setAddForm({ name: "", email: "", password: "", initialTokens: 0 });
        fetchEmployees();
        refreshProfile(); // Update local token balance
      } else {
        showNotification(data.error || "Gagal menambahkan karyawan", "error");
      }
    } catch (error) {
      showNotification("Terjadi kesalahan jaringan", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTransferModalOpen.empId || transferAmount <= 0) return;
    
    const amount = isTransferModalOpen.type === 'give' ? transferAmount : -transferAmount;
    
    if (isTransferModalOpen.type === 'give' && transferAmount > adminBalance) {
      return showNotification("Saldo token Anda tidak mencukupi.", "error");
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/enterprise/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: isTransferModalOpen.empId,
          transfer_amount: amount
        })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("Transfer kuota berhasil!", "success");
        setIsTransferModalOpen({ isOpen: false, empId: null, type: 'give' });
        setTransferAmount(0);
        fetchEmployees();
        refreshProfile();
      } else {
        showNotification(data.error || "Gagal transfer kuota", "error");
      }
    } catch (error) {
      showNotification("Terjadi kesalahan jaringan", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.emp) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/enterprise/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: editModal.emp.id,
          full_name: editForm.name,
          email: editForm.email,
          password: editForm.password
        })
      });
      const data = await res.json();
      if (res.ok) {
        showNotification("Profil karyawan berhasil diperbarui!", "success");
        fetchEmployees();
        setEditModal(prev => ({...prev, isOpen: false}));
      } else {
        showNotification(data.error || "Gagal memperbarui profil", "error");
      }
    } catch (error) {
      showNotification("Terjadi kesalahan jaringan", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun ${name}? Sisa kuota mereka akan dikembalikan ke saldo Anda.`)) return;

    try {
      const res = await fetch(`/api/enterprise/users?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        showNotification("Akun berhasil dihapus.", "success");
        fetchEmployees();
        refreshProfile();
      } else {
        showNotification(data.error || "Gagal menghapus akun", "error");
      }
    } catch (error) {
      showNotification("Terjadi kesalahan jaringan", "error");
    }
  };

  if (loading || isVerifying) {
    return <div className="min-h-screen bg-navy flex items-center justify-center text-gold"><RefreshCw className="w-8 h-8 animate-spin" /></div>;
  }

  const totalDistributed = employees.reduce((acc, emp) => acc + (emp.token_balance || 0), 0);

  return (
    <div className="min-h-screen bg-navy text-putih pb-20">
      <header className="bg-navy-dark border-b border-putih/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-10 h-10 rounded-full bg-navy-light flex items-center justify-center hover:bg-putih/10 transition-colors">
              <ArrowLeft className="w-5 h-5 text-putih" />
            </Link>
            <div>
              <h1 className="font-bold text-xl text-gold">Enterprise Dashboard</h1>
              <p className="text-xs text-putih/50">{profile?.institutionName || profile?.fullName || "Instansi"}</p>
            </div>
          </div>
          <div className="bg-gold/10 border border-gold/20 px-4 py-2 rounded-xl flex items-center gap-2">
            <Coins className="w-4 h-4 text-gold" />
            <span className="text-sm font-bold text-gold">Sisa Kuota Instansi: {adminBalance}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-navy-light/50 border border-putih/10 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center"><Coins className="w-5 h-5" /></div>
              <h3 className="text-putih/70 text-sm font-medium">Kuota Tersedia (Admin)</h3>
            </div>
            <p className="text-3xl font-bold text-putih pl-14">{adminBalance}</p>
          </div>
          <div className="bg-navy-light/50 border border-putih/10 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center"><Send className="w-5 h-5" /></div>
              <h3 className="text-putih/70 text-sm font-medium">Total Kuota Didistribusikan</h3>
            </div>
            <p className="text-3xl font-bold text-putih pl-14">{totalDistributed}</p>
          </div>
          <div className="bg-navy-light/50 border border-putih/10 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center"><Users className="w-5 h-5" /></div>
              <h3 className="text-putih/70 text-sm font-medium">Total Akun Karyawan</h3>
            </div>
            <p className="text-3xl font-bold text-putih pl-14">{employees.length} <span className="text-sm text-putih/40 font-normal">/ 5 Kuota Tersedia</span></p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-putih">Daftar Karyawan</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={employees.length >= 5}
            className="flex items-center gap-2 bg-gold text-navy font-bold px-4 py-2 rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Tambah Karyawan
          </button>
        </div>

        {/* Employee List */}
        <div className="bg-navy-dark border border-putih/10 rounded-2xl overflow-hidden">
          {employees.length === 0 ? (
            <div className="p-12 text-center text-putih/50 flex flex-col items-center">
              <Users className="w-12 h-12 mb-4 opacity-20" />
              <p>Belum ada karyawan yang ditambahkan.</p>
              <p className="text-sm mt-1">Klik "Tambah Karyawan" untuk mulai mendistribusikan kuota Anda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-navy-light/50 border-b border-putih/10">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-sm text-putih/70">Nama / Email</th>
                    <th className="px-6 py-4 font-semibold text-sm text-putih/70 text-center">Saldo Kuota</th>
                    <th className="px-6 py-4 font-semibold text-sm text-putih/70 text-center">Tanggal Dibuat</th>
                    <th className="px-6 py-4 font-semibold text-sm text-putih/70 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-putih/5">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-putih/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-putih">{emp.full_name || "Karyawan"}</div>
                        <div className="text-sm text-putih/50">{emp.email}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-gold/10 text-gold px-3 py-1 rounded-full text-sm font-bold min-w-[3rem]">
                          {emp.token_balance}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-putih/50">
                        {new Date(emp.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setEditForm({ name: emp.full_name || "", email: emp.email, password: "" });
                            setEditModal({ isOpen: true, emp: emp, activeTab: 'profile' });
                          }}
                          className="p-2 text-putih/50 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                          title="Pengaturan Akun"
                        >
                          <Settings className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-navy border border-putih/10 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl">
              <button onClick={() => setIsAddModalOpen(false)} className="absolute right-4 top-4 text-putih/50 hover:text-putih"><X className="w-5 h-5" /></button>
              <h3 className="text-xl font-bold text-putih mb-6">Tambah Karyawan Baru</h3>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-putih/70 mb-1">Nama Lengkap</label>
                  <input required type="text" value={addForm.name} onChange={(e) => setAddForm({...addForm, name: e.target.value})} className="w-full bg-navy-light border border-putih/20 rounded-xl px-4 py-2.5 text-putih focus:border-gold outline-none" placeholder="Budi Santoso" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-putih/70 mb-1">Email</label>
                  <input required type="email" value={addForm.email} onChange={(e) => setAddForm({...addForm, email: e.target.value})} className="w-full bg-navy-light border border-putih/20 rounded-xl px-4 py-2.5 text-putih focus:border-gold outline-none" placeholder="budi@instansi.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-putih/70 mb-1">Password Sementara</label>
                  <input required type="password" value={addForm.password} onChange={(e) => setAddForm({...addForm, password: e.target.value})} className="w-full bg-navy-light border border-putih/20 rounded-xl px-4 py-2.5 text-putih focus:border-gold outline-none" placeholder="Minimal 6 karakter" minLength={6} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-putih/70 mb-1">Alokasi Kuota Awal (Token)</label>
                  <input required type="number" min="0" max={adminBalance} value={addForm.initialTokens} onChange={(e) => setAddForm({...addForm, initialTokens: parseInt(e.target.value) || 0})} className="w-full bg-navy-light border border-putih/20 rounded-xl px-4 py-2.5 text-putih focus:border-gold outline-none" />
                  <p className="text-xs text-putih/40 mt-1">Sisa kuota instansi Anda: {adminBalance}</p>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-gold text-navy font-bold py-3 rounded-xl hover:bg-gold-light transition-colors mt-4 disabled:opacity-50 flex items-center justify-center">
                  {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Buat Akun Karyawan"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Employee Modal */}
      <AnimatePresence>
        {editModal.isOpen && editModal.emp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditModal(prev => ({...prev, isOpen: false}))} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-navy border border-putih/10 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl">
              <button onClick={() => setEditModal(prev => ({...prev, isOpen: false}))} className="absolute right-4 top-4 text-putih/50 hover:text-putih"><X className="w-5 h-5" /></button>
              <h3 className="text-xl font-bold text-putih mb-6">Pengaturan Akun Karyawan</h3>
              
              <div className="flex border-b border-putih/10 mb-6">
                <button 
                  onClick={() => setEditModal(prev => ({...prev, activeTab: 'profile'}))}
                  className={`flex-1 pb-3 text-sm font-medium transition-colors ${editModal.activeTab === 'profile' ? 'text-gold border-b-2 border-gold' : 'text-putih/50 hover:text-putih'}`}
                >
                  Profil
                </button>
                <button 
                  onClick={() => setEditModal(prev => ({...prev, activeTab: 'token'}))}
                  className={`flex-1 pb-3 text-sm font-medium transition-colors ${editModal.activeTab === 'token' ? 'text-gold border-b-2 border-gold' : 'text-putih/50 hover:text-putih'}`}
                >
                  Token & Aksi
                </button>
              </div>

              {editModal.activeTab === 'profile' && (
                <form onSubmit={handleUpdateEmployee} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-putih/70 mb-1">Nama Lengkap</label>
                    <input required type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full bg-navy-light border border-putih/20 rounded-xl px-4 py-2.5 text-putih focus:border-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-putih/70 mb-1">Email</label>
                    <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full bg-navy-light border border-putih/20 rounded-xl px-4 py-2.5 text-putih focus:border-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-putih/70 mb-1">Password Baru (Opsional)</label>
                    <input type="password" value={editForm.password} onChange={(e) => setEditForm({...editForm, password: e.target.value})} className="w-full bg-navy-light border border-putih/20 rounded-xl px-4 py-2.5 text-putih focus:border-gold outline-none" placeholder="Kosongkan jika tidak ingin mengubah" minLength={6} />
                  </div>
                  
                  <button type="submit" disabled={isSubmitting} className="w-full bg-gold text-navy font-bold py-3 rounded-xl hover:bg-gold-light transition-colors mt-4 disabled:opacity-50 flex items-center justify-center">
                    {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Simpan Perubahan"}
                  </button>
                </form>
              )}

              {editModal.activeTab === 'token' && (
                <div className="space-y-4">
                  <div className="bg-navy-light/50 p-4 rounded-xl flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-putih/50 mb-1">Saldo Karyawan Saat Ini</p>
                      <p className="text-2xl font-bold text-gold">{editModal.emp.token_balance || 0}</p>
                    </div>
                    <Coins className="w-8 h-8 text-gold/20" />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => { setEditModal(prev => ({...prev, isOpen: false})); setIsTransferModalOpen({ isOpen: true, empId: editModal.emp.id, type: 'take' }); }}
                      className="flex-1 p-3 text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-xl transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                      Tarik Kuota
                    </button>
                    <button
                      onClick={() => { setEditModal(prev => ({...prev, isOpen: false})); setIsTransferModalOpen({ isOpen: true, empId: editModal.emp.id, type: 'give' }); }}
                      className="flex-1 p-3 text-green-400 bg-green-400/10 hover:bg-green-400/20 rounded-xl transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                      Beri Top-Up
                    </button>
                  </div>

                  <div className="mt-8 pt-6 border-t border-red-500/20">
                    <h4 className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Danger Zone</h4>
                    <p className="text-xs text-putih/40 mb-4">Menghapus akun ini akan mengembalikan sisa kuota mereka ke saldo Instansi Anda.</p>
                    <button
                      onClick={() => { setEditModal(prev => ({...prev, isOpen: false})); handleDelete(editModal.emp.id, editModal.emp.full_name || editModal.emp.email); }}
                      className="w-full p-3 text-red-500 border border-red-500/30 hover:bg-red-500/10 rounded-xl transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Hapus Permanen
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transfer Quota Modal */}
      <AnimatePresence>
        {isTransferModalOpen.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsTransferModalOpen({ isOpen: false, empId: null, type: 'give' })} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-navy border border-putih/10 rounded-2xl w-full max-w-sm p-6 relative z-10 shadow-2xl">
              <button onClick={() => setIsTransferModalOpen({ isOpen: false, empId: null, type: 'give' })} className="absolute right-4 top-4 text-putih/50 hover:text-putih"><X className="w-5 h-5" /></button>
              <h3 className="text-xl font-bold text-putih mb-2">
                {isTransferModalOpen.type === 'give' ? "Beri Kuota Karyawan" : "Tarik Kuota Karyawan"}
              </h3>
              <p className="text-sm text-putih/50 mb-6">
                {isTransferModalOpen.type === 'give' 
                  ? "Pindahkan kuota instansi Anda ke akun karyawan ini." 
                  : "Ambil kembali kuota dari karyawan ini ke saldo instansi Anda."}
              </p>
              
              <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-putih/70 mb-1">Jumlah Kuota</label>
                  <input required type="number" min="1" value={transferAmount} onChange={(e) => setTransferAmount(parseInt(e.target.value) || 0)} className="w-full bg-navy-light border border-putih/20 rounded-xl px-4 py-2.5 text-putih focus:border-gold outline-none text-2xl font-bold text-center" />
                  {isTransferModalOpen.type === 'give' && <p className="text-xs text-putih/40 mt-1 text-center">Sisa kuota instansi Anda: {adminBalance}</p>}
                </div>
                <button type="submit" disabled={isSubmitting || transferAmount <= 0} className={`w-full font-bold py-3 rounded-xl transition-colors mt-4 disabled:opacity-50 flex items-center justify-center ${isTransferModalOpen.type === 'give' ? 'bg-gold text-navy hover:bg-gold-light' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                  {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Konfirmasi Transfer"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
