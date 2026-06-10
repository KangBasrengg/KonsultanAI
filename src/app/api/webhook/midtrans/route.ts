import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import crypto from 'crypto';
// import { createClient } from '@supabase/supabase-js'; // Digunakan nanti untuk update database

const core = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Verifikasi Keaslian Notifikasi (Signature Key)
    // Rumus: SHA512(order_id + status_code + gross_amount + ServerKey)
    const hash = crypto.createHash('sha512');
    hash.update(`${body.order_id}${body.status_code}${body.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`);
    const signatureKey = hash.digest('hex');

    if (signatureKey !== body.signature_key) {
      return NextResponse.json({ error: 'Invalid signature key' }, { status: 403 });
    }

    // 2. Ambil status transaksi dari Midtrans
    const transactionStatus = await core.transaction.notification(body);
    
    const orderId = transactionStatus.order_id;
    const transactionStatusStr = transactionStatus.transaction_status;
    const fraudStatus = transactionStatus.fraud_status;

    console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatusStr}. Fraud status: ${fraudStatus}`);

    // 3. Logika Update Database berdasarkan status
    if (transactionStatusStr == 'capture' || transactionStatusStr == 'settlement') {
      if (fraudStatus == 'challenge') {
        // TODO: Pembayaran perlu direview manual
        console.log('Payment challenged by FDS');
      } else if (fraudStatus == 'accept' || !fraudStatus) {
        // TODO: Pembayaran Sukses! Update database user (is_premium = true)
        console.log('Payment Success! User should be upgraded to Premium.');
        
        // Contoh kode untuk update Supabase (Anda perlu menyisipkan user_id di order_id atau custom_field midtrans)
        /*
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
        await supabase.from('users').update({ is_premium: true }).eq('email', body.customer_details.email);
        */
      }
    } else if (transactionStatusStr == 'cancel' || transactionStatusStr == 'deny' || transactionStatusStr == 'expire') {
      // TODO: Pembayaran gagal/batal/kedaluwarsa. Update status di database.
      console.log('Payment failed or expired.');
    } else if (transactionStatusStr == 'pending') {
      // TODO: Menunggu pembayaran
      console.log('Payment pending.');
    }

    // Selalu kembalikan status 200 OK ke Midtrans agar mereka berhenti mengulang webhook
    return NextResponse.json({ status: 'success', message: 'Notification processed' });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
