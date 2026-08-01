"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell 
} from "recharts";
import { Download, Users, TrendingUp, AlertTriangle, ShieldAlert, Scale, X, MapPin, Calendar, FileText, Lightbulb, UserX, MessageSquare } from "lucide-react";
import { PROVINSI_KOTA_DATA } from "@/types/cases";
import { motion, AnimatePresence } from "framer-motion";

export default function AnalyticsDashboardPage() {
  const { user, profile, isVerifying } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [provinsi, setProvinsi] = useState("all");
  const [kota, setKota] = useState("all");
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const hasFetched = useRef(false);
  const userRole = profile?.role;
  
  const wilayahParam = kota !== "all" ? kota : (provinsi !== "all" ? provinsi : "all");

  // Role access check — separate from data fetching to avoid coupling
  useEffect(() => {
    if (isVerifying) return; // Wait until auth is resolved
    if (!user) {
      router.replace("/?login=true");
      return;
    }
    if (userRole && userRole !== "admin" && userRole !== "government" && !profile?.hasAnalyticsAccess && profile?.institutionType !== "pemerintah") {
      router.replace("/admin");
    }
  }, [isVerifying, user, userRole, profile, router]);

  // Data fetching — uses stable primitive deps to avoid re-trigger loops
  const fetchData = useCallback(async () => {
    try {
      const [dashRes, trendsRes] = await Promise.all([
        fetch(`/api/analytics/dashboard?wilayah=${wilayahParam}`),
        fetch(`/api/analytics/trends?wilayah=${wilayahParam}`)
      ]);

      if (dashRes.ok) {
        setData(await dashRes.json());
      }
      if (trendsRes.ok) {
        setTrends(await trendsRes.json());
      }
    } catch (e) {
      console.error("Failed to fetch analytics:", e);
    } finally {
      setIsLoading(false);
    }
  }, [wilayahParam]);

  // Fetch chat messages when a case is selected
  useEffect(() => {
    if (selectedCase?.case_id) {
      setIsLoadingChat(true);
      fetch(`/api/analytics/chat?case_id=${selectedCase.case_id}`)
        .then(res => res.json())
        .then(data => {
          if (data.messages) {
            setChatMessages(data.messages);
          } else {
            setChatMessages([]);
          }
        })
        .catch(err => {
          console.error("Failed to fetch chat messages:", err);
          setChatMessages([]);
        })
        .finally(() => {
          setIsLoadingChat(false);
        });
    } else {
      setChatMessages([]);
    }
  }, [selectedCase]);

  useEffect(() => {
    if (!user || isVerifying) return;
    if (userRole !== "admin" && userRole !== "government" && !profile?.hasAnalyticsAccess && profile?.institutionType !== "pemerintah") return;

    // Only show full loading spinner on initial load, not on wilayah changes after first load
    if (!hasFetched.current) {
      setIsLoading(true);
      hasFetched.current = true;
    }

    fetchData();
  }, [user, isVerifying, userRole, profile, wilayahParam, fetchData]);

  if (isLoading || !data) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-navy flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </main>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

  // Format severity data
  const severityData = Object.keys(data.severity || {}).map((key) => ({
    level: `Level ${key}`,
    cases: data.severity[key as unknown as number],
  }));

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-navy">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            {(userRole === 'enterprise' || profile?.hasAnalyticsAccess) && profile?.institutionName && (
              <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm font-semibold">
                Selamat Datang, {profile.institutionName} 👋
              </div>
            )}
            <h1 className="text-3xl font-bold text-navy dark:text-putih">Government Analytics Dashboard</h1>
            <p className="text-navy/60 dark:text-putih/60 mt-1">Intelligence & Insights for Legal Cases</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <select
              value={provinsi}
              onChange={(e) => {
                setProvinsi(e.target.value);
                setKota("all"); // Reset kota when provinsi changes
              }}
              className="w-full sm:w-auto bg-white dark:bg-navy-light border border-slate-200 dark:border-putih/10 text-navy dark:text-putih rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold"
            >
              <option value="all">Semua Provinsi (Nasional)</option>
              {Object.keys(PROVINSI_KOTA_DATA).map(prov => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
            
            <select
              value={kota}
              onChange={(e) => setKota(e.target.value)}
              disabled={provinsi === "all"}
              className="w-full sm:w-auto bg-white dark:bg-navy-light border border-slate-200 dark:border-putih/10 text-navy dark:text-putih rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="all">Semua Kabupaten/Kota</option>
              {provinsi !== "all" && PROVINSI_KOTA_DATA[provinsi]?.map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>

            <button 
              onClick={() => {
                window.location.href = `/api/analytics/export?wilayah=${wilayahParam}`;
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-light transition-colors"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-putih/5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-navy/60 dark:text-putih/60">Total Kasus</p>
                <h3 className="text-3xl font-bold text-navy dark:text-putih mt-1">{data.kpi?.total_cases || 0}</h3>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-sm text-green-500 mt-4 flex items-center gap-1 font-medium">
              <TrendingUp className="w-4 h-4" /> +12% bulan ini
            </p>
          </div>

          <div className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-putih/5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-navy/60 dark:text-putih/60">Pidana Mayor</p>
                <h3 className="text-3xl font-bold text-navy dark:text-putih mt-1">
                  {data.distribution?.find((d: any) => d.name.toLowerCase() === 'pidana')?.value || 0}
                </h3>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <p className="text-sm text-red-500 mt-4 flex items-center gap-1 font-medium">
              <TrendingUp className="w-4 h-4" /> +5% bulan ini
            </p>
          </div>

          <div className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-putih/5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-navy/60 dark:text-putih/60">Severity &gt; 3 (Kritis)</p>
                <h3 className="text-3xl font-bold text-navy dark:text-putih mt-1">
                  {(data.severity?.[4] || 0) + (data.severity?.[5] || 0)}
                </h3>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-500/10 rounded-xl">
                <ShieldAlert className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <p className="text-sm text-navy/40 dark:text-putih/40 mt-4 font-medium">
              Membutuhkan penanganan segera
            </p>
          </div>

          <div className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-putih/5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-navy/60 dark:text-putih/60">Kategori Tertinggi</p>
                <h3 className="text-xl sm:text-2xl font-bold text-navy dark:text-putih mt-1 capitalize truncate max-w-[140px]" title={
                  data.distribution?.length > 0 
                    ? data.distribution.reduce((p: any, c: any) => p.value > c.value ? p : c).name 
                    : 'Belum Ada'
                }>
                  {data.distribution?.length > 0 
                    ? data.distribution.reduce((p: any, c: any) => p.value > c.value ? p : c).name 
                    : 'Belum Ada'}
                </h3>
              </div>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                <Scale className="w-6 h-6 text-indigo-500" />
              </div>
            </div>
            <p className="text-sm text-indigo-500 mt-4 flex items-center gap-1 font-medium">
              <TrendingUp className="w-4 h-4" /> 
              {data.distribution?.length > 0 
                ? `${data.distribution.reduce((p: any, c: any) => p.value > c.value ? p : c).value} kasus` 
                : '0 kasus'}
            </p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-putih/5">
            <h3 className="text-lg font-bold text-navy dark:text-putih mb-6">Tren Kasus (6 Bulan Terakhir)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends?.timeline || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="cases" stroke="#a16207" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-putih/5">
            <h3 className="text-lg font-bold text-navy dark:text-putih mb-6">Distribusi Kategori Kasus</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.distribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(data.distribution || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-navy-light rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-putih/5">
            <h3 className="text-lg font-bold text-navy dark:text-putih mb-6">Distribusi Severity (Tingkat Keparahan)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="level" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="cases" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={
                        index >= 3 ? '#ef4444' : (index >= 2 ? '#f59e0b' : '#3b82f6')
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Data Table */}
          <div className="bg-white dark:bg-navy-light rounded-2xl shadow-sm border border-slate-100 dark:border-putih/5 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-putih/10">
              <h3 className="text-lg font-bold text-navy dark:text-putih">Data Kasus Terbaru (Anonim)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-navy dark:text-putih/80">
                <thead className="bg-slate-50 dark:bg-navy-light/50 border-b border-slate-100 dark:border-putih/10">
                  <tr>
                    <th className="px-6 py-3 font-medium">Tanggal</th>
                    <th className="px-6 py-3 font-medium">Kategori</th>
                    <th className="px-6 py-3 font-medium">Severity</th>
                    <th className="px-6 py-3 font-medium">Wilayah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-putih/10">
                  {(data.rawData || []).slice(0, 10).map((row: any, idx: number) => (
                    <tr 
                      key={idx} 
                      onClick={() => setSelectedCase(row)}
                      className="hover:bg-slate-50 dark:hover:bg-putih/5 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4">{new Date(row.created_at).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-putih/10 text-navy dark:text-putih">
                          {row.case_type} - {row.sub_category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          row.severity_level >= 4 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                          row.severity_level >= 3 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                          Level {row.severity_level}
                        </span>
                      </td>
                      <td className="px-6 py-4">{row.wilayah_kabupaten}</td>
                    </tr>
                  ))}
                  {(!data.rawData || data.rawData.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-navy/50 dark:text-putih/50">
                        Belum ada data tersedia di wilayah ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Case Detail Modal */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm"
            onClick={() => setSelectedCase(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-navy-light w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-putih/10 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-putih/10 bg-slate-50 dark:bg-navy-light/50">
                <div className="flex items-center gap-3">
                  <div className="bg-gold/10 p-2 rounded-lg">
                    <UserX className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-navy dark:text-putih leading-tight">Detail Kasus (Anonim)</h3>
                    <p className="text-xs text-navy/60 dark:text-putih/50">ID: {selectedCase.id.substring(0, 8).toUpperCase()}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCase(null)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-putih/10 rounded-full transition-colors text-navy/60 dark:text-putih/60 hover:text-navy dark:hover:text-putih"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-putih/5 border border-slate-100 dark:border-putih/5">
                    <Scale className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-navy/60 dark:text-putih/50 mb-1">Kategori</p>
                      <p className="text-sm font-semibold text-navy dark:text-putih capitalize">{selectedCase.case_type}</p>
                      <p className="text-xs text-navy/80 dark:text-putih/80 capitalize">{selectedCase.sub_category}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-putih/5 border border-slate-100 dark:border-putih/5">
                    <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-navy/60 dark:text-putih/50 mb-1">Severity & Urgensi</p>
                      <p className="text-sm font-semibold text-navy dark:text-putih">Level {selectedCase.severity_level}</p>
                      <p className="text-xs text-navy/80 dark:text-putih/80 capitalize">{selectedCase.urgency_level || 'Normal'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-putih/5 border border-slate-100 dark:border-putih/5">
                    <MapPin className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-navy/60 dark:text-putih/50 mb-1">Wilayah</p>
                      <p className="text-sm font-semibold text-navy dark:text-putih">{selectedCase.wilayah_kabupaten}</p>
                      <p className="text-xs text-navy/80 dark:text-putih/80">{selectedCase.wilayah_provinsi}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-putih/5 border border-slate-100 dark:border-putih/5">
                    <Calendar className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-navy/60 dark:text-putih/50 mb-1">Tanggal Konsultasi</p>
                      <p className="text-sm font-semibold text-navy dark:text-putih">{new Date(selectedCase.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-gold" />
                    <h4 className="font-bold text-navy dark:text-putih">Ringkasan Kronologi Kasus</h4>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-putih/5 border border-slate-200 dark:border-putih/10 text-sm text-navy/80 dark:text-putih/80 leading-relaxed whitespace-pre-wrap">
                    {selectedCase.summary ? selectedCase.summary : <span className="italic text-navy/50 dark:text-putih/50">Ringkasan kronologi tidak tersedia untuk kasus lama. Sistem baru akan merekam ringkasan tanpa identitas.</span>}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-gold" />
                    <h4 className="font-bold text-navy dark:text-putih">Saran Hukum AI Awal</h4>
                  </div>
                  <div className="p-4 rounded-xl bg-gold/5 border border-gold/20 text-sm text-navy/80 dark:text-putih/90 leading-relaxed whitespace-pre-wrap mb-6">
                    {selectedCase.recommendation ? selectedCase.recommendation : <span className="italic text-navy/50 dark:text-putih/50">Saran hukum tidak tersedia untuk kasus lama.</span>}
                  </div>
                </div>

                {/* Real-time Chat History Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-gold" />
                      <h4 className="font-bold text-navy dark:text-putih">Riwayat Percakapan Real-time</h4>
                    </div>
                    <span className="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded border border-red-500/20 font-medium">Akses Rahasia Negara (Raw Data)</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-putih/5 border border-slate-200 dark:border-putih/10">
                    {isLoadingChat ? (
                      <div className="text-center py-4 text-navy/50 dark:text-putih/50 text-sm">Mengambil riwayat percakapan...</div>
                    ) : chatMessages.length > 0 ? (
                      <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {chatMessages.map((msg: any, idx: number) => (
                          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <span className="text-[10px] text-navy/40 dark:text-putih/40 mb-1 ml-1">{msg.role === 'user' ? 'Warga (Pelapor)' : 'KonsultanAI'}</span>
                            <div className={`p-3 rounded-xl text-sm max-w-[90%] whitespace-pre-wrap ${msg.role === 'user' ? 'bg-navy text-white' : 'bg-white dark:bg-navy-light text-navy dark:text-putih border border-slate-200 dark:border-putih/10'}`}>
                              {msg.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 italic text-navy/50 dark:text-putih/50 text-sm">
                        {selectedCase.case_id ? "Belum ada riwayat percakapan lanjutan." : "Data ini tidak memiliki tautan riwayat percakapan karena dibuat sebelum pembaruan sistem."}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-putih/10 bg-slate-50 dark:bg-navy-light/50 flex justify-end">
                <button 
                  onClick={() => setSelectedCase(null)}
                  className="px-6 py-2 bg-slate-200 dark:bg-putih/10 hover:bg-slate-300 dark:hover:bg-putih/20 text-navy dark:text-putih rounded-lg font-medium transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
