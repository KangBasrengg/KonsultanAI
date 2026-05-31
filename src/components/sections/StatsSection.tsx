"use client";

import { motion } from "framer-motion";

export default function StatsSection() {
  const stats = [
    { value: "10.000+", label: "Pengguna Aktif" },
    { value: "85%", label: "Akurasi Analisis" },
    { value: "< 10s", label: "Waktu Respon" },
    { value: "100+", label: "Pasal KUHP" },
  ];

  return (
    <section className="py-12 border-y border-putih/10 bg-navy-dark/50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-putih/10">
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
