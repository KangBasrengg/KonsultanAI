import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import midtransClient from "midtrans-client";

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

    // 2. Strict Midtrans Payment Verification
    const targetOrderId = orderId || booking.payment_order_id;
    if (!targetOrderId) {
      return NextResponse.json({ error: "Order ID pembayaran tidak ditemukan." }, { status: 400 });
    }

    const snap = new midtransClient.Snap({
      isProduction: !process.env.MIDTRANS_SERVER_KEY?.startsWith('SB-'),
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    });

    try {
      const statusResponse = await snap.transaction.status(targetOrderId);
      const isPaid = (statusResponse.transaction_status === 'settlement' || statusResponse.transaction_status === 'capture')
        && (statusResponse.fraud_status === 'accept' || !statusResponse.fraud_status);

      if (!isPaid) {
        return NextResponse.json({ 
          error: `Pembayaran belum terkonfirmasi oleh Midtrans (Status saat ini: ${statusResponse.transaction_status || 'menunggu'}).` 
        }, { status: 402 });
      }
    } catch (midtransErr: any) {
      console.error("[Booking Confirm] Failed to verify Midtrans status:", midtransErr);
      return NextResponse.json({ 
        error: "Gagal memverifikasi status pembayaran ke Midtrans. Mohon tunggu beberapa saat lalu coba lagi." 
      }, { status: 400 });
    }

    // 3. Update booking status (with optimistic locking)
    const { error: updateErr } = await supabase
      .from("bookings")
      .update({ 
        payment_status: "paid", 
        status: "confirmed",
        payment_order_id: orderId || booking.payment_order_id,
        updated_at: new Date().toISOString()
      })
      .eq("id", bookingId)
      .eq("payment_status", "unpaid") // Prevent race condition
      .select()
      .single();

    if (updateErr) {
      if (updateErr.code === "PGRST116") {
        // No rows updated means it was already marked as paid by another concurrent request
        const { data: existingRoom } = await supabase.from("consultation_rooms").select("id").eq("booking_id", bookingId).single();
        return NextResponse.json({ roomId: existingRoom?.id, message: "Booking already confirmed" });
      }
      throw updateErr;
    }

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

    // 4. Update advocate balance atomically (prevents race condition with concurrent bookings)
    await supabase.rpc("add_advocate_earning", {
      p_advocate_id: booking.advocate_id,
      p_amount: booking.advocate_earning
    });

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
