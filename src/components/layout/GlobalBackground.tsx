"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import globalBg from "@/components/images/BG.jpg";

export default function GlobalBackground() {
  const { scrollYProgress } = useScroll();
  
  // Scale dari 1 (awal) hingga 4 (zoom in dalam). 
  // Kita zoom lebih cepat, selesai zoom di 30% scroll (0.3).
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 4]);
  
  // Opacity perlahan menghilang setelah zoom, menyatu dengan warna navy solid.
  const opacity = useTransform(scrollYProgress, [0.2, 0.4], [1, 0]);

  return (
    <div className="fixed inset-0 w-full h-full -z-50 bg-navy overflow-hidden">
      <motion.div 
        style={{ 
          scale,
          opacity,
          // Titik fokus zoom (Transform Origin).
          // 45% dari kiri, 60% dari atas (Perkiraan area Laut Jawa / Kalimantan)
          transformOrigin: "50% 50%" 
        }}
        className="absolute inset-0 w-full h-full"
      >
        <Image 
          src={globalBg} 
          alt="KonsultanAI Background" 
          fill 
          className="object-cover" 
          priority
        />
        {/* Overlay tipis agar teks hero tetap terbaca */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
      </motion.div>
    </div>
  );
}
