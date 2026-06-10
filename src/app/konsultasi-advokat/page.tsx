"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MessageSquare, Clock, ArrowRight, Scale, User, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Room {
  id: string;
  status: string;
  expires_at: string;
  advocate: {
    id: string;
    full_name: string;
    photo_url: string;
  };
  client: {
    id: string;
    full_name: string;
  };
  messages: {
    content: string;
    created_at: string;
  }[];
}

export default function ConsultationsList() {
  const { user, profile } = useAuth();
  const supabase = createClient();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRooms = async () => {
      try {
        const isAdvocate = profile?.role === "advokat";
        
        // Base query - we get rooms and the latest message for preview
        let query = supabase
          .from("consultation_rooms")
          .select(`
            id, status, expires_at, user_id,
            advocate:advocates(id, full_name, photo_url),
            messages:consultation_messages(content, created_at)
          `)
          .order('updated_at', { ascending: false });

        if (isAdvocate) {
          // Find advocate id for this user
          const { data: adv } = await supabase.from("advocates").select("id").eq("user_id", user.id).single();
          if (adv) {
            query = query.eq("advocate_id", adv.id);
          } else {
            // Should not happen if role is advokat, but safe fallback
            query = query.eq("user_id", user.id);
          }
        } else {
          query = query.eq("user_id", user.id);
        }

        const { data, error } = await query;
        
        if (error) throw error;

        // Fetch client names manually since the foreign key points to auth.users
        const userIds = data.map((r: any) => r.user_id);
        let usersData: any[] = [];
        
        if (userIds.length > 0) {
          const { data: usersRes } = await supabase
            .from("users")
            .select("id, full_name")
            .in("id", userIds);
          if (usersRes) usersData = usersRes;
        }

        // Process data to only keep the latest message and attach client info
        const processedRooms = (data as any[]).map(room => {
          // Sort messages by created_at desc to get latest
          const sortedMessages = (room.messages || []).sort((a: any, b: any) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );

          const client = usersData?.find(u => u.id === room.user_id);
          
          return {
            ...room,
            client: client ? { id: client.id, full_name: client.full_name } : { id: room.user_id, full_name: "Klien" },
            messages: sortedMessages.slice(0, 1)
          };
        });

        setRooms(processedRooms);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [user, profile, supabase]);

  if (!user) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  const isAdvocate = profile?.role === "advokat";

  return (
    <main className="min-h-screen bg-navy text-putih">
      <Navbar />

      <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-putih mb-2 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-gold" />
              Sesi Konsultasi Anda
            </h1>
            <p className="text-putih/60">
              {isAdvocate ? "Kelola percakapan konsultasi dengan klien Anda." : "Riwayat dan sesi konsultasi aktif Anda dengan advokat."}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            <p className="text-putih/40 text-sm">Memuat data...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="bg-navy-light/30 border border-putih/20 rounded-3xl p-12 text-center">
            <MessageSquare className="w-16 h-16 text-putih/10 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Belum Ada Sesi Konsultasi</h3>
            <p className="text-putih/40 mb-6 max-w-md mx-auto">
              {isAdvocate 
                ? "Anda belum menerima klien. Pastikan profil Anda sudah terverifikasi dan aktif di marketplace."
                : "Anda belum memulai konsultasi dengan advokat mana pun."}
            </p>
            {!isAdvocate && (
              <Link href="/marketplace" className="inline-flex items-center gap-2 bg-gold text-navy px-6 py-3 rounded-full font-bold hover:bg-gold-light transition-colors">
                <Scale className="w-4 h-4" />
                Cari Advokat
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {rooms.map((room) => {
              const partnerName = isAdvocate ? room.client?.full_name || "Klien" : room.advocate?.full_name;
              const isExpired = new Date(room.expires_at) < new Date();
              const isActive = room.status === "active" && !isExpired;
              const latestMessage = room.messages?.[0];

              return (
                <Link
                  key={room.id}
                  href={`/konsultasi-advokat/${room.id}`}
                  className="block bg-navy-light/40 border border-putih/20 hover:border-gold/30 hover:bg-navy-light/60 transition-all rounded-2xl p-5 group"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    {!isAdvocate && room.advocate?.photo_url ? (
                      <div className="w-14 h-14 rounded-full overflow-hidden relative border border-putih/20 shrink-0">
                        <Image src={room.advocate.photo_url} alt="Advocate" fill className="object-cover" sizes="56px" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                        {isAdvocate ? <User className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg truncate group-hover:text-gold transition-colors">
                          {partnerName}
                        </h3>
                        {latestMessage && (
                          <span className="text-xs text-putih/40 shrink-0">
                            {new Date(latestMessage.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-putih/60 truncate mb-2">
                        {latestMessage ? latestMessage.content : "Belum ada pesan."}
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          isActive 
                            ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-400" : "bg-red-400"}`} />
                          {isActive ? "Sesi Aktif" : "Sesi Selesai"}
                        </span>
                        
                        {isActive && (
                          <span className="text-xs text-putih/40 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            s/d {new Date(room.expires_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 p-3 bg-putih/5 rounded-xl group-hover:bg-gold group-hover:text-navy transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

