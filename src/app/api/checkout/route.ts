import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import { createClient } from '@/lib/supabase/server';
import { getPlanPrice } from '@/lib/pricing';

// We instantiate snap inside the handler to ensure env vars are loaded.

export async function POST(request: Request) {
  try {
    // Verify authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planName, amount, userEmail, userName } = await request.json();

    if (!planName || amount === undefined || amount === null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (amount === 0) {
      return NextResponse.json({ token: 'free' });
    }

    // Validate price on server to prevent client-side price tampering
    let expectedPrice: number | null = null;
    if (planName.toLowerCase().includes("top-up kuota")) {
      const match = planName.match(/\((\d+)\s+token\)/i);
      const tokenCount = match ? parseInt(match[1], 10) : 0;
      if (tokenCount < 4) {
        return NextResponse.json({ error: 'Minimal pembelian Top-Up Kuota adalah 4 token.' }, { status: 400 });
      }
      expectedPrice = tokenCount * 5000;
    } else {
      const isAnnual = planName.toLowerCase().includes('tahunan') || planName.toLowerCase().includes('annual');
      expectedPrice = getPlanPrice(planName, isAnnual);
    }

    if (expectedPrice === null || expectedPrice !== Number(amount)) {
      return NextResponse.json({ 
        error: 'Nominal pembayaran tidak valid atau tidak sesuai dengan tarif resmi paket.' 
      }, { status: 400 });
    }


    const snap = new midtransClient.Snap({
      isProduction: !process.env.MIDTRANS_SERVER_KEY?.startsWith('SB-'),
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
    });

    // Generate a unique order_id for transactions table
    const orderId = `INV-${Date.now()}-${user.id.substring(0, 8)}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount
      },
      customer_details: {
        first_name: userName || 'Customer',
        email: userEmail || 'customer@example.com'
      },
      item_details: [{
        id: `PLAN-${planName.replace(/[\s\(\)]+/g, '-').substring(0, 30).toUpperCase()}`,
        price: amount,
        quantity: 1,
        name: `KonsultanAI - ${planName}`.substring(0, 50)
      }]
    };

    const transaction = await snap.createTransaction(parameter);
    
    // Save to transactions table
    const { error: insertError } = await supabase
      .from('transactions')
      .insert({
        order_id: orderId,
        user_id: user.id,
        plan_name: planName,
        amount: amount,
        status: 'PENDING',
        snap_token: transaction.token
      });

    if (insertError) {
      console.error('Failed to save transaction to DB:', insertError);
      // We can throw or continue, but better to return error if we can't save it
      return NextResponse.json({ error: 'Failed to initialize transaction record' }, { status: 500 });
    }

    return NextResponse.json({
      token: transaction.token,
      orderId: orderId
    });

  } catch (error: any) {
    console.error('Midtrans API Error:', error);
    const errorMessage = error?.message || error?.ApiResponse?.message || JSON.stringify(error) || 'Failed to create transaction';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
