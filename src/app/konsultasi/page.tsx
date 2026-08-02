"use client";

import { useRef, useEffect, useState } from "react";
import { Send, ArrowLeft, Bot, User, FileText, Download, AlertCircle, Lock, Crown, X, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useChat, type UIMessage } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { memo } from "react";

const MemoizedMarkdown = memo(
  ({ children }: { children: string }) => <ReactMarkdown>{children}</ReactMarkdown>,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

import { exportConsultationPDF } from "@/lib/pdf-export";
import UserDropdown from "@/components/konsultasi/UserDropdown";
import HistoryPanel from "@/components/konsultasi/HistoryPanel";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingScreen from "@/components/auth/LoadingScreen";
import LimitModal from "@/components/ui/LimitModal";
import { motion, AnimatePresence } from "framer-motion";

// Helper: extract visible text from a message's parts array (AI SDK v3/v6 format)
function getMessageText(msg: any): string {
  if (Array.isArray(msg.parts)) {
    return msg.parts
      .filter((p: any) => p.type === "text")
      .map((p: any) => p.text)
      .join("");
  }
  if (typeof msg.content === "string") return msg.content;
  return "";
}

function KonsultasiContent() {
  const [initialMessages] = useState<UIMessage[]>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("konsultasi_chat_messages");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {
          console.error("Failed to parse saved messages", e);
        }
      }
    }
    return [
      {
        id: "welcome-msg",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Halo! Saya KonsultanAI, asisten hukum Anda. Silakan ceritakan kronologi kejadian yang Anda alami, dan saya akan membantu menganalisis aspek hukumnya serta merekomendasikan pasal-pasal yang relevan."
          }
        ]
      }
    ] as UIMessage[];
  });

  const [apiModel, setApiModel] = useState<'freemodel' | 'gemini'>('freemodel');
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId");

  const { messages, setMessages, sendMessage, status, error } = useChat({
    messages: initialMessages,
    // @ts-ignore - ai-sdk react typing doesn't include body in some versions but it works
    body: {
      caseId: caseId
    },
    onError: (err) => {
      console.error("[Konsultasi] useChat error:", err.message);
    },
    onFinish: () => {
      refreshProfile();
    }
  });

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("konsultasi_chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  const [input, setInput] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showPdfOptionsModal, setShowPdfOptionsModal] = useState<{isOpen: boolean, isClean: boolean}>({isOpen: false, isClean: false});
  const [showHomeConfirm, setShowHomeConfirm] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "streaming" || status === "submitted";
  const { isVerifying, user, profile, refreshProfile } = useAuth();
  const router = useRouter();

  const isPremium = profile?.isPremium || profile?.role === "admin";

  // Redirect if not authenticated
  useEffect(() => {
    if (!isVerifying && !user) {
      router.replace("/?login=true");
    }
  }, [isVerifying, user, router]);

  // Auto-send kronologi from intake form (if arriving from /intake)
  const hasAutoSent = useRef(false);
  useEffect(() => {
    if (!user || isVerifying || hasAutoSent.current || isLoading) return;
    
    try {
      const kronologi = sessionStorage.getItem('intake_kronologi');
      const caseType = sessionStorage.getItem('intake_case_type');
      const sudahAdvokat = sessionStorage.getItem('intake_sudah_advokat');
      const sudahLaporPolisi = sessionStorage.getItem('intake_sudah_lapor_polisi');
      
      if (kronologi) {
        hasAutoSent.current = true;
        // Clear storage immediately so it doesn't re-trigger
        sessionStorage.removeItem('intake_kronologi');
        sessionStorage.removeItem('intake_case_type');
        sessionStorage.removeItem('intake_sudah_advokat');
        sessionStorage.removeItem('intake_sudah_lapor_polisi');
        
        // Build context-rich prompt from intake data
        let autoPrompt = caseType 
          ? `[Kasus: ${caseType}]\n\nKronologi:\n${kronologi}`
          : kronologi;

        // Add advokat/polisi context
        const contextParts: string[] = [];
        if (sudahAdvokat === 'tidak') {
          contextParts.push('Saya belum memiliki advokat/pengacara.');
        }
        if (sudahLaporPolisi === 'tidak') {
          contextParts.push('Saya belum melapor ke polisi.');
        }
        if (contextParts.length > 0) {
          autoPrompt += `\n\nInformasi tambahan: ${contextParts.join(' ')}`;
        }

        autoPrompt += `\n\nTolong analisis aspek hukum dari kronologi kasus saya di atas, serta rekomendasikan pasal-pasal yang relevan dan langkah hukum yang dapat saya tempuh.`;

        // If user doesn't have an advocate, ask AI to explain how to get one
        if (sudahAdvokat === 'tidak') {
          autoPrompt += ` Sertakan juga panduan lengkap cara mendapatkan advokat/pengacara.`;
        }
        // If user hasn't reported to police, ask AI to explain the process
        if (sudahLaporPolisi === 'tidak') {
          autoPrompt += ` Sertakan juga tata cara dan prosedur melapor ke polisi.`;
        }
        
        sendMessage({ text: autoPrompt }).catch((err) => {
          console.error("[Konsultasi] Auto-send from intake failed:", err);
        });
      }
    } catch (e) {
      // sessionStorage might not be available in some contexts
      console.warn("[Konsultasi] Failed to read intake data:", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isVerifying]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    try {
      await sendMessage({ text: userMessage });
    } catch (e) {
      // The error is already handled by useChat's onError, but we catch it here to prevent Unhandled Promise Rejection
      console.warn("sendMessage caught error:", e);
    }
  };

  const handleRetry = async () => {
    const reversed = [...messages].reverse();
    const lastUserIndexReversed = reversed.findIndex(m => m.role === "user");
    if (lastUserIndexReversed !== -1) {
      const actualIndex = messages.length - 1 - lastUserIndexReversed;
      const lastUserMsg = messages[actualIndex];
      const text = getMessageText(lastUserMsg);
      setMessages(messages.slice(0, actualIndex));
      try {
        await sendMessage({ text });
      } catch (e) {
        console.warn("retry caught error:", e);
      }
    }
  };

  // Continue an incomplete/truncated AI response
  const handleContinue = async () => {
    try {
      await sendMessage({ text: "Lanjutkan jawaban Anda yang sebelumnya terpotong. Langsung lanjutkan dari bagian terakhir tanpa mengulang." });
    } catch (e) {
      console.warn("continue caught error:", e);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExportPDF = (isClean: boolean) => {
    // Only export if there is actual conversation
    if (messages.length <= 1) return alert("Belum ada percakapan untuk diekspor.");
    exportConsultationPDF(messages as any, !isClean, 'gemini');
  };

  const executeExportPDF = (modelChoice: 'freemodel' | 'gemini') => {
    // This is no longer used, but kept to prevent reference errors if any button still calls it
    setShowPdfOptionsModal({ isOpen: false, isClean: false });
    exportConsultationPDF(messages as any, !showPdfOptionsModal.isClean, 'gemini');
  };

  // Detect if the last AI message appears truncated
  const isLastResponseTruncated = (() => {
    if (isLoading) return false;
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== "assistant") return false;
    const text = getMessageText(lastMsg);
    if (!text || text.length < 200) return false;
    
    // Check for signs of truncation: ends mid-sentence, no proper ending section
    const trimmed = text.trim();
    const endsWithPunctuation = /[.!?。:：\n]$/.test(trimmed);
    const hasClosingSection = /##\s*(Langkah|Kesimpulan|Penutup|Rekomendasi|Saran)/i.test(trimmed);
    const endsAbruptly = !endsWithPunctuation && trimmed.length > 500;
    const lastChar = trimmed.slice(-1);
    const midSentenceEnd = /[,;—\-]$/.test(lastChar);
    
    return endsAbruptly || (midSentenceEnd && !hasClosingSection && trimmed.length > 800);
  })();

  if (isVerifying || !user) {
    return (
      <div className="min-h-screen flex flex-col h-screen overflow-hidden bg-navy">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-putih/20 border-t-gold animate-spin" />
              <div className="absolute inset-2 rounded-full border-2 border-putih/10 border-b-gold/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
            <p className="text-putih/50 text-sm animate-pulse">Mempersiapkan konsultasi...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-navy-dark border-b border-putih/20 py-4 px-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-10 h-10 rounded-full bg-navy-light flex items-center justify-center hover:bg-putih/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-putih" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-navy-light border border-putih/20 rounded-xl shadow-md overflow-hidden">
              <Image src="/images/logo-128.webp" alt="KonsultanAI Logo" fill sizes="40px" className="object-cover" />
            </div>
            <div className="hidden md:block">
              <h1 className="font-bold text-lg leading-tight text-putih">KonsultanAI</h1>
              <p className="text-xs text-putih/50 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            type="button" 
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-2 text-sm bg-navy-light border border-putih/20 px-4 py-2 rounded-lg hover:bg-putih/10 transition-colors text-putih"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden md:inline">Riwayat</span>
          </button>
          
          {!isPremium ? (
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => handleExportPDF(false)}
                className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-colors bg-gold/10 text-gold hover:bg-gold/20 border border-gold/30"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">PDF (Watermark)</span>
              </button>
              <button 
                type="button" 
                onClick={() => setShowUpgradeModal(true)}
                className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-colors bg-putih/5 text-putih/50 hover:bg-putih/10 border border-putih/10"
              >
                <Lock className="w-3 h-3" />
                <span className="hidden md:inline">PDF (Clean)</span>
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              onClick={() => handleExportPDF(true)}
              className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-lg transition-colors bg-gold text-navy hover:bg-gold-light"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Export PDF</span>
            </button>
          )}
          
          <div className="ml-2 pl-2 border-l border-putih/20">
            <UserDropdown />
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center my-6">
            <span className="bg-navy-light border border-putih/20 text-putih/50 text-xs px-3 py-1 rounded-full">
              {isPremium 
                ? "Sesi Konsultasi (Premium)" 
                : `Sesi Konsultasi (Free Trial — ${profile?.consultationCount ?? 0}/3 generate)`}
            </span>
          </div>

          {messages.map((msg) => {
            const text = getMessageText(msg);
            const isThinking = msg.role === "assistant" && !text && isLoading;

            return (
              <div 
                key={msg.id} 
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "assistant" ? "bg-gold/20 text-gold" : "bg-putih/10 text-putih"
                }`}>
                  {msg.role === "assistant" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                
                <div className={`group/msg max-w-[85%] md:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-navy-light border border-putih/20 rounded-tr-none text-putih whitespace-pre-wrap" 
                    : "bg-gold/10 border border-gold/20 rounded-tl-none text-putih prose dark:prose-invert prose-sm prose-p:leading-relaxed prose-pre:bg-navy-dark max-w-none"
                }`}>
                  {msg.role === "assistant" ? (
                    isThinking ? (
                      <div className="flex items-center gap-2 text-gold/70 italic">
                        <span className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-gold/70 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-1.5 h-1.5 bg-gold/70 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-1.5 h-1.5 bg-gold/70 rounded-full animate-bounce"></span>
                        </span>
                        AI sedang berpikir...
                      </div>
                    ) : (
                      <div className="relative">
                        <MemoizedMarkdown>{text}</MemoizedMarkdown>
                        {text && (
                          <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gold/10 opacity-0 group-hover/msg:opacity-100 transition-opacity">
                            <button 
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(text);
                                // Optional: simple toast or alert
                              }}
                              title="Salin Teks"
                              className="flex items-center gap-1.5 text-[11px] font-medium text-gold/70 hover:text-gold bg-gold/5 hover:bg-gold/10 px-2.5 py-1 rounded-md transition-colors"
                            >
                              📋 Copy
                            </button>
                            <button 
                              type="button"
                              onClick={() => setInput("Tolong jelaskan ulang jawaban di atas menggunakan bahasa yang jauh lebih sederhana, ringkas, dan mudah dipahami oleh orang awam yang tidak mengerti hukum sama sekali.")}
                              title="Jelaskan Sederhana"
                              className="flex items-center gap-1.5 text-[11px] font-medium text-gold/70 hover:text-gold bg-gold/5 hover:bg-gold/10 px-2.5 py-1 rounded-md transition-colors"
                            >
                              🔄 Sederhanakan
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  ) : (
                    text
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-gold/10 border border-gold/20 rounded-2xl rounded-tl-none p-4 flex gap-1.5 items-center h-[52px]">
                <span className="w-2 h-2 rounded-full bg-gold animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          {error && !error.message?.includes("Limit") && (
            <div className="flex flex-col gap-3 p-6 bg-navy-light/80 border border-gold/30 rounded-2xl text-center shadow-lg">
              <div className="w-12 h-12 bg-gold/20 text-gold rounded-full flex items-center justify-center mx-auto mb-2">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-putih font-bold text-lg">Terjadi Kesalahan</h3>
              <p className="text-putih/70 text-sm mb-2">
                {error.message?.includes("Service Unavailable") || error.message?.includes("Failed after")
                  ? "Server AI sedang sibuk (overloaded) atau koneksi tidak stabil. Silakan coba lagi dalam beberapa saat."
                  : error.message || "Gagal terhubung ke AI. Silakan coba lagi."}
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="bg-gold text-navy font-bold px-6 py-2 rounded-xl hover:bg-gold-light transition-colors mt-2"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Truncated response detection — Continue button */}
          {isLastResponseTruncated && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <button
                type="button"
                onClick={handleContinue}
                disabled={isLoading}
                className="flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-gold/20 transition-all disabled:opacity-50 shadow-lg shadow-gold/10"
              >
                <RefreshCw className="w-4 h-4" />
                Lanjutkan Jawaban AI
              </button>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-navy-dark border-t border-putih/20 p-4 shrink-0">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          
          {/* Model Toggle (Hidden as per user request to stick with Gemini Native) */}
          <div className="flex justify-end hidden">
            <div className="bg-navy-light/50 p-1 rounded-full border border-putih/10 inline-flex relative overflow-hidden">
              <button
                type="button"
                onClick={() => setApiModel('freemodel')}
                className={`relative z-10 px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${apiModel === 'freemodel' ? 'text-navy' : 'text-putih/50 hover:text-putih'}`}
              >
                Freemodel AI
              </button>
              <button
                type="button"
                onClick={() => setApiModel('gemini')}
                className={`relative z-10 px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${apiModel === 'gemini' ? 'text-navy' : 'text-putih/50 hover:text-putih'}`}
              >
                Gemini Native
              </button>
              <motion.div
                layout
                className="absolute top-1 bottom-1 w-[50%] bg-gold rounded-full z-0"
                initial={false}
                animate={{
                  left: apiModel === 'freemodel' ? "4px" : "calc(50% - 4px)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            </div>
          </div>

          {/* Quick Action Chips */}
          {messages.length <= 2 && (
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {[
                { icon: "📄", text: "Draft Kontrak Sewa Rumah" },
                { icon: "⚖️", text: "Apa syarat pembuatan PT?" },
                { icon: "🚨", text: "Langkah hukum korban penipuan online" },
                { icon: "💼", text: "Aturan pesangon PHK" },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInput(chip.text)}
                  className="shrink-0 flex items-center gap-2 bg-navy-light border border-putih/10 hover:border-gold/50 px-3 py-1.5 rounded-full text-xs text-putih/70 hover:text-putih transition-colors"
                >
                  <span>{chip.icon}</span>
                  {chip.text}
                </button>
              ))}
            </div>
          )}

          {messages.length > 2 && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-2 px-1">
              <p className="text-putih/70 text-xs text-center md:text-left">Apakah Anda ingin bertanya lagi dengan bidang hukum yang berbeda?</p>
              <button 
                type="button"
                onClick={() => setShowHomeConfirm(true)}
                className="text-xs font-semibold bg-navy-light hover:bg-putih/10 text-putih border border-putih/20 px-4 py-1.5 rounded-full transition-colors shrink-0"
              >
                Ya (Selesaikan Sesi)
              </button>
            </div>
          )}

          <div className="relative">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={isLoading || !!(error?.message?.includes("Limit"))}
              placeholder="Tuliskan kronologi masalah Anda secara lengkap..."
              className="w-full bg-navy border border-putih/20 rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:border-gold resize-none h-[80px] text-sm custom-scrollbar placeholder:text-putih/30"
            />
            <button 
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isLoading || !!(error?.message?.includes("Limit"))}
              className="absolute right-3 bottom-4 w-10 h-10 rounded-xl bg-gold flex items-center justify-center text-navy hover:bg-gold-light transition-colors disabled:opacity-50 disabled:hover:bg-gold"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="text-center mt-3 text-xs text-putih/40 max-w-2xl mx-auto">
          AI Legal Assistant dapat membuat kesalahan. Harap gunakan hasil analisis sebagai referensi awal, bukan sebagai nasehat hukum final.
        </div>
      </footer>
      
      {/* Slide-over History Panel */}
      <HistoryPanel isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />

      {/* Modals */}
      <LimitModal 
        isOpen={!!error && error.message?.includes("Limit")} 
        onClose={() => {}} 
        message={error?.message || "Limit tercapai."} 
      />

      {/* Home Confirmation Modal */}
      <AnimatePresence>
        {showHomeConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHomeConfirm(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <div className="fixed inset-0 flex items-center justify-center p-4 z-[100] pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-navy border border-gold/30 rounded-3xl p-8 max-w-sm w-full shadow-2xl pointer-events-auto relative overflow-hidden text-center"
              >
                <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-putih mb-2">Peringatan</h3>
                <p className="text-putih/70 text-sm mb-8 leading-relaxed">
                  Jika Anda yakin sesi ini sudah selesai atau ingin bertanya bidang hukum yang berbeda, Anda dapat menyelesaikan sesi konsultasi ini.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowHomeConfirm(false)}
                    className="flex-1 py-3 bg-navy-light border border-putih/20 text-putih font-bold rounded-xl hover:bg-putih/10 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => {
                      setShowHomeConfirm(false);
                      sessionStorage.removeItem("konsultasi_chat_messages");
                      sessionStorage.removeItem("intake_kronologi");
                      router.push("/intake");
                    }}
                    className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors text-center"
                  >
                    Ya, Selesaikan
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Upgrade Modal for PDF Clean */}
      <AnimatePresence>
        {showUpgradeModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpgradeModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <div className="fixed inset-0 flex items-center justify-center p-4 z-[100] pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-navy border border-gold/30 rounded-3xl p-8 max-w-md w-full shadow-2xl pointer-events-auto relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold to-yellow-300" />
                
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="absolute top-4 right-4 p-2 text-putih/50 hover:text-putih hover:bg-putih/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8 mt-4">
                  <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <div className="absolute inset-0 bg-gold/20 animate-ping rounded-full" style={{ animationDuration: '2s' }} />
                    <Crown className="w-10 h-10 text-gold" />
                  </div>
                  <h3 className="text-2xl font-bold text-putih mb-4">Fitur Premium</h3>
                  <p className="text-putih/70 leading-relaxed text-sm mb-4">
                    Download Laporan PDF tanpa watermark hanya tersedia untuk pengguna <span className="text-gold font-semibold">Premium</span>. 
                    Upgrade paket Anda untuk mendapatkan akses ke semua fitur eksklusif.
                  </p>

                  {/* Feature comparison */}
                  <div className="bg-navy-dark/60 rounded-2xl p-4 text-left mb-2 border border-putih/10">
                    <div className="flex items-center justify-between py-2 border-b border-putih/5">
                      <span className="text-sm text-putih/60">PDF Watermark</span>
                      <span className="text-sm text-green-400 font-medium">✓ Gratis</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-putih/5">
                      <span className="text-sm text-putih/60">PDF Clean (Tanpa Watermark)</span>
                      <span className="text-sm text-gold font-medium">★ Premium</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-putih/60">Generate Tanpa Batas</span>
                      <span className="text-sm text-gold font-medium">★ Premium</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link 
                    href="/#harga"
                    onClick={() => setShowUpgradeModal(false)}
                    className="flex items-center justify-center w-full py-4 bg-gold text-navy font-bold rounded-xl hover:bg-gold-light transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
                  >
                    Berlangganan Sekarang
                  </Link>
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="w-full py-4 text-putih/60 font-medium hover:text-putih hover:bg-putih/5 rounded-xl transition-colors"
                  >
                    Nanti Saja
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* PDF Export Options Modal */}
      <AnimatePresence>
        {showPdfOptionsModal.isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPdfOptionsModal({ isOpen: false, isClean: false })}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <div className="fixed inset-0 flex items-center justify-center p-4 z-[100] pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-navy border border-gold/30 rounded-3xl p-8 max-w-md w-full shadow-2xl pointer-events-auto relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold to-yellow-300" />
                
                <button
                  onClick={() => setShowPdfOptionsModal({ isOpen: false, isClean: false })}
                  className="absolute top-4 right-4 p-2 text-putih/50 hover:text-putih hover:bg-putih/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8 mt-4">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-putih mb-2">Pilih Versi PDF</h3>
                  <p className="text-putih/70 text-sm mb-6">
                    Pilih label AI yang ingin Anda sertakan sebagai pengesahan dokumen.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => executeExportPDF('freemodel')}
                    className="flex items-center justify-between w-full p-4 bg-navy-light/60 border border-putih/10 hover:border-gold/50 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-putih/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                        <Bot className="w-4 h-4 text-putih group-hover:text-gold" />
                      </div>
                      <div className="text-left">
                        <p className="text-putih font-bold text-sm">Versi Freemodel</p>
                        <p className="text-putih/50 text-xs">Label PDF: KonsultanAI (Freemodel)</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => executeExportPDF('gemini')}
                    className="flex items-center justify-between w-full p-4 bg-navy-light/60 border border-putih/10 hover:border-gold/50 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-putih/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                        <Bot className="w-4 h-4 text-putih group-hover:text-gold" />
                      </div>
                      <div className="text-left">
                        <p className="text-putih font-bold text-sm">Versi Gemini</p>
                        <p className="text-putih/50 text-xs">Label PDF: KonsultanAI (Gemini)</p>
                      </div>
                    </div>
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

import { Suspense } from "react";

export default function KonsultasiPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <KonsultasiContent />
    </Suspense>
  );
}
