import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import { createClient } from '@/lib/supabase/server';

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
});

export async function POST(request: Request) {
  try {
    // Verify authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chatId, planName, userEmail, userName } = await request.json();

    if (!chatId || !planName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Normalize plan name to handle old data or case mismatches
    const normalizedPlan = (planName || '').toString().toLowerCase().trim();
    
    let price = 0;
    const isAnnual = normalizedPlan.includes('tahunan') || normalizedPlan.includes('annual');

    if (normalizedPlan.includes('basic')) {
      price = isAnnual ? 480000 : 49000;
    } else if (normalizedPlan.includes('pro') || normalizedPlan.includes('premium')) {
      price = isAnnual ? 1020000 : 99000;
    } else if (normalizedPlan.includes('enterprise')) {
      price = isAnnual ? 2100000 : 199000;
    } else if (normalizedPlan.includes('free') || normalizedPlan.includes('trial')) {
      price = 0;
    } else {
      return NextResponse.json({ error: `Invalid plan: ${planName}` }, { status: 400 });
    }
    
    if (price === 0) {
        return NextResponse.json({ token: 'free' });
    }

    // Midtrans order_id has a max length of 50 characters
    const orderId = `ORD-${Date.now()}-${chatId.substring(0, 8)}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price
      },
      customer_details: {
        first_name: userName || 'Customer',
        email: userEmail || 'customer@example.com'
      },
      item_details: [{
        id: `PLAN-${planName.replace(/\s+/g, '-').toUpperCase()}`,
        price: price,
        quantity: 1,
        name: `KonsultanAI - ${planName}`
      }]
    };

    const transaction = await snap.createTransaction(parameter);
    
    return NextResponse.json({
      token: transaction.token,
      orderId: orderId
    });

  } catch (error) {
    console.error('Midtrans API Error:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
