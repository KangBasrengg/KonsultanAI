"use client";

import { motion } from "framer-motion";
import { Edit3, Cpu, FileText, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Edit3 className="w-8 h-8" />,
      title: "Ceritakan Kronologi",
      desc: "Tuliskan kejadian, waktu, dan pihak yang terlibat dengan bahasa sehari-hari Anda."
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "AI Menganalisis",
      desc: "Teknologi NLP kami mengidentifikasi bidang hukum yang relevan dan mencocokkannya dengan pasal-pasal dari undang-undang terkait."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Terima Laporan",
      desc: "Dapatkan penjelasan hukum sederhana, pasal terkait, dan delik perkara."
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Ambil Tindakan",
      desc: "Gunakan hasil analisis sebagai langkah awal untuk penyelesaian masalah Anda."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="cara-kerja" className="py-24 relative">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-putih">Cara Kerja <span className="text-gold">AI</span></h2>
          <p className="text-putih/60 text-sm md:text-base">Hanya butuh 4 langkah mudah untuk memahami posisi hukum Anda tanpa perlu menggunakan istilah yang rumit.</p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 relative"
        >
          {/* Connector Line */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-navy via-gold/50 to-navy z-0"></div>

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-navy-light/40 border border-gold/20 flex items-center justify-center mb-5 text-gold group-hover:scale-110 group-hover:bg-gold group-hover:text-navy transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-putih">{step.title}</h3>
              <p className="text-putih/60 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
