"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Send, ArrowLeft, Paperclip, Image as ImageIcon, MoreVertical, Shield, User, Info, Clock, MapPin, Briefcase, Building, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ParticleBackground from "@/components/ui/ParticleBackground";

interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

interface Room {
  id: string;
  status: string;
  expires_at: string;
  advocate: {
    id: string;
    full_name: string;
    photo_url: string;
    city?: string;
    experience_years?: number;
    organization?: string;
    rating_avg?: number;
  };
  client: {
    id: string;
    full_name: string;
  };
}

export default function ConsultationChatRoom() {
  const { roomId } = useParams();
  const router = useRouter();
  const { user, profile } = useAuth();
  const supabase = createClient();

  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showAdvocateProfile, setShowAdvocateProfile] = useState(false);
  const [showEndSessionConfirm, setShowEndSessionConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch room details and initial messages
  useEffect(() => {
    if (!user || !roomId) return;

    const fetchRoomAndMessages = async () => {
      try {
        // Fetch room
        const { data: roomData, error: roomErr } = await supabase
          .from("consultation_rooms")
          .select(`
            id, status, expires_at, user_id,
            advocate:advocates(id, full_name, photo_url, city, experience_years, organization, rating_avg)
          `)
          .eq("id", roomId)
          .single();

        if (roomErr) throw roomErr;

        // Fetch client info manually
        const { data: clientData } = await supabase
          .from("users")
          .select("id, full_name")
          .eq("id", roomData.user_id)
          .single();

        setRoom({
          ...roomData,
          client: clientData ? { id: clientData.id, full_name: clientData.full_name } : { id: roomData.user_id, full_name: "Klien" }
        } as any);

        // Fetch messages
        const { data: msgsData, error: msgsErr } = await supabase
          .from("consultation_messages")
          .select("*")
          .eq("room_id", roomId)
          .order("created_at", { ascending: true });

        if (msgsErr) throw msgsErr;
        setMessages(msgsData || []);
        scrollToBottom();
      } catch (err) {
        console.error("Error fetching chat data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomAndMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "consultation_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, roomId, supabase]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !roomId) return;

    setSending(true);
    try {
      const { error } = await supabase.from("consultation_messages").insert({
        room_id: roomId,
        sender_id: user.id,
        content: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Gagal mengirim pesan.");
    } finally {
      setSending(false);
    }
  };

  const handleEndSession = async () => {
    if (!roomId) return;
    try {
      const { error } = await supabase
        .from("consultation_rooms")
        .update({ status: "completed" })
        .eq("id", roomId);
        
      if (error) throw error;
      
      // Redirect to landing page
      router.push("/");
    } catch (err) {
      console.error("Error ending session:", err);
      alert("Gagal mengakhiri sesi.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-putih mb-4">Ruang Chat Tidak Ditemukan</h1>
        <p className="text-putih/60 mb-6">Ruang konsultasi ini tidak ada atau Anda tidak memiliki akses.</p>
        <button onClick={() => router.back()} className="bg-gold text-navy px-6 py-2 rounded-full font-bold">Kembali</button>
      </div>
    );
  }

  const isAdvocate = profile?.role === "advokat";
  const chatPartnerName = isAdvocate ? room.client?.full_name || "Klien" : room.advocate?.full_name;
  const isExpired = new Date(room.expires_at) < new Date();

  return (
    <div className="min-h-screen bg-navy text-putih flex flex-col">
      {/* Header */}
      <header className="bg-navy-dark border-b border-putih/10 py-4 px-6 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-navy-light flex items-center justify-center hover:bg-putih/10 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div 
              className={`flex items-center gap-3 ${!isAdvocate ? "cursor-pointer hover:bg-putih/5 p-1 -ml-1 rounded-xl transition-colors" : ""}`}
              onClick={() => !isAdvocate && setShowAdvocateProfile(true)}
            >
              {!isAdvocate && room.advocate?.photo_url ? (
                <div className="w-10 h-10 rounded-full overflow-hidden relative border border-putih/10 shrink-0">
                  <Image src={room.advocate.photo_url} alt="Advocate" fill className="object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                  {isAdvocate ? <User className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                </div>
              )}
              <div>
                <h1 className="font-bold text-lg leading-tight group-hover:text-gold transition-colors">{chatPartnerName}</h1>
                <p className="text-xs text-putih/50 flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${room.status === "active" && !isExpired ? "bg-green-400" : "bg-red-400"}`} />
                  {room.status === "active" && !isExpired ? "Aktif" : "Selesai"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 relative">
            <button 
              onClick={() => setShowInfo(true)}
              className="p-2 hover:bg-putih/10 rounded-lg text-putih/60 transition-colors"
            >
              <Info className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-putih/10 rounded-lg text-putih/60 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute top-12 right-0 w-48 bg-navy-light border border-putih/10 rounded-2xl shadow-xl overflow-hidden py-2 z-50">
                <button 
                  onClick={() => {
                    setShowMenu(false);
                    setShowEndSessionConfirm(true);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-putih/5 transition-colors"
                >
                  Selesaikan Sesi
                </button>
                <button 
                  onClick={() => {
                    setShowMenu(false);
                    window.open(`https://www.instagram.com/konsultanai/`, '_blank');
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-putih/5 transition-colors text-red-400"
                >
                  Laporkan Masalah
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowInfo(false)}>
          <div className="bg-navy-light border border-putih/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-xl mb-4 text-putih">Informasi Sesi</h3>
            <div className="space-y-4 text-sm text-putih/70">
              <div className="flex justify-between border-b border-putih/10 pb-2">
                <span>Status</span>
                <span className={`font-bold ${room.status === "active" && !isExpired ? "text-green-400" : "text-red-400"}`}>
                  {room.status === "active" && !isExpired ? "Aktif" : "Selesai"}
                </span>
              </div>
              <div className="flex justify-between border-b border-putih/10 pb-2">
                <span>Klien</span>
                <span className="font-medium text-putih">{room.client.full_name}</span>
              </div>
              <div className="flex justify-between border-b border-putih/10 pb-2">
                <span>Advokat</span>
                <span className="font-medium text-putih">{room.advocate.full_name}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span>Berakhir Pada</span>
                <span className="font-medium text-putih">{new Date(room.expires_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>
            <button 
              onClick={() => setShowInfo(false)}
              className="mt-6 w-full bg-putih/10 hover:bg-putih/20 text-putih py-3 rounded-xl font-bold transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Advocate Profile Modal */}
      {showAdvocateProfile && !isAdvocate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowAdvocateProfile(false)}>
          <div className="bg-navy-light border border-putih/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center mb-6">
              {room.advocate?.photo_url ? (
                <div className="w-20 h-20 rounded-full overflow-hidden relative border-2 border-gold/30 mb-4">
                  <Image src={room.advocate.photo_url} alt="Advocate" fill className="object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-4 border-2 border-gold/30">
                  <Shield className="w-10 h-10" />
                </div>
              )}
              <h3 className="font-bold text-xl text-putih text-center">{room.advocate.full_name}</h3>
              <p className="text-sm text-gold">Advokat Terverifikasi</p>
            </div>
            
            <div className="space-y-3 text-sm text-putih/80 bg-navy/50 p-4 rounded-2xl border border-putih/5">
              {room.advocate.city && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gold shrink-0" />
                  <span>{room.advocate.city}</span>
                </div>
              )}
              {room.advocate.organization && (
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-gold shrink-0" />
                  <span>{room.advocate.organization}</span>
                </div>
              )}
              {room.advocate.experience_years !== undefined && (
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-gold shrink-0" />
                  <span>{room.advocate.experience_years} Tahun Pengalaman</span>
                </div>
              )}
              {room.advocate.rating_avg !== undefined && (
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-gold shrink-0" />
                  <span>{room.advocate.rating_avg.toFixed(1)}/5.0 Rating</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => setShowAdvocateProfile(false)}
              className="mt-6 w-full bg-putih/10 hover:bg-putih/20 text-putih py-3 rounded-xl font-bold transition-colors"
            >
              Tutup Profil
            </button>
          </div>
        </div>
      )}

      {/* End Session Confirm Modal */}
      {showEndSessionConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowEndSessionConfirm(false)}>
          <div className="bg-navy-light border border-putih/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-putih">Akhiri Sesi Konsultasi?</h3>
            <p className="text-sm text-putih/70 mb-6">
              Apakah Anda yakin ingin mengakhiri sesi ini? Anda tidak akan dapat mengirim pesan lagi setelah sesi diakhiri.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowEndSessionConfirm(false)}
                className="flex-1 bg-putih/10 hover:bg-putih/20 text-putih py-3 rounded-xl font-bold transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleEndSession}
                className="flex-1 bg-red-500 hover:bg-red-600 text-putih py-3 rounded-xl font-bold transition-colors shadow-lg shadow-red-500/20"
              >
                Ya, Akhiri
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expiry Banner */}
      {room.status === "active" && !isExpired && (
        <div className="bg-gold/10 border-b border-gold/20 py-2 px-6 text-center text-xs text-gold flex justify-center items-center gap-2">
          <Clock className="w-4 h-4" />
          Sesi konsultasi ini berlaku hingga {new Date(room.expires_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </div>
      )}

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-6 scroll-smooth relative">
        <ParticleBackground count={15} />
        
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          {/* Messages */}
          {messages.map((msg, idx) => {
            const isMe = msg.sender_id === user?.id;
            // Identify system messages (if they were sent by the bot/system, usually we can just check if sender_id is not user nor advocate, but here we used user.id. We can format it based on content for MVP)
            const isSystem = msg.content.startsWith("📋 Sesi konsultasi telah dimulai");

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-6">
                  <div className="bg-navy-light/50 border border-putih/5 rounded-xl p-4 max-w-sm text-center text-sm text-putih/60 whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div className="flex items-end gap-2 max-w-[85%] md:max-w-[70%]">
                  {!isMe && (
                    <div className="w-8 h-8 rounded-full bg-putih/10 flex items-center justify-center text-xs shrink-0 mb-1">
                      {isAdvocate ? "K" : "A"}
                    </div>
                  )}
                  <div className={`p-4 rounded-2xl whitespace-pre-wrap ${
                    isMe 
                      ? "bg-gold text-navy rounded-br-sm" 
                      : "bg-navy-light border border-putih/10 text-putih rounded-bl-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
                <span className="text-[10px] text-putih/30 mt-1 px-10">
                  {new Date(msg.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-navy-dark border-t border-putih/10 p-4 shrink-0">
        <div className="max-w-4xl mx-auto">
          {room.status === "active" && !isExpired ? (
            <form onSubmit={handleSendMessage} className="flex items-end gap-3">
              <button type="button" className="p-3 text-putih/40 hover:text-putih hover:bg-putih/10 rounded-xl transition-colors mb-1">
                <Paperclip className="w-5 h-5" />
              </button>
              <div className="flex-1 bg-navy-light border border-putih/15 rounded-2xl overflow-hidden focus-within:border-gold/50 transition-colors">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Ketik pesan Anda di sini..."
                  className="w-full max-h-32 min-h-[56px] bg-transparent text-putih p-4 resize-none focus:outline-none"
                  rows={1}
                />
              </div>
              <button 
                type="submit" 
                disabled={!newMessage.trim() || sending}
                className="p-4 bg-gold text-navy rounded-2xl hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-1"
              >
                {sending ? <div className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>
          ) : (
            <div className="text-center p-4 bg-navy-light/50 rounded-xl text-putih/50 text-sm">
              Sesi konsultasi ini telah berakhir.
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
