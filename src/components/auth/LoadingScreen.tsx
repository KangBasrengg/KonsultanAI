"use client";

import { motion } from "framer-motion";
import { Scale } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-navy">
      {/* Background decorations */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-merah/5 blur-[120px] pointer-events-none" />

      <div className="flex flex-col items-center gap-8 relative z-10">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(212, 175, 55, 0.3)",
                "0 0 0 20px rgba(212, 175, 55, 0)",
                "0 0 0 0 rgba(212, 175, 55, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="bg-gold p-3 rounded-xl"
          >
            <Scale className="text-navy w-7 h-7" />
          </motion.div>
          <span className="font-bold text-3xl tracking-tight text-putih">
            Konsultan<span className="text-gold">AI</span>
          </span>
        </motion.div>

        {/* Loading spinner */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-putih/10 border-t-gold"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-1 rounded-full border-2 border-putih/5 border-b-gold/50"
            />
          </div>

          {/* Animated text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-putih/50 text-sm font-medium"
          >
            Memverifikasi sesi Anda...
          </motion.p>
        </div>

        {/* Bottom dots animation */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-1.5 h-1.5 rounded-full bg-gold"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
