import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Verifikasi Keaslian Notifikasi (Signature Key)
    const hash = crypto.createHash('sha512');
    hash.update(`${body.order_id}${body.status_code}${body.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`);
    const signatureKey = hash.digest('hex');

    if (signatureKey !== body.signature_key) {
      return NextResponse.json({ error: 'Invalid signature key' }, { status: 403 });
    }

    // 2. Ambil data dari body notifikasi
    const orderId = body.order_id;
    const transactionStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;

    console.log(`Transaction notification received. Order ID: ${orderId}. Status: ${transactionStatus}`);

    // Jika ini adalah test webhook dari dashboard Midtrans, langsung kembalikan 200 OK
    if (orderId && typeof orderId === 'string' && orderId.startsWith('payment_notif_test')) {
      return NextResponse.json({ status: 'success', message: 'Test notification processed' });
    }

    // Initialize Supabase Admin Client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3. Logika Update Database berdasarkan status
    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      if (fraudStatus === 'accept' || !fraudStatus) {
        // Asumsi format order_id adalah `BOOKING-{id}` atau `SUB-{id}`
        if (orderId.startsWith('BOOKING-')) {
          const bookingId = orderId.split('-')[1];
          // Update status booking menjadi "paid"
          await supabase
            .from('consultation_bookings')
            .update({ status: 'paid' })
            .eq('id', bookingId);
            
          console.log(`Booking ${bookingId} marked as paid.`);
        }
      }
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      if (orderId.startsWith('BOOKING-')) {
        const bookingId = orderId.split('-')[1];
        await supabase
          .from('consultation_bookings')
          .update({ status: 'cancelled' })
          .eq('id', bookingId);
      }
      console.log('Payment failed, denied or expired.');
    }

    return NextResponse.json({ status: 'success', message: 'Notification processed' });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
