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

    console.log(`[Webhook] Order ID: ${orderId}, Status: ${transactionStatus}, Fraud: ${fraudStatus}`);

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
    const isSuccess = (transactionStatus === 'capture' || transactionStatus === 'settlement')
      && (fraudStatus === 'accept' || !fraudStatus);
    const isFailed = transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire';

    // --- ORD- : Subscription/Plan checkout (from /api/checkout) ---
    if (orderId.startsWith('ORD-')) {
      // Format: ORD-{timestamp}-{chatId_8char}
      const chatIdFragment = orderId.split('-').slice(2).join('-'); // 8 char fragment

      if (isSuccess) {
        // IDEMPOTENCY CHECK: Only process if the chat status is still 'open'
        // If Midtrans sends duplicate webhooks, subsequent ones will find no 'open' chat
        const { data: chats } = await supabase
          .from('chats')
          .select('id, user_id, plan')
          .like('id', `${chatIdFragment}%`)
          .eq('status', 'open')
          .limit(1);

        if (chats && chats.length > 0) {
          const chat = chats[0];
          
          // Update chat status
          await supabase.from('chats')
            .update({ status: 'resolved', updated_at: new Date().toISOString() })
            .eq('id', chat.id);

          // Upgrade user plan and set expiration date
          const isAnnual = chat.plan.toLowerCase().includes('tahunan') || chat.plan.toLowerCase().includes('annual');
          const daysToAdd = isAnnual ? 365 : 30;
          const expiresAt = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

          await supabase.from('users')
            .update({ 
              tier: chat.plan, 
              is_premium: chat.plan !== 'Free Trial',
              subscription_started_at: chat.plan !== 'Free Trial' ? new Date().toISOString() : null,
              subscription_expires_at: chat.plan !== 'Free Trial' ? expiresAt : null 
            })
            .eq('id', chat.user_id);

          console.log(`[Webhook] Subscription processed: user=${chat.user_id}, plan=${chat.plan}`);
        } else {
          console.log(`[Webhook] Idempotency skip: No matching 'open' chat found for ORD fragment: ${chatIdFragment}. Likely already processed.`);
        }
      } else if (isFailed) {
        console.log(`[Webhook] Subscription payment failed/expired for ${orderId}`);
      }
    }

    // --- BK- : Advocate booking (from /api/booking) ---
    else if (orderId.startsWith('BK-')) {
      // Format: BK-{timestamp}-{bookingId_8char}
      const bookingIdFragment = orderId.split('-').slice(2).join('-');

      if (isSuccess) {
        // IDEMPOTENCY CHECK: Only process if booking payment_status is still 'unpaid'
        const { data: bookings } = await supabase
          .from('bookings')
          .select('id, advocate_id, advocate_earning')
          .like('id', `${bookingIdFragment}%`)
          .eq('payment_status', 'unpaid')
          .limit(1);

        if (bookings && bookings.length > 0) {
          const booking = bookings[0];

          await supabase.from('bookings')
            .update({ payment_status: 'paid', status: 'confirmed', updated_at: new Date().toISOString() })
            .eq('id', booking.id);

          console.log(`[Webhook] Booking ${booking.id} marked as paid.`);
        } else {
          console.log(`[Webhook] Idempotency skip: Booking for ${bookingIdFragment} is already processed or not found.`);
        }
      } else if (isFailed) {
        const bookingIdFragment = orderId.split('-').slice(2).join('-');
        const { data: bookings } = await supabase
          .from('bookings')
          .select('id')
          .like('id', `${bookingIdFragment}%`)
          .limit(1);

        if (bookings && bookings.length > 0) {
          await supabase.from('bookings')
            .update({ payment_status: 'failed', status: 'cancelled' })
            .eq('id', bookings[0].id);
        }
        console.log(`[Webhook] Booking payment failed for ${orderId}`);
      }
    }

    // --- LST- : Advocate listing activation (from /api/listing) ---
    else if (orderId.startsWith('LST-')) {
      // Format: LST-{timestamp}-{advocateId_8char}
      const advocateIdFragment = orderId.split('-').slice(2).join('-');

      if (isSuccess) {
        // Get advocate
        const { data: advocates } = await supabase
          .from('advocates')
          .select('id')
          .like('id', `${advocateIdFragment}%`)
          .limit(1);

        if (advocates && advocates.length > 0) {
          const now = new Date();
          const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

          await supabase.from('advocates')
            .update({
              is_listed: true,
              listing_expires_at: expiresAt.toISOString(),
              updated_at: now.toISOString(),
            })
            .eq('id', advocates[0].id);

          console.log(`[Webhook] Listing activated for advocate ${advocates[0].id}`);
        }
      } else if (isFailed) {
        console.log(`[Webhook] Listing payment failed for ${orderId}`);
      }
    }

    // --- Legacy BOOKING- format (backward compatibility) ---
    else if (orderId.startsWith('BOOKING-')) {
      const bookingId = orderId.split('-')[1];
      if (isSuccess) {
        await supabase.from('consultation_bookings')
          .update({ status: 'paid' })
          .eq('id', bookingId);
        console.log(`[Webhook] Legacy booking ${bookingId} marked as paid.`);
      } else if (isFailed) {
        await supabase.from('consultation_bookings')
          .update({ status: 'cancelled' })
          .eq('id', bookingId);
      }
    }

    else {
      console.warn(`[Webhook] Unknown order ID format: ${orderId}`);
    }

    return NextResponse.json({ status: 'success', message: 'Notification processed' });

  } catch (error) {
    console.error('[Webhook] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
