"use client";

import { useRef, useEffect, useState } from "react";
import { Send, ArrowLeft, Bot, User, FileText, Download, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LogoImage from "@/components/images/LogoUpdated.png";
import { useChat, type UIMessage } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { exportConsultationPDF } from "@/lib/pdf-export";
import UserDropdown from "@/components/konsultasi/UserDropdown";
import HistoryPanel from "@/components/konsultasi/HistoryPanel";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/auth/LoadingScreen";

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

export default function KonsultasiPage() {
  const { messages, setMessages, sendMessage, status, error } = useChat({
    messages: [
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
    ] as UIMessage[]
  });

  const [input, setInput] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "streaming" || status === "submitted";
  const { isVerifying, user } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isVerifying && !user) {
      router.replace("/?login=true");
    }
  }, [isVerifying, user, router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    await sendMessage({ text: userMessage });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExportPDF = () => {
    // Only export if there is actual conversation
    if (messages.length <= 1) return alert("Belum ada percakapan untuk diekspor.");
    exportConsultationPDF(messages as any);
  };

  if (isVerifying) {
    return <LoadingScreen />;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-navy-dark border-b border-putih/20 py-4 px-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-10 h-10 rounded-full bg-navy-light flex items-center justify-center hover:bg-putih/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-putih" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-navy-light border border-putih/20 rounded-xl shadow-md overflow-hidden">
              <Image src={LogoImage} alt="KonsultanAI Logo" fill sizes="50px" className="object-contain p-1" />
            </div>
            <div>
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
          <button 
            type="button" 
            onClick={handleExportPDF}
            className="flex items-center gap-2 text-sm bg-gold text-navy font-bold px-4 py-2 rounded-lg hover:bg-gold-light transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Export PDF</span>
          </button>
          
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
              Sesi Konsultasi Baru (Free Trial 1/1)
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
                
                <div className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-navy-light border border-putih/20 rounded-tr-none text-putih whitespace-pre-wrap" 
                    : "bg-gold/10 border border-gold/20 rounded-tl-none text-putih/90 prose dark:prose-invert prose-sm prose-p:leading-relaxed prose-pre:bg-navy-dark max-w-none"
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
                      <ReactMarkdown>{text}</ReactMarkdown>
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

          {error && (
            <div className="flex flex-col gap-3 p-6 bg-navy-light/80 border border-gold/30 rounded-2xl text-center shadow-lg">
              <div className="w-12 h-12 bg-gold/20 text-gold rounded-full flex items-center justify-center mx-auto mb-2">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-putih font-bold text-lg">Terjadi Kesalahan</h3>
              <p className="text-putih/70 text-sm mb-2">{error.message || "Gagal terhubung ke AI. Silakan coba lagi."}</p>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-navy-dark border-t border-putih/20 p-4 shrink-0">
        <div className="max-w-4xl mx-auto relative">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Tuliskan kronologi masalah Anda secara lengkap..."
            className="w-full bg-navy border border-putih/20 rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:border-gold resize-none h-[80px] text-sm custom-scrollbar placeholder:text-putih/30"
          />
          <button 
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 bottom-4 w-10 h-10 rounded-xl bg-gold flex items-center justify-center text-navy hover:bg-gold-light transition-colors disabled:opacity-50 disabled:hover:bg-gold"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center mt-3 text-xs text-putih/40 max-w-2xl mx-auto">
          AI Legal Assistant dapat membuat kesalahan. Harap gunakan hasil analisis sebagai referensi awal, bukan sebagai nasehat hukum final.
        </div>
      </footer>
      
      {/* Slide-over History Panel */}
      <HistoryPanel isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </div>
  );
}

