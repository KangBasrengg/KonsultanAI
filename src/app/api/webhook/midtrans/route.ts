import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.konsultan-ai.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'admin@konsultan-ai.com',
    pass: process.env.SMTP_PASS,
  },
});

async function sendPaymentNotificationEmail(orderId: string, amount: string, type: string, detail: string) {
  const mailOptions = {
    from: `"KonsultanAI Payment" <${process.env.SMTP_USER || 'admin@konsultan-ai.com'}>`,
    to: process.env.ADMIN_EMAIL || 'muhammadnuril155@gmail.com',
    subject: `🔔 Pembayaran Berhasil (Otomatis) - ${type}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; background: #0a1628; color: #ffffff; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #d4af37, #b8941f); padding: 24px 32px;">
          <h1 style="margin: 0; font-size: 22px; color: #0a1628;">💸 Pembayaran Berhasil Masuk!</h1>
        </div>
        
        <div style="padding: 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; color: #8899aa; width: 140px;">Order ID</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; font-weight: bold; color: #ffffff;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; color: #8899aa;">Tipe</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; font-weight: bold; color: #d4af37;">${type}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; color: #8899aa;">Detail</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; font-weight: bold;">${detail}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; color: #8899aa;">Nominal</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; font-weight: bold; color: #4ade80; font-size: 18px;">Rp ${Number(amount || 0).toLocaleString('id-ID')}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; color: #8899aa;">Waktu</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f;">${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</td>
            </tr>
          </table>
          
          <div style="margin-top: 32px; padding: 16px; background: #1a2a4a; border-radius: 12px; border-left: 4px solid #d4af37;">
            <p style="margin: 0; font-size: 13px; color: #8899aa;">
              ✅ Sistem telah memproses pembayaran ini secara otomatis melalui Midtrans.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('[Email] Webhook success notification sent');
  } catch (error) {
    console.error('[Email] Failed to send webhook notification:', error);
  }
}

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
          
          // Kirim email notifikasi ke admin
          await sendPaymentNotificationEmail(orderId, body.gross_amount, 'Langganan Paket (Subscription)', chat.plan);
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
          
          // Kirim email notifikasi ke admin
          await sendPaymentNotificationEmail(orderId, body.gross_amount, 'Booking Advokat', `Booking ID: ${booking.id}`);
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
          
          // Kirim email notifikasi ke admin
          await sendPaymentNotificationEmail(orderId, body.gross_amount, 'Listing Marketplace', `Advokat ID: ${advocates[0].id}`);
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
        
        // Kirim email notifikasi ke admin
        await sendPaymentNotificationEmail(orderId, body.gross_amount, 'Legacy Booking', `Booking ID: ${bookingId}`);
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
