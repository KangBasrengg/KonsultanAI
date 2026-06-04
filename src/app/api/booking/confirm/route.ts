import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST: Confirm payment & create consultation room
// Called from frontend after Midtrans onSuccess callback
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { bookingId, orderId } = await request.json();
    if (!bookingId) return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });

    // 1. Verify booking belongs to user
    const { data: booking, error: bookErr } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("user_id", user.id)
      .single();

    if (bookErr || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.payment_status === "paid") {
      // Already processed - find existing room
      const { data: existingRoom } = await supabase
        .from("consultation_rooms")
        .select("id")
        .eq("booking_id", bookingId)
        .single();

      return NextResponse.json({ 
        roomId: existingRoom?.id,
        message: "Booking already confirmed" 
      });
    }

    // 2. Update booking status
    const { error: updateErr } = await supabase
      .from("bookings")
      .update({ 
        payment_status: "paid", 
        status: "confirmed",
        payment_order_id: orderId || booking.payment_order_id,
        updated_at: new Date().toISOString()
      })
      .eq("id", bookingId);

    if (updateErr) throw updateErr;

    // 3. Create consultation room
    const { data: room, error: roomErr } = await supabase
      .from("consultation_rooms")
      .insert({
        booking_id: bookingId,
        user_id: user.id,
        advocate_id: booking.advocate_id,
        status: "active",
        // Set expiry to 7 days from now
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select("id")
      .single();

    if (roomErr) throw roomErr;

    // 4. Update advocate balance (add earning)
    const { data: currentAdvocate } = await supabase
      .from("advocates")
      .select("balance")
      .eq("id", booking.advocate_id)
      .single();

    if (currentAdvocate) {
      await supabase
        .from("advocates")
        .update({ 
          balance: currentAdvocate.balance + booking.advocate_earning 
        })
        .eq("id", booking.advocate_id);
    }

    // 5. Send initial system message
    // Get advocate's user_id for sender
    const { data: advocate } = await supabase
      .from("advocates")
      .select("user_id, full_name")
      .eq("id", booking.advocate_id)
      .single();

    if (room && advocate) {
      await supabase.from("consultation_messages").insert({
        room_id: room.id,
        sender_id: user.id,
        content: `📋 Sesi konsultasi telah dimulai.\n\n👤 Klien telah melakukan pembayaran dan ruang chat ini sekarang aktif.\n\n⏰ Sesi berlaku selama 7 hari.\n\nSilakan mulai konsultasi Anda.`
      });
    }

    return NextResponse.json({ 
      roomId: room.id,
      message: "Consultation room created successfully" 
    });
  } catch (error: any) {
    console.error("Confirm booking error:", error);
    return NextResponse.json({ error: error.message || "Failed to confirm booking" }, { status: 500 });
  }
}
