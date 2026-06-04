import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { createClient } from "@/lib/supabase/server";

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

// POST: Create a booking with payment
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { advocateId } = await request.json();
    if (!advocateId) return NextResponse.json({ error: "Missing advocateId" }, { status: 400 });

    // Get advocate info
    const { data: advocate } = await supabase.from("advocates").select("*").eq("id", advocateId).single();
    if (!advocate || advocate.verification_status !== "approved") {
      return NextResponse.json({ error: "Advocate not found" }, { status: 404 });
    }

    if (user.id === advocate.user_id) {
      return NextResponse.json({ error: "Anda tidak dapat memesan layanan Anda sendiri." }, { status: 400 });
    }

    // Get commission percent
    const { data: setting } = await supabase.from("platform_settings").select("value").eq("key", "commission_percent").single();
    const commissionPercent = setting ? parseInt(setting.value) : 10;

    const rate = advocate.consultation_rate;
    const platformFee = Math.round(rate * (commissionPercent / 100));
    const advocateEarning = rate - platformFee;

    // Create booking
    const { data: booking, error: bookErr } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        advocate_id: advocateId,
        consultation_rate: rate,
        platform_fee: platformFee,
        advocate_earning: advocateEarning,
        status: "pending",
        payment_status: "unpaid",
      })
      .select("id")
      .single();

    if (bookErr) throw bookErr;

    // Create Midtrans transaction
    const orderId = `BK-${Date.now()}-${booking.id.substring(0, 8)}`;
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: rate,
      },
      customer_details: {
        first_name: user.user_metadata?.full_name || "User",
        email: user.email || "user@example.com",
      },
      item_details: [{
        id: `CONSULT-${advocateId.substring(0, 8)}`,
        price: rate,
        quantity: 1,
        name: `Konsultasi: ${advocate.full_name}`,
      }],
    };

    const transaction = await snap.createTransaction(parameter);

    // Update booking with order id
    await supabase.from("bookings").update({ payment_order_id: orderId }).eq("id", booking.id);

    return NextResponse.json({
      token: transaction.token,
      orderId,
      bookingId: booking.id,
    });
  } catch (error: any) {
    console.error("Booking API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create booking" }, { status: 500 });
  }
}
