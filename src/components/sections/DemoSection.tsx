"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Bot, Scale } from "lucide-react";

export default function DemoSection() {
  const [isTyping, setIsTyping] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const simulateDemo = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setShowResult(true);
    }, 2000);
  };

  return (
    <section className="py-24 bg-navy relative overflow-hidden border-t border-putih/5">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">Demo <span className="text-gold">Analisis Hukum</span></h2>
          <p className="text-putih/70 text-lg leading-relaxed">
            Lihat bagaimana AI kami bekerja secara real-time. Cukup tuliskan kronologi kejadian, dan AI akan mengidentifikasi bidang hukum yang relevan serta merekomendasikan pasal yang sesuai.
          </p>

          <ul className="space-y-4">
            {["Identifikasi Subjek & Objek Hukum", "Pemetaan Pasal Sesuai Bidang Hukum", "Rekomendasi Tindakan Lanjutan"].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                  <Scale className="w-3 h-3" />
                </div>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 w-full max-w-lg">
          <div className="bg-navy-light rounded-2xl border border-putih/10 overflow-hidden shadow-2xl">
            <div className="p-4 bg-navy-dark border-b border-putih/10 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-merah"></div>
                <div className="w-3 h-3 rounded-full bg-gold"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-sm font-medium text-putih/50">KonsultanAI Chat</span>
            </div>

            <div className="p-6 space-y-6 h-[400px] overflow-y-auto">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-putih/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="bg-navy border border-putih/10 rounded-2xl rounded-tl-none p-4 text-sm">
                  "Tetangga saya sering membakar sampah di sebelah rumah sampai asapnya masuk dan bikin sesak napas. Sudah ditegur tapi malah marah."
                </div>
              </div>

              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-gold/10 border border-gold/20 rounded-2xl rounded-tl-none p-4 text-sm flex gap-1 items-center">
                    <span className="w-2 h-2 rounded-full bg-gold animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    <span className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                  </div>
                </div>
              )}

              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-gold/10 border border-gold/20 rounded-2xl rounded-tl-none p-4 text-sm space-y-3">
                    <p className="font-semibold text-gold">Hasil Analisis Hukum:</p>
                    <p>Tindakan tersebut dapat dikategorikan sebagai gangguan (Hinder Ordonnantie) dan berpotensi melanggar ketentuan pidana.</p>
                    <div className="p-3 bg-navy rounded-lg border border-putih/5">
                      <span className="text-xs text-gold font-bold">Pasal 312 KUHP (Baru)</span>
                      <p className="mt-1 text-putih/80">"Setiap orang yang melakukan perbuatan yang mengakibatkan gangguan pada lingkungan..."</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="p-4 bg-navy border-t border-putih/10">
              <div className="relative">
                <input
                  type="text"
                  disabled={showResult}
                  placeholder="Ketik kronologi Anda..."
                  className="w-full bg-navy-light border border-putih/10 rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-gold"
                />
                <button
                  onClick={simulateDemo}
                  disabled={showResult || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gold flex items-center justify-center text-navy hover:scale-105 transition-transform disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
