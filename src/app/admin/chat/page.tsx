"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/auth/LoadingScreen";
import { ArrowLeft, Send, Image as ImageIcon, CheckCircle, Shield, X, MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Chat {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  updated_at: string;
  user?: {
    email: string;
    full_name: string;
  };
}

interface Message {
  id: string;
  sender_id: string;
  content: string | null;
  image_url: string | null;
  created_at: string;
}

export default function AdminChatPage() {
  const { user, isVerifying, isAdmin } = useAuth();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect non-admins
  useEffect(() => {
    if (!isVerifying && !isAdmin) {
      router.push("/");
    }
  }, [isVerifying, isAdmin, router]);

  // Load all chats
  useEffect(() => {
    if (!isAdmin) return;

    const fetchChats = async () => {
      const { data: chatsData, error: chatsError } = await supabase
        .from("chats")
        .select("id, user_id, plan, status, updated_at")
        .order("updated_at", { ascending: false });

      if (chatsError || !chatsData) {
        console.error("Failed to load admin chats:", chatsError);
        setChats([]);
        return;
      }

      if (chatsData.length > 0) {
        const userIds = [...new Set(chatsData.map((c: any) => c.user_id).filter(Boolean))];
        const { data: usersData } = await supabase
          .from("users")
          .select("id, email, full_name")
          .in("id", userIds);

        const userMap = new Map();
        if (usersData) {
          usersData.forEach((u: any) => userMap.set(u.id, u));
        }

        const mergedChats = chatsData.map((c: any) => ({
          ...c,
          user: userMap.get(c.user_id) || { email: "Unknown", full_name: "Unknown User" }
        }));

        setChats(mergedChats as any);
      } else {
        setChats([]);
      }
    };

    fetchChats();

    const channel = supabase
      .channel("admin_chats")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chats" },
        () => fetchChats()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, supabase]);

  // Load messages for active chat
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", activeChat.id)
        .order("created_at", { ascending: true });
      
      if (data) setMessages(data);
    };

    fetchMessages();

    const channel = supabase
      .channel(`admin_messages_${activeChat.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${activeChat.id}`,
        },
        (payload: any) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChat, supabase]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChat || !user || (!newMessage.trim() && !imageFile)) return;

    setIsSending(true);
    let imageUrl = null;

    try {
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `admin/${activeChat.id}/${fileName}`;

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
        chat_id: activeChat.id,
        sender_id: user.id,
        content: newMessage.trim() || null,
        image_url: imageUrl
      });

      await supabase.from("chats").update({ updated_at: new Date().toISOString() }).eq("id", activeChat.id);

      setNewMessage("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Gagal mengirim pesan.");
    } finally {
      setIsSending(false);
    }
  };

  const markAsResolved = async () => {
    if (!activeChat || !activeChat.user_id) return;
    
    // 1. Update chat status
    await supabase.from("chats").update({ status: "resolved" }).eq("id", activeChat.id);
    
    // 2. Upgrade User Plan and Set Expiration
    if (activeChat.plan !== "Free Trial") {
      const isAnnual = activeChat.plan.toLowerCase().includes('tahunan') || activeChat.plan.toLowerCase().includes('annual');
      const daysToAdd = isAnnual ? 365 : 30;
      const expiresAt = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();
      
      await supabase.from("users").update({
        tier: activeChat.plan,
        is_premium: true,
        subscription_started_at: new Date().toISOString(),
        subscription_expires_at: expiresAt
      }).eq("id", activeChat.user_id);
    }
    
    setActiveChat({ ...activeChat, status: "resolved" });
    
    // Show a small notification inside the browser if possible (or just log it)
    console.log(`Plan upgraded for user ${activeChat.user_id} to ${activeChat.plan}`);
  };

  if (isVerifying || !isAdmin) return <LoadingScreen />;

  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-navy-dark border-b border-putih/20 py-3 px-6 shrink-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="w-9 h-9 rounded-full bg-navy-light flex items-center justify-center hover:bg-putih/10 transition-colors">
            <ArrowLeft className="w-4 h-4 text-putih" />
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold" />
            <h1 className="font-bold text-lg text-putih">Admin Live Chat</h1>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat List (Sidebar) */}
        <div className="w-full md:w-80 bg-navy-light/30 border-r border-putih/20 flex flex-col shrink-0">
          <div className="p-4 border-b border-putih/20">
            <h2 className="font-bold mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gold" /> Daftar Pesanan
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-putih/30" />
              <input
                type="text"
                placeholder="Cari email..."
                className="w-full bg-navy border border-putih/15 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-gold/40"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`w-full text-left p-4 border-b border-putih/15 hover:bg-putih/5 transition-colors ${
                  activeChat?.id === chat.id ? "bg-putih/10 border-l-4 border-l-gold" : "border-l-4 border-l-transparent"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="font-bold text-sm truncate">{chat.user?.full_name || chat.user?.email}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    chat.status === "open" ? "bg-green-500/20 text-green-400" : "bg-putih/10 text-putih/50"
                  }`}>
                    {chat.status}
                  </span>
                </div>
                <p className="text-xs text-gold mb-1">{chat.plan}</p>
                <p className="text-[10px] text-putih/40">
                  {new Date(chat.updated_at).toLocaleString("id-ID")}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex-col bg-navy ${!activeChat ? "hidden md:flex items-center justify-center" : "flex"}`}>
          {!activeChat ? (
            <div className="text-center opacity-50">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-putih/20" />
              <p>Pilih chat untuk mulai membalas</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-putih/20 bg-navy-dark/50 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="font-bold text-putih">{activeChat.user?.full_name || activeChat.user?.email}</h3>
                  <p className="text-xs text-gold">Memesan: {activeChat.plan}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={markAsResolved}
                    disabled={activeChat.status === "resolved"}
                    className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-lg hover:bg-green-500/20 disabled:opacity-50"
                  >
                    {activeChat.status === "resolved" ? "Selesai" : "Tandai Selesai"}
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6 max-w-4xl mx-auto">
                  {messages.map((msg) => {
                    const isAdminMsg = msg.sender_id === user?.id;
                    return (
                      <div key={msg.id} className={`flex items-start gap-3 ${isAdminMsg ? "flex-row-reverse" : ""}`}>
                        {!isAdminMsg && (
                          <div className="w-8 h-8 rounded-full bg-putih/10 flex items-center justify-center shrink-0">
                            {activeChat.user?.email?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        
                        <div className={`rounded-2xl p-4 text-sm shadow-lg ${
                          isAdminMsg 
                            ? "bg-gold text-navy rounded-tr-sm" 
                            : "bg-navy-light/50 border border-putih/20 text-putih rounded-tl-sm max-w-[80%]"
                        }`}>
                          {msg.image_url && (
                            <div className="mb-2">
                              <img src={msg.image_url} alt="Attachment" className="max-w-full rounded-xl object-contain max-h-[300px]" />
                            </div>
                          )}
                          {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                          <span className={`text-[10px] mt-2 block ${isAdminMsg ? "text-navy/60 text-right" : "text-putih/40"}`}>
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
              <div className="bg-navy-dark border-t border-putih/20 p-4 shrink-0">
                <div className="max-w-4xl mx-auto">
                  {imagePreview && (
                    <div className="mb-3 relative inline-block">
                      <img src={imagePreview} alt="Preview" className="h-24 rounded-lg border border-putih/20" />
                      <button
                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                        className="absolute -top-2 -right-2 bg-merah text-putih w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
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
                      placeholder="Balas pesan atau kirim QRIS..."
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
                      className="shrink-0 p-3 bg-gold text-navy rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

