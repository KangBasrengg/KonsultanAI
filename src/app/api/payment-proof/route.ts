import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@/lib/supabase/server';

// JagoanHosting SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.konsultan-ai.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true, // true for 465 (SSL)
  auth: {
    user: process.env.SMTP_USER || 'admin@konsultan-ai.com',
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      chatId, 
      planName, 
      amount, 
      imageUrl, 
      userEmail, 
      userName,
      paymentType // 'subscription' | 'booking' | 'listing'
    } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Bukti pembayaran diperlukan' }, { status: 400 });
    }

    try {
      const url = new URL(imageUrl);
      if (!url.hostname.includes('supabase.co')) {
        return NextResponse.json({ error: 'URL gambar tidak valid' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Format URL gambar tidak valid' }, { status: 400 });
    }

    // Format the amount for display
    const formattedAmount = amount 
      ? `Rp ${Number(amount).toLocaleString('id-ID')}` 
      : 'Belum ditentukan';

    const paymentTypeLabel = paymentType === 'booking' 
      ? 'Booking Advokat' 
      : paymentType === 'listing' 
      ? 'Listing Marketplace' 
      : 'Langganan Paket';

    // Send email notification to admin
    const mailOptions = {
      from: `"KonsultanAI Payment" <${process.env.SMTP_USER || 'admin@konsultan-ai.com'}>`,
      to: 'muhammadnuril155@gmail.com',
      subject: `🔔 Bukti Pembayaran Baru - ${paymentTypeLabel} ${planName || ''}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; background: #0a1628; color: #ffffff; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #d4af37, #b8941f); padding: 24px 32px;">
            <h1 style="margin: 0; font-size: 22px; color: #0a1628;">💰 Pembayaran Baru Masuk!</h1>
          </div>
          
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; color: #8899aa; width: 140px;">Tipe Pembayaran</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; font-weight: bold; color: #d4af37;">${paymentTypeLabel}</td>
              </tr>
              ${planName ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; color: #8899aa;">Plan / Layanan</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; font-weight: bold;">${planName}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; color: #8899aa;">Nominal</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; font-weight: bold; color: #4ade80; font-size: 18px;">${formattedAmount}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; color: #8899aa;">Pengirim</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f;">${userName || 'Unknown'} (${userEmail || '-'})</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; color: #8899aa;">User ID</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; font-size: 12px; font-family: monospace;">${user.id}</td>
              </tr>
              ${chatId ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; color: #8899aa;">Chat ID</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; font-size: 12px; font-family: monospace;">${chatId}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f; color: #8899aa;">Waktu</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #1e3a5f;">${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</td>
              </tr>
            </table>
            
            <div style="margin-top: 24px;">
              <p style="color: #8899aa; margin-bottom: 12px;">📸 Bukti Pembayaran:</p>
              <a href="${imageUrl}" target="_blank" style="display: inline-block; background: #1e3a5f; color: #d4af37; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                Lihat Bukti Pembayaran →
              </a>
            </div>
            
            <div style="margin-top: 32px; padding: 16px; background: #1a2a4a; border-radius: 12px; border-left: 4px solid #d4af37;">
              <p style="margin: 0; font-size: 13px; color: #8899aa;">
                ⚠️ Segera verifikasi pembayaran ini dan aktifkan layanan user melalui <a href="https://konsultan-ai.com/admin" style="color: #d4af37;">Admin Dashboard</a>.
              </p>
            </div>
          </div>
          
          <div style="background: #060e1a; padding: 16px 32px; text-align: center;">
            <p style="margin: 0; font-size: 11px; color: #4a5568;">KonsultanAI Payment Notification System</p>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('[PaymentProof] Email notification sent successfully');
    } catch (emailError) {
      // Don't fail the request if email fails, just log it
      console.error('[PaymentProof] Failed to send email notification:', emailError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Bukti pembayaran berhasil dikirim. Admin akan memverifikasi pembayaran Anda.' 
    });

  } catch (error) {
    console.error('[PaymentProof] Error:', error);
    return NextResponse.json({ error: 'Gagal mengirim bukti pembayaran' }, { status: 500 });
  }
}
