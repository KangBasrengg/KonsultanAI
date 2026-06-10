"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function StatsSection() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Ambil data jumlah awal via RPC untuk bypass RLS (Row Level Security)
    const fetchCount = async () => {
      const { data, error } = await supabase.rpc("get_total_users_count");
        
      if (!error && data !== null) {
        setUserCount(data);
      } else {
        // Fallback jika belum deploy RPC
        const { count } = await supabase.from("users").select("*", { count: "exact", head: true });
        setUserCount(count || 0);
      }
    };

    fetchCount();

    // Subscribe untuk mendengarkan pendaftaran user baru secara realtime
    const channel = supabase.channel("public:users")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "users" }, () => {
        setUserCount((prev) => (prev !== null ? prev + 1 : 1));
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "users" }, () => {
        setUserCount((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const stats = [
    { value: userCount !== null ? `${userCount}` : "...", label: "Total Pengguna" },
    { value: "85%", label: "Akurasi Analisis" },
    { value: "< 10s", label: "Waktu Respon" },
    { value: "Semua", label: "Bidang Hukum" },
  ];

  return (
    <section className="py-12 border-y border-putih/20 bg-navy-dark/50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-putih/20">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-center px-4"
            >
              <div className="text-3xl md:text-4xl font-bold text-gold mb-2">{stat.value}</div>
              <div className="text-sm md:text-base text-putih/70 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

