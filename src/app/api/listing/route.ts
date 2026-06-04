import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { createClient } from "@/lib/supabase/server";

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

// POST: Activate listing (pay Rp50.000 for 30 days)
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get advocate
    const { data: advocate } = await supabase
      .from("advocates")
      .select("id, full_name, verification_status")
      .eq("user_id", user.id)
      .single();

    if (!advocate || advocate.verification_status !== "approved") {
      return NextResponse.json({ error: "Advocate not verified" }, { status: 403 });
    }

    // Get listing fee
    const { data: feeSetting } = await supabase.from("platform_settings").select("value").eq("key", "listing_fee").single();
    const listingFee = feeSetting ? parseInt(feeSetting.value) : 50000;

    const { data: durationSetting } = await supabase.from("platform_settings").select("value").eq("key", "listing_duration_days").single();
    const durationDays = durationSetting ? parseInt(durationSetting.value) : 30;

    const orderId = `LST-${Date.now()}-${advocate.id.substring(0, 8)}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: listingFee,
      },
      customer_details: {
        first_name: advocate.full_name,
        email: user.email || "advocate@example.com",
      },
      item_details: [{
        id: "LISTING-30D",
        price: listingFee,
        quantity: 1,
        name: `Listing Marketplace (${durationDays} hari)`,
      }],
    };

    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({
      token: transaction.token,
      orderId,
      advocateId: advocate.id,
      durationDays,
    });
  } catch (error: any) {
    console.error("Listing API Error:", error);
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
