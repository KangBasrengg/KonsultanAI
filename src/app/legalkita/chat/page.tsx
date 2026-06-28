"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { Send, ArrowLeft, Bot, User, AlertTriangle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";

function getMessageText(msg: any): string {
  if (Array.isArray(msg.parts)) {
    return msg.parts.filter((p: any) => p.type === "text").map((p: any) => p.text).join("");
  }
  if (typeof msg.content === "string") return msg.content;
  return "";
}

const QUICK_QUESTIONS = [
  "Bagaimana cara membuat kontrak kerja PKWT yang sah?",
  "Apa saja hak karyawan menurut UU Cipta Kerja?",
  "Berapa UMR/UMK terbaru dan cara menghitungnya?",
  "Izin usaha apa saja yang diperlukan UMKM?",
  "Bagaimana cara mengurus NPWP untuk usaha kecil?",
  "Apa perbedaan CV dan PT untuk usaha kecil?",
];

export default function LegalKitaChatPage() {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/legalkita/chat" }), []);
  const { messages, sendMessage, status, error } = useChat({
    transport,
    messages: [{
      id: "welcome",
      role: "assistant",
      parts: [{ type: "text", text: "Halo! Saya asisten hukum **LegalKita** 🏪\n\nSaya siap menjawab pertanyaan seputar hukum untuk usaha kecil menengah (UMKM) Indonesia:\n\n- 📝 **Kontrak & Perjanjian** — PKWT, sewa, kemitraan\n- 👷 **Ketenagakerjaan** — hak karyawan, PHK, upah\n- 📋 **Perizinan** — NIB, SIUP, izin usaha\n- 💰 **Pajak UMKM** — PPh Final 0.5%, NPWP\n- ⚖️ **Hukum Bisnis** — pendirian CV/PT, franchise\n\nSilakan tanya apa saja!" }]
    }] as UIMessage[],
  });

  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isLoading = status === "streaming" || status === "submitted";
  const { isVerifying, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isVerifying && !user) router.replace("/?login=true");
  }, [isVerifying, user, router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;
    setInput("");
    await sendMessage({ text: msg });
  };

  if (isVerifying || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-navy">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-slate-200 dark:border-putih/20 border-t-amber-500 animate-spin" />
          </div>
          <p className="text-navy/50 dark:text-putih/50 text-sm animate-pulse">Mempersiapkan LegalKita...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-transparent">
      {/* Header */}
      <header className="bg-white dark:bg-navy-dark border-b border-slate-200 dark:border-putih/20 py-4 px-6 flex justify-between items-center shrink-0 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-4">
          <Link href="/legalkita" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-navy-light flex items-center justify-center hover:bg-slate-200 dark:hover:bg-putih/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-navy/70 dark:text-putih" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-navy dark:text-putih">LegalKita <span className="text-amber-500 dark:text-amber-400">Chat</span></h1>
              <p className="text-xs text-navy/50 dark:text-putih/50 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Chat Tanya Hukum UMKM
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => {
            const text = getMessageText(msg);
            const isThinking = msg.role === "assistant" && !text && isLoading;
            return (
              <div key={msg.id} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === "assistant" ? "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-slate-200 dark:bg-putih/10 text-navy/60 dark:text-putih"}`}>
                  {msg.role === "assistant" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-slate-200 dark:bg-navy-light border border-slate-300 dark:border-putih/20 rounded-tr-none text-navy dark:text-white whitespace-pre-wrap" 
                    : "bg-[#fdf6ec] dark:bg-amber-500/10 border border-[#f0e2cd] dark:border-amber-500/20 rounded-tl-none text-[#5c4028] dark:text-white/90 prose prose-sm dark:prose-invert max-w-none [&_strong]:!text-[#9c5c14] dark:[&_strong]:!text-amber-300 [&_a]:!text-[#c47214] dark:[&_a]:!text-amber-400 [&_h1]:!text-[#5c4028] dark:[&_h1]:!text-white [&_h2]:!text-[#5c4028] dark:[&_h2]:!text-white [&_h3]:!text-[#5c4028] dark:[&_h3]:!text-white [&_h4]:!text-[#5c4028] dark:[&_h4]:!text-white"
                }`}>
                  {msg.role === "assistant" ? (isThinking ? (
                    <div className="flex items-center gap-2 text-[#9c5c14]/70 dark:text-amber-400/70 italic">
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-[#9c5c14]/70 dark:bg-amber-400/70 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-[#9c5c14]/70 dark:bg-amber-400/70 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-[#9c5c14]/70 dark:bg-amber-400/70 rounded-full animate-bounce"></span>
                      </span>
                      AI sedang berpikir...
                    </div>
                  ) : <ReactMarkdown>{text}</ReactMarkdown>) : text}
                </div>
              </div>
            );
          })}

          {/* Quick Questions - show only at start */}
          {messages.length <= 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl">
              {QUICK_QUESTIONS.map((q, i) => (
                <button key={i} onClick={() => handleSend(q)} className="text-left p-3 rounded-xl border border-[#f0e2cd] dark:border-putih/10 text-xs text-[#705030] dark:text-putih/60 hover:bg-[#fdf6ec] dark:hover:bg-amber-500/10 hover:border-[#d4b994] dark:hover:border-amber-500/30 hover:text-[#9c5c14] dark:hover:text-amber-300 transition-all bg-white dark:bg-transparent">
                  {q}
                </button>
              ))}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white dark:bg-navy-dark border-t border-slate-200 dark:border-putih/20 p-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:shadow-none">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            disabled={isLoading} placeholder="Tanya tentang hukum UMKM..."
            className="w-full bg-slate-50 dark:bg-navy border border-slate-300 dark:border-putih/20 rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:border-amber-500 resize-none h-[80px] text-sm text-navy dark:text-putih placeholder:text-navy/40 dark:placeholder:text-putih/30"
          />
          <button type="button" onClick={() => handleSend()} disabled={!input.trim() || isLoading}
            className="absolute right-3 bottom-4 w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white dark:text-navy hover:bg-amber-400 transition-colors disabled:opacity-50">
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center mt-3 text-xs text-navy/40 dark:text-putih/40 max-w-2xl mx-auto flex items-center justify-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Ini adalah bantuan AI, bukan pengganti konsultasi pengacara berlisensi.
        </div>
      </footer>
    </div>
  );
}
