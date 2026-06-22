"use client";

import { motion } from "framer-motion";
import { BookOpen, Shield, Scale, Briefcase, Monitor, Award, Search, ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import React from "react";

// Tipe data untuk properti yang dikirim dari Server Component
export type CategoryData = {
  id: string;
  slug: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  border: string;
  topics: number;
};

export type CourseData = {
  id: string;
  slug: string;
  title: string;
  category: string;
  duration: string;
  premium: boolean;
  image: string;
};

interface LearningCenterClientProps {
  categories: CategoryData[];
  featuredCourses: CourseData[];
}

export default function LearningCenterClient({ categories, featuredCourses }: LearningCenterClientProps) {
  return (
    <main className="min-h-screen selection:bg-gold/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gold/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-light border border-gold/30 mb-8 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
            >
              <BookOpen className="w-4 h-4 text-gold" />
              <span className="text-sm font-semibold text-putih">Legal Learning Center</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Pahami Hukum dengan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold">Bahasa yang Sederhana</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-putih/70 mb-10 max-w-2xl mx-auto"
            >
              Tingkatkan literasi hukum Anda sesuai kebutuhan. Jelajahi berbagai kategori, pelajari kasus nyata, dan lindungi hak-hak Anda tanpa kebingungan.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative max-w-xl mx-auto"
            >
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-putih/40" />
              </div>
              <input 
                type="text" 
                placeholder="Cari materi, pasal, atau kasus..." 
                className="w-full bg-navy-light/50 border border-putih/20 text-putih rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Explore Categories */}
      <section className="py-20 bg-navy-dark/50 border-t border-white/5 relative z-10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Pilih <span className="text-gold">Fokus Belajar</span> Anda</h2>
              <p className="text-putih/60 text-lg max-w-2xl">Materi hukum disusun rapi berdasarkan kategori untuk memudahkan Anda menemukan apa yang sedang Anda cari.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-medium">
              Lihat Semua Kategori <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link href={`/learning/category/${cat.slug}`} key={cat.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className={`bg-gradient-to-br ${cat.color} backdrop-blur-sm border ${cat.border} rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 group cursor-pointer relative overflow-hidden h-full flex flex-col`}
                >
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-150 duration-500 origin-bottom-left">
                    {cat.icon}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-navy/50 flex items-center justify-center mb-6 border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{cat.title}</h3>
                  <p className="text-putih/60 text-sm mb-6 leading-relaxed line-clamp-3">
                    {cat.desc}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-semibold text-putih/50 bg-navy/40 px-3 py-1.5 rounded-full">
                      {cat.topics} Topik
                    </span>
                    <div className="w-8 h-8 rounded-full bg-putih/10 flex items-center justify-center group-hover:bg-gold group-hover:text-navy transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
          
          <button className="md:hidden w-full mt-8 flex justify-center items-center gap-2 text-gold hover:text-gold-light border border-gold/30 rounded-xl py-4 transition-colors font-medium">
            Lihat Semua Kategori <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Materi <span className="text-gold">Populer</span></h2>
            <p className="text-putih/60 text-lg max-w-2xl mx-auto">Materi yang paling banyak dipelajari oleh pengguna kami minggu ini.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredCourses.length > 0 ? featuredCourses.map((course, idx) => (
              <motion.div
                key={course.id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-navy-light border border-putih/10 rounded-3xl overflow-hidden group hover:border-gold/50 transition-colors flex flex-col"
              >
                <div className={`h-48 ${course.image} relative flex items-center justify-center overflow-hidden shrink-0`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                  <PlayCircle className="w-16 h-16 text-putih/50 group-hover:text-gold group-hover:scale-110 transition-all z-20" />
                  {course.premium && (
                    <div className="absolute top-4 left-4 z-20 bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <Award className="w-3 h-3" /> Premium
                    </div>
                  )}
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-semibold text-putih/50 bg-putih/5 px-3 py-1 rounded-full border border-putih/10">
                      {course.category}
                    </span>
                    <span className="text-xs text-putih/40 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                      {course.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-gold transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="mt-auto">
                    <Link href={`/learning/material/${course.slug}`} className="w-full">
                      <button className="w-full py-3 rounded-xl font-bold transition-all bg-putih/5 text-putih hover:bg-gold hover:text-navy mt-4 border border-putih/10 group-hover:border-gold/50">
                        Mulai Belajar
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-12 text-putih/50">
                Belum ada materi populer.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="bg-gradient-to-br from-gold/20 to-navy-light border border-gold/30 rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-putih relative z-10">Siap Menjadi Lebih <span className="text-gold">Melek Hukum?</span></h2>
            <p className="text-lg text-putih/80 mb-10 max-w-2xl mx-auto relative z-10">Akses seluruh materi hukum secara tidak terbatas, dapatkan sertifikat penyelesaian, dan kuasai dasar-dasar legalitas sekarang.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link href="/#harga">
                <button className="w-full sm:w-auto px-8 py-4 bg-gold text-navy rounded-full font-bold hover:bg-gold-light transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                  Upgrade ke Premium
                </button>
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-navy text-putih border border-white/20 rounded-full font-bold hover:bg-putih/10 transition-colors">
                Mulai dari Gratis
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
