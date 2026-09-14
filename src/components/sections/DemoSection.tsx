"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, Scale, FileText, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";

const HIDDEN = { opacity: 0, scale: 0.85, y: 10 };
const SHOWN = { opacity: 1, scale: 1, y: 0 };

const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 450,
  damping: 28,
  mass: 1,
} as const;

function TypingBubble() {
  return (
    <div className="inline-flex items-center gap-1.5 px-4 py-3 bg-gold/10 border border-gold/20 rounded-2xl rounded-tr-none shadow-sm">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-gold inline-block"
          animate={{
            y: [0, -5, 0],
            opacity: [0.35, 1, 0.35],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.18,
          }}
        />
      ))}
    </div>
  );
}

export default function DemoSection() {
  const [phase, setPhase] = useState<"user" | "typing" | "response">("user");
  const [customInput, setCustomInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const startSimulation = useCallback(() => {
    setPhase("user");
    const t1 = setTimeout(() => {
      setPhase("typing");
    }, 600);

    const t2 = setTimeout(() => {
      setPhase("response");
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const cleanup = startSimulation();
    return () => cleanup();
  }, [startSimulation]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [phase]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phase === "typing") return;
    startSimulation();
  };

  return (
    <section className="py-20 relative overflow-hidden border-t border-putih/10">
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
            Simulasi AI Real-time
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
              "Rekomendasi Tindakan Lanjutan Taktis",
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
          className="flex-1 w-full max-w-xl relative group"
        >
          {/* Subtle glow behind UI */}
          <div className="absolute -inset-1 bg-gradient-to-tr from-gold/0 via-gold/15 to-transparent rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <div className="relative bg-navy-dark/80 backdrop-blur-xl rounded-[2rem] border border-putih/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:border-gold/30 transition-colors duration-500 flex flex-col h-[540px] md:h-[580px]">
            {/* Header */}
            <div className="p-4 bg-navy-light/50 border-b border-putih/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-merah/80"></div>
                  <div className="w-3 h-3 rounded-full bg-gold/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-xs font-semibold tracking-wider uppercase text-putih/50 ml-1">
                  KonsultanAI Chat — Live Demo
                </span>
              </div>
              <button
                onClick={startSimulation}
                title="Putar Ulang Simulasi"
                className="flex items-center gap-1.5 text-[11px] font-medium text-gold/80 hover:text-gold bg-gold/10 hover:bg-gold/20 px-2.5 py-1 rounded-full border border-gold/30 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Simulasi Ulang</span>
              </button>
            </div>

            {/* Chat Body */}
            <div
              ref={chatContainerRef}
              className="flex-1 p-5 md:p-6 space-y-5 overflow-y-auto custom-scrollbar"
            >
              {/* User Message - Left Aligned (User icon on Left) */}
              <motion.div
                initial={HIDDEN}
                animate={SHOWN}
                transition={SPRING_TRANSITION}
                className="flex gap-3.5 justify-start items-start"
              >
                <div className="w-8 h-8 rounded-full bg-putih/5 border border-putih/10 flex items-center justify-center shrink-0 shadow-sm text-putih/60">
                  <User className="w-4 h-4" />
                </div>
                <div className="bg-putih/5 border border-putih/10 rounded-2xl rounded-tl-none p-4 text-xs md:text-sm text-putih/90 leading-relaxed shadow-inner max-w-[85%]">
                  "Tetangga saya sering membakar sampah di sebelah rumah sampai
                  asapnya masuk dan bikin sesak napas. Sudah ditegur tapi malah
                  marah."
                </div>
              </motion.div>

              {/* Typing Indicator - Right Aligned (AI on Right) */}
              <AnimatePresence>
                {phase === "typing" && (
                  <motion.div
                    key="typing-indicator"
                    initial={HIDDEN}
                    animate={SHOWN}
                    exit={{ opacity: 0, scale: 0.9, y: 5 }}
                    transition={SPRING_TRANSITION}
                    className="flex flex-row-reverse gap-3.5 items-center justify-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <TypingBubble />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI Response Cards - Right Aligned (Flex Row Reverse) */}
              <AnimatePresence>
                {phase === "response" && (
                  <motion.div
                    key="ai-response"
                    initial="hidden"
                    animate="shown"
                    variants={{
                      hidden: { opacity: 0 },
                      shown: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.12,
                        },
                      },
                    }}
                    className="flex flex-row-reverse gap-3.5 justify-start items-start"
                  >
                    <motion.div
                      variants={{
                        hidden: HIDDEN,
                        shown: { ...SHOWN, transition: SPRING_TRANSITION },
                      }}
                      className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-[0_0_10px_rgba(212,175,55,0.2)] mt-1"
                    >
                      <Bot className="w-4 h-4" />
                    </motion.div>

                    <div className="space-y-3.5 max-w-[88%]">
                      {/* Summary Badge & Text */}
                      <motion.div
                        variants={{
                          hidden: HIDDEN,
                          shown: { ...SHOWN, transition: SPRING_TRANSITION },
                        }}
                        className="bg-gold/10 border border-gold/20 rounded-2xl rounded-tr-none p-4 text-xs md:text-sm space-y-2 shadow-lg backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                          <span>Hasil Analisis Hukum Real-time</span>
                        </div>
                        <p className="text-putih/90 leading-relaxed text-xs md:text-sm">
                          Tindakan membakar sampah secara rutin di kawasan pemukiman dikategorikan sebagai <strong className="text-gold font-semibold">Pelanggaran Ketertiban Umum & Perlindungan Lingkungan Hidup</strong> (Dapat ditindak hukum).
                        </p>
                      </motion.div>

                      {/* Dasar Hukum Cards */}
                      <motion.div
                        variants={{
                          hidden: HIDDEN,
                          shown: { ...SHOWN, transition: SPRING_TRANSITION },
                        }}
                        className="bg-navy/80 border border-gold/20 rounded-xl p-3.5 space-y-2 shadow-md relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-gold"></div>
                        <div className="flex items-center gap-2 text-gold text-xs font-semibold">
                          <FileText className="w-3.5 h-3.5" />
                          <span>Dasar Hukum & Pasal Terkait</span>
                        </div>
                        <div className="space-y-1.5 pl-1 text-xs">
                          <div className="border-b border-putih/5 pb-1.5">
                            <span className="font-semibold text-putih">1. UU No. 18/2008 (Pengelolaan Sampah) - Pasal 29 ayat 1(g)</span>
                            <p className="text-putih/60 italic text-[11px] mt-0.5">
                              "Setiap orang dilarang membakar sampah yang tidak sesuai dengan persyaratan teknis..." (Sanksi pidana/denda).
                            </p>
                          </div>
                          <div>
                            <span className="font-semibold text-putih">2. Pasal 1365 KUHPerdata (PMH)</span>
                            <p className="text-putih/60 italic text-[11px] mt-0.5">
                              Hak korban menuntut ganti kerugian materiil/immateriil atas dampak polusi asap pada kesehatan.
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Rekomendasi Taktis Cards */}
                      <motion.div
                        variants={{
                          hidden: HIDDEN,
                          shown: { ...SHOWN, transition: SPRING_TRANSITION },
                        }}
                        className="bg-navy-light/60 border border-putih/10 rounded-xl p-3.5 space-y-2 text-xs shadow-md"
                      >
                        <div className="flex items-center gap-2 text-green-400 font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Rekomendasi Langkah Taktis</span>
                        </div>
                        <ol className="list-decimal list-inside space-y-1 text-putih/80 text-[11px] md:text-xs">
                          <li><strong>Dokumentasi Bukti:</strong> Ambil foto/video pembakaran & kepulan asap masuk rumah.</li>
                          <li><strong>Mediasi RT/RW:</strong> Ajukan pengaduan tertulis ke pengurus lingkungan.</li>
                          <li><strong>Lapor Satpol PP:</strong> Pelaporan atas pelanggaran Perda Ketertiban Umum daerah.</li>
                        </ol>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-navy-dark/90 border-t border-putih/5 shrink-0 backdrop-blur-md">
              <form onSubmit={handleCustomSubmit} className="relative group/input">
                <input
                  id="demo-chat-input"
                  name="demoChatInput"
                  aria-label="Ketik kronologi Anda"
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Ketik kronologi Anda atau klik Simulasi Ulang..."
                  className="w-full bg-navy border border-putih/10 rounded-full py-3.5 pl-5 pr-14 text-xs md:text-sm text-putih focus:outline-none focus:border-gold/50 transition-colors placeholder:text-putih/30"
                />
                <button
                  type="submit"
                  aria-label="Kirim Pesan"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gold flex items-center justify-center text-navy hover:bg-yellow-400 hover:scale-105 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300 cursor-pointer"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
