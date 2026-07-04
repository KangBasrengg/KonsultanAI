"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { ArrowLeft, Send, Image as ImageIcon, CheckCircle, Shield, X, MessageSquare, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/auth/LoadingScreen";
import QRISPaymentModal from "@/components/payment/QRISPaymentModal";

interface Chat {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  updated_at: string;
}

interface Message {
  id: string;
  sender_id: string;
  content: string | null;
  image_url: string | null;
  created_at: string;
}

function ChatContent() {
  const { user, isVerifying } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const basePlan = searchParams.get("plan");
  const cycle = searchParams.get("cycle");
  const plan = basePlan && cycle === "annual" ? `${basePlan} (Tahunan)` : basePlan;
  const supabase = createClient();

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [showQRIS, setShowQRIS] = useState(false);
  const [qrisAmount, setQrisAmount] = useState(0);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000); // Hide after 5 seconds
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!isVerifying && !user) {
      window.location.href = "/?login=true";
    }
  }, [isVerifying, user]);

  // Init chat - load history or create new
  useEffect(() => {
    if (!user || isVerifying) return;
    let cancelled = false;

    const initChats = async () => {
      // 1. Fetch all existing chats for this user
      const { data: existingChats } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (cancelled) return;

      let currentChats = existingChats as Chat[] || [];
      let currentActiveId = null;

      // 2. Determine active chat or create a new one
      if (plan) {
        // Came from pricing: look for an open chat
        const openChat = currentChats.find(c => c.status === "open");
        if (openChat) {
          currentActiveId = openChat.id;
        } else {
          // Create new chat
          const { data: newChat } = await supabase
            .from("chats")
            .insert({
              user_id: user.id,
              plan: plan,
              status: "open"
            })
            .select("*")
            .single();
          
          if (newChat && !cancelled) {
            currentChats = [newChat as Chat, ...currentChats];
            currentActiveId = newChat.id;
          }
        }
      } else {
        // Just visited /chat directly
        if (currentChats.length > 0) {
          currentActiveId = currentChats[0].id;
        }
      }

      setChats(currentChats);
      setActiveChatId(currentActiveId);
    };

    initChats();

    // Subscribe to changes on the chats table (to see status updates)
    const chatChannel = supabase
      .channel(`user_chats_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chats",
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          setChats((prev) => 
            prev.map(c => c.id === payload.new.id ? (payload.new as Chat) : c)
          );
        }
      )
      .subscribe();

    return () => { 
      cancelled = true; 
      supabase.removeChannel(chatChannel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isVerifying, plan]);

  // Fetch messages & subscribe to realtime once activeChatId is set
  useEffect(() => {
    if (!activeChatId || !user) return;
    let cancelled = false;

    const fetchMessages = async () => {
      const { data: existingMessages } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", activeChatId)
        .order("created_at", { ascending: true });
      
      if (!cancelled && existingMessages) {
        setMessages(existingMessages);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat_messages_${activeChatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${activeChatId}`,
        },
        (payload: any) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChatId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // === Early returns AFTER all hooks ===
  if (isVerifying) return <LoadingScreen />;
  if (!user) return <LoadingScreen />;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatId || !user || (!newMessage.trim() && !imageFile)) return;

    setIsSending(true);
    let imageUrl = null;

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${activeChatId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("chat-images")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("chat-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      await supabase.from("messages").insert({
        chat_id: activeChatId,
        sender_id: user.id,
        content: newMessage.trim() || null,
        image_url: imageUrl
      });

      await supabase.from("chats").update({ updated_at: new Date().toISOString() }).eq("id", activeChatId);

      // Update local state to bubble chat to top
      setChats(prev => {
        const updated = [...prev];
        const idx = updated.findIndex(c => c.id === activeChatId);
        if (idx !== -1) {
          const [chat] = updated.splice(idx, 1);
          chat.updated_at = new Date().toISOString();
          updated.unshift(chat);
        }
        return updated;
      });

      setNewMessage("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Failed to send message:", err);
      showNotification("Gagal mengirim pesan. Silakan coba lagi.", "error");
    } finally {
      setIsSending(false);
    }
  };

  // Calculate price based on plan name
  const getPlanPrice = (planName: string): number => {
    const normalized = (planName || '').toLowerCase().trim();
    const isAnnual = normalized.includes('tahunan') || normalized.includes('annual');

    if (normalized.includes('basic')) return isAnnual ? 840000 : 80000;
    if (normalized.includes('pro') || normalized.includes('premium')) return isAnnual ? 1548000 : 149000;
    if (normalized.includes('enterprise')) return isAnnual ? 5340000 : 525000;
    return 0;
  };

  const handlePayment = async () => {
    if (!activeChatId || !user || !activeChat) return;

    // Free Trial bypass
    if (activeChat.plan === "Free Trial") {
      setIsPaying(true);
      try {
        await supabase.from("chats").update({ status: "resolved", updated_at: new Date().toISOString() }).eq("id", activeChatId);
        
        // Upgrade User Plan (Free Trial does NOT grant premium)
        await supabase.from("users").update({ 
          tier: activeChat.plan,
          is_premium: false 
        }).eq("id", user.id);
        
        await supabase.from("messages").insert({
          chat_id: activeChatId,
          sender_id: user.id, // using user.id as fallback, but ideally admin id
          content: `Admin: Terima kasih telah mengaktifkan ${activeChat.plan}! Layanan Anda sudah aktif. Jika ada pertanyaan lebih lanjut, jangan ragu untuk menghubungi kami.`
        });
        
        showNotification(`${activeChat.plan} berhasil diaktifkan!`, "success");
        if (typeof (window as any).refreshProfile === 'function') (window as any).refreshProfile();
      } catch (e) {
        console.error(e);
      } finally {
        setIsPaying(false);
      }
      return;
    }

    // Open QRIS payment modal
    const price = getPlanPrice(activeChat.plan);
    setQrisAmount(price);
    setShowQRIS(true);
  };

  const handleQRISSuccess = () => {
    showNotification("Bukti pembayaran terkirim! Admin akan memverifikasi dalam 1x24 jam.", "success");
  };

  const activeChat = chats.find(c => c.id === activeChatId);

  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-navy-dark border-b border-putih/20 py-3 px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/#harga" className="w-9 h-9 rounded-full bg-navy-light flex items-center justify-center hover:bg-putih/10 transition-colors">
            <ArrowLeft className="w-4 h-4 text-putih" />
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold" />
            <h1 className="hidden md:block font-bold text-lg text-putih">KonsultanAI Care</h1>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Riwayat Chat) */}
        <div className="w-full md:w-80 bg-navy-light/30 border-r border-putih/20 flex flex-col shrink-0 md:flex hidden">
          <div className="p-4 border-b border-putih/20">
            <h2 className="font-bold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gold" /> Riwayat Transaksi
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="p-6 text-center text-putih/40 text-sm">
                Belum ada transaksi.
              </div>
            ) : (
              chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`w-full text-left p-4 border-b border-putih/15 hover:bg-putih/5 transition-colors ${
                    activeChatId === chat.id ? "bg-putih/10 border-l-4 border-l-gold" : "border-l-4 border-l-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-sm text-gold">{chat.plan}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      chat.status === "open" ? "bg-orange-500/20 text-orange-400" : "bg-green-500/20 text-green-400"
                    }`}>
                      {chat.status === "open" ? "Proses" : "Selesai"}
                    </span>
                  </div>
                  <p className="text-[10px] text-putih/40 flex items-center gap-1 mt-2">
                    <Clock className="w-3 h-3" />
                    {new Date(chat.updated_at).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex-col bg-navy ${!activeChatId && chats.length > 0 ? "hidden md:flex items-center justify-center" : "flex"}`}>
          {!activeChatId ? (
             <div className="text-center opacity-50 flex flex-col items-center justify-center h-full">
               <MessageSquare className="w-12 h-12 mx-auto mb-3 text-putih/20" />
               <p>Pilih riwayat transaksi atau mulai berlangganan</p>
             </div>
          ) : (
            <>
              {/* Mobile back button & Banner */}
              <div className="bg-navy-dark border-b border-putih/20 p-4 shrink-0 flex flex-col gap-2">
                <button 
                  onClick={() => setActiveChatId(null)}
                  className="md:hidden flex items-center gap-2 text-xs text-putih/50 hover:text-putih transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" /> Kembali ke Riwayat
                </button>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-gold shrink-0" />
                    <p className="text-sm font-medium">Transaksi: <span className="text-gold">{activeChat?.plan}</span></p>
                  </div>
                  {activeChat?.status === "resolved" && (
                    <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-lg border border-green-500/20">
                      Transaksi Selesai
                    </span>
                  )}
                  {activeChat?.status === "open" && (
                    <button
                      onClick={handlePayment}
                      disabled={isPaying}
                      className="text-xs font-bold bg-gold text-navy px-3 py-1.5 rounded-lg hover:bg-gold-light transition-colors shadow-lg disabled:opacity-50"
                    >
                      {isPaying ? "Memproses..." : "Bayar Sekarang"}
                    </button>
                  )}
                </div>
                {activeChat?.status === "open" && (
                  <p className="text-xs text-putih/50 mt-1">
                    Silakan klik "Bayar Sekarang" untuk membayar via QRIS, atau unggah bukti transfer manual di chat.
                  </p>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* System Welcome Message */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4 text-gold" />
                    </div>
                    <div className="bg-navy-light/50 border border-putih/20 rounded-2xl rounded-tl-sm p-4 text-sm text-putih max-w-[80%] shadow-lg">
                      Halo! Terima kasih telah memilih <strong>{activeChat?.plan}</strong>. <br/><br/>
                      Silakan lakukan pembayaran dan unggah bukti transfer di sini. Admin akan merespons melalui chat ini.
                    </div>
                  </div>

                  {messages.map((msg) => {
                    const isMe = msg.sender_id === user.id;
                    return (
                      <div key={msg.id} className={`flex items-start gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                        {!isMe && (
                          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                            <Shield className="w-4 h-4 text-gold" />
                          </div>
                        )}
                        
                        <div className={`rounded-2xl p-4 text-sm shadow-lg ${
                          isMe 
                            ? "bg-gold text-navy rounded-tr-sm" 
                            : "bg-navy-light/50 border border-putih/20 text-putih rounded-tl-sm max-w-[80%]"
                        }`}>
                          {msg.image_url && (
                            <div className="mb-2">
                              <img src={msg.image_url} alt="Attachment" className="max-w-full rounded-xl object-contain max-h-[300px]" />
                            </div>
                          )}
                          {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                          <span className={`text-[10px] mt-2 block ${isMe ? "text-navy/60 text-right" : "text-putih/40"}`}>
                            {new Date(msg.created_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              {activeChat?.status === "open" ? (
                <div className="bg-navy-dark border-t border-putih/20 p-4 shrink-0">
                  <div className="max-w-4xl mx-auto">
                    {imagePreview && (
                      <div className="mb-3 relative inline-block">
                        <img src={imagePreview} alt="Preview" className="h-24 rounded-lg border border-putih/20" />
                        <button
                          onClick={() => { setImageFile(null); setImagePreview(null); }}
                          className="absolute -top-2 -right-2 bg-merah text-putih w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                      <label className="shrink-0 p-3 bg-navy-light hover:bg-putih/10 text-putih/70 hover:text-gold rounded-xl cursor-pointer transition-colors border border-putih/20">
                        <ImageIcon className="w-5 h-5" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>

                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Ketik pesan atau upload bukti pembayaran..."
                        className="flex-1 bg-navy-light border border-putih/20 rounded-xl px-4 py-3 text-sm text-putih placeholder:text-putih/30 focus:outline-none focus:border-gold/50 resize-none max-h-32"
                        rows={1}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                      />

                      <button
                        type="submit"
                        disabled={isSending || (!newMessage.trim() && !imageFile)}
                        className="shrink-0 p-3 bg-gold text-navy rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSending ? (
                          <div className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="bg-navy-dark border-t border-putih/20 p-4 shrink-0 text-center">
                  <p className="text-sm text-putih/50 flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Transaksi ini sudah selesai. Form pesan ditutup.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
              notification.type === 'success' 
                ? 'bg-green-900/90 border-green-500/50 text-green-50' 
                : notification.type === 'error'
                ? 'bg-red-900/90 border-red-500/50 text-red-50'
                : 'bg-navy border-gold/50 text-putih'
            } backdrop-blur-md`}
          >
            {notification.type === 'success' && <CheckCircle className="w-6 h-6 text-green-400" />}
            {notification.type === 'error' && <AlertCircle className="w-6 h-6 text-red-400" />}
            {notification.type === 'info' && <Shield className="w-6 h-6 text-gold" />}
            
            <p className="font-medium text-sm">{notification.message}</p>
            
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QRIS Payment Modal */}
      {activeChat && (
        <QRISPaymentModal
          isOpen={showQRIS}
          onClose={() => setShowQRIS(false)}
          planName={activeChat.plan}
          amount={qrisAmount}
          chatId={activeChatId || undefined}
          userEmail={user.email}
          userName={user.user_metadata?.full_name || user.email?.split('@')[0]}
          paymentType="subscription"
          onSuccess={handleQRISSuccess}
        />
      )}
    </div>
  );
}

export default function UserChatPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ChatContent />
    </Suspense>
  );
}


