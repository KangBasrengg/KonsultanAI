"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
    <section
      className="py-20 relative overflow-hidden border-t border-putih/10"
    >
      {/* Dynamic Background Glow for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/60 to-transparent z-0 pointer-events-none"></div>

      {/* Decorative Light Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-gold/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 relative z-10">
        {/* LEFT COLUMN: TEXT */}
        <div className="flex-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] sm:text-xs font-semibold uppercase tracking-widest"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
            Simulasi AI
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl lg:text-4xl font-bold text-putih leading-tight"
          >
            Sistem Analisis Hukum <br />
            <span className="text-gold font-light italic">
              Secara Real-time
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-putih/60 text-sm md:text-base leading-relaxed max-w-lg"
          >
            Uji kecerdasan buatan kami. Ketikkan kronologi kejadian apa saja,
            dan AI akan langsung memetakan undang-undang yang relevan serta
            memberikan rekomendasi tindakan taktis.
          </motion.p>

          <ul className="space-y-4 pt-2">
            {[
              "Identifikasi Subjek & Objek Hukum",
              "Pemetaan Pasal Sesuai Bidang Hukum",
              "Rekomendasi Tindakan Lanjutan",
            ].map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                className="flex items-center gap-4 group cursor-default"
              >
                <div className="w-8 h-8 rounded-full bg-navy border border-putih/10 flex items-center justify-center text-putih/50 group-hover:bg-gold group-hover:border-gold group-hover:text-navy transition-all duration-300 shadow-[0_0_0_rgba(212,175,55,0)] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                  <Scale className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-putih/70 group-hover:text-putih transition-colors duration-300">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE CHAT UI */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex-1 w-full max-w-lg relative group"
        >
          {/* Subtle glow behind the UI (Muncul saat hover) */}
          <div className="absolute -inset-1 bg-gradient-to-tr from-gold/0 via-gold/10 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <div className="relative bg-navy-dark/70 backdrop-blur-xl rounded-[2rem] border border-putih/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:border-gold/30 transition-colors duration-500 flex flex-col h-[500px]">
            {/* Header */}
            <div className="p-4 bg-navy-light/50 border-b border-putih/5 flex items-center gap-3 shrink-0">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-merah/80"></div>
                <div className="w-3 h-3 rounded-full bg-gold/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className="text-xs font-semibold tracking-wider uppercase text-putih/40 ml-2">
                KonsultanAI Chat
              </span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
              {/* User Message */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-putih/5 border border-putih/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-putih/50" />
                </div>
                <div className="bg-putih/5 border border-putih/10 rounded-2xl rounded-tl-none p-4 text-sm text-putih/90 leading-relaxed shadow-inner">
                  "Tetangga saya sering membakar sampah di sebelah rumah sampai
                  asapnya masuk dan bikin sesak napas. Sudah ditegur tapi malah
                  marah."
                </div>
              </motion.div>

              {/* AI Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-gold/5 border border-gold/10 rounded-2xl rounded-tl-none p-4 text-sm flex gap-1 items-center">
                    <span className="w-2 h-2 rounded-full bg-gold/60 animate-bounce"></span>
                    <span
                      className="w-2 h-2 rounded-full bg-gold/60 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                    <span
                      className="w-2 h-2 rounded-full bg-gold/60 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></span>
                  </div>
                </motion.div>
              )}

              {/* AI Response */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-gold/10 border border-gold/20 rounded-2xl rounded-tl-none p-4 text-sm space-y-4 shadow-lg backdrop-blur-sm">
                    <div>
                      <p className="font-bold text-gold text-xs uppercase tracking-wider mb-1">
                        Hasil Analisis:
                      </p>
                      <p className="text-putih/90 leading-relaxed">
                        Tindakan tersebut dikategorikan sebagai gangguan (Hinder
                        Ordonnantie) dan berpotensi pidana.
                      </p>
                    </div>
                    <div className="p-3 bg-navy/80 rounded-xl border border-gold/20 relative overflow-hidden group/card">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gold"></div>
                      <span className="text-xs text-gold font-bold block mb-1">
                        Pasal 312 KUHP Baru
                      </span>
                      <p className="text-putih/70 text-xs italic">
                        "Setiap orang yang melakukan perbuatan yang
                        mengakibatkan gangguan pada lingkungan..."
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-navy-dark/80 border-t border-putih/5 shrink-0 backdrop-blur-md">
              <div className="relative group/input">
                <input
                  id="demo-chat-input"
                  name="demoChatInput"
                  aria-label="Ketik kronologi Anda"
                  type="text"
                  disabled={showResult}
                  placeholder="Ketik kronologi Anda..."
                  className="w-full bg-navy border border-putih/10 rounded-full py-3.5 pl-5 pr-14 text-sm text-putih focus:outline-none focus:border-gold/50 transition-colors disabled:opacity-50 placeholder:text-putih/30"
                />
                <button
                  aria-label="Kirim Pesan"
                  onClick={simulateDemo}
                  disabled={showResult || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gold flex items-center justify-center text-navy hover:bg-yellow-400 hover:scale-105 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
