"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell 
} from "recharts";
import { Download, Users, TrendingUp, AlertTriangle, ShieldAlert, Scale } from "lucide-react";

export default function AnalyticsDashboardPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wilayah, setWilayah] = useState("all");

  useEffect(() => {
    if (!user) return;
    
    // Check role access
    if (profile?.role !== "admin" && profile?.role !== "government" && profile?.role !== "enterprise") {
      router.push("/admin");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [dashRes, trendsRes] = await Promise.all([
          fetch(`/api/analytics/dashboard?wilayah=${wilayah}`),
          fetch(`/api/analytics/trends?wilayah=${wilayah}`)
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
    };

    fetchData();
  }, [user, profile, router, wilayah]);

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
            <h1 className="text-3xl font-bold text-navy dark:text-putih">Government Analytics Dashboard</h1>
            <p className="text-navy/60 dark:text-putih/60 mt-1">Intelligence & Insights for Legal Cases</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={wilayah}
              onChange={(e) => setWilayah(e.target.value)}
              className="bg-white dark:bg-navy-light border border-slate-200 dark:border-putih/10 text-navy dark:text-putih rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gold"
            >
              <option value="all">Semua Wilayah (Nasional)</option>
              {[
                "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Jambi", "Sumatera Selatan", "Bengkulu", "Lampung", "Kepulauan Bangka Belitung", "Kepulauan Riau",
                "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur", "Banten",
                "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur",
                "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara",
                "Sulawesi Utara", "Sulawesi Tengah", "Sulawesi Selatan", "Sulawesi Tenggara", "Gorontalo", "Sulawesi Barat",
                "Maluku", "Maluku Utara",
                "Papua", "Papua Barat", "Papua Selatan", "Papua Tengah", "Papua Pegunungan", "Papua Barat Daya"
              ].map(prov => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
            
            <button className="flex items-center gap-2 bg-gold text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-light transition-colors">
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
                  {(data.rawData || []).slice(0, 7).map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-putih/5">
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
    </main>
  );
}
