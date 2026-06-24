"use client";

import { motion } from "framer-motion";
import { ArrowLeft, PlayCircle, Award, BookOpen } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type MaterialData = {
  id: string;
  slug: string;
  title: string;
  content: string; // just to show excerpt maybe
  is_premium: boolean;
  required_tier: string;
};

type CategoryData = {
  id: string;
  name: string;
  description: string;
};

interface LearningCategoryClientProps {
  category: CategoryData;
  materials: MaterialData[];
}

export default function LearningCategoryClient({ category, materials }: LearningCategoryClientProps) {
  return (
    <main className="min-h-screen selection:bg-gold/30">
      <Navbar />
      
      {/* Header Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-navy-dark">
        {/* Removed noise.png to prevent 404 */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gold/10 blur-[120px] rounded-full pointer-events-none translate-x-1/3"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <Link href="/learning" className="inline-flex items-center gap-2 text-putih/60 hover:text-gold transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
          </Link>

          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-putih/5 border border-putih/10 mb-6"
            >
              <BookOpen className="w-4 h-4 text-gold" />
              <span className="text-sm font-semibold text-putih">Kategori Pembelajaran</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              {category.name}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-putih/70 max-w-2xl"
            >
              {category.description}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Materials List */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-2">Daftar Materi ({materials.length})</h2>
            <p className="text-putih/50">Mulai dari dasar hingga tingkat lanjut.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {materials.length > 0 ? materials.map((material, idx) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-navy-light border border-putih/10 rounded-3xl overflow-hidden group hover:border-gold/50 transition-colors flex flex-col"
              >
                <div className="h-40 bg-gradient-to-br from-navy to-navy-dark relative flex items-center justify-center shrink-0 border-b border-putih/5">
                  <PlayCircle className="w-12 h-12 text-putih/30 group-hover:text-gold transition-colors z-20" />
                  {material.is_premium && (
                    <div className="absolute top-4 left-4 z-20 bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <Award className="w-3 h-3" /> {material.required_tier.toUpperCase()}
                    </div>
                  )}
                  {!material.is_premium && (
                    <div className="absolute top-4 left-4 z-20 bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-3 py-1 rounded-full">
                      GRATIS
                    </div>
                  )}
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-gold transition-colors line-clamp-2">
                    {material.title}
                  </h3>
                  <p className="text-putih/50 text-sm mb-6 line-clamp-3">
                    {material.content}
                  </p>
                  
                  <div className="mt-auto">
                    <Link href={`/learning/material/${material.slug}`} className="w-full">
                      <button className="w-full py-3 rounded-xl font-bold transition-all bg-putih/5 text-putih hover:bg-gold hover:text-navy border border-putih/10 group-hover:border-gold/50">
                        Mulai Belajar
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full py-12 text-center text-putih/50 bg-putih/5 rounded-3xl border border-putih/10">
                Belum ada materi untuk kategori ini.
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
