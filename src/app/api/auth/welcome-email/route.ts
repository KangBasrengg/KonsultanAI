import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// JagoanHosting SMTP transporter (same config as payment-proof route)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.konsultan-ai.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'admin@konsultan-ai.com',
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { email, fullName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Verify the email exists in our users table and was created recently (within last 15 mins)
    // This prevents the endpoint from being used as an open email relay
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('created_at')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      console.warn(`[WelcomeEmail] Attempted to send to unregistered email: ${email}`);
      return NextResponse.json({ success: true }); // Fake success to prevent enumeration
    }

    const createdTime = new Date(userData.created_at).getTime();
    const now = Date.now();
    const fifteenMinutes = 15 * 60 * 1000;

    if (now - createdTime > fifteenMinutes) {
      console.warn(`[WelcomeEmail] Attempted to send to old account: ${email}`);
      return NextResponse.json({ success: true }); // Fake success
    }

    const displayName = fullName || email.split('@')[0];

    const mailOptions = {
      from: `"KonsultanAI" <${process.env.SMTP_USER || 'admin@konsultan-ai.com'}>`,
      to: email,
      subject: '🎉 Selamat Datang di KonsultanAI — Asisten Hukum AI Anda!',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0a1628; color: #ffffff; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #d4af37, #b8941f); padding: 32px; text-align: center;">
            <h1 style="margin: 0 0 8px; font-size: 28px; color: #0a1628; letter-spacing: -0.5px;">⚖️ KonsultanAI</h1>
            <p style="margin: 0; font-size: 14px; color: #0a1628cc;">Asisten Hukum AI Indonesia</p>
          </div>
          
          <!-- Body -->
          <div style="padding: 40px 32px;">
            <h2 style="margin: 0 0 16px; font-size: 22px; color: #ffffff;">
              Selamat Datang, ${displayName}! 🎉
            </h2>
            
            <p style="color: #c0c8d4; line-height: 1.7; font-size: 15px; margin-bottom: 24px;">
              Terima kasih telah mendaftar di <strong style="color: #d4af37;">konsultan-ai.com</strong>. 
              Kami sangat senang Anda bergabung bersama kami!
            </p>

            <p style="color: #c0c8d4; line-height: 1.7; font-size: 15px; margin-bottom: 32px;">
              Sekarang Anda bisa mendapatkan analisis hukum AI yang akurat, rekomendasi pasal-pasal relevan, 
              dan panduan langkah hukum — semua dalam hitungan detik.
            </p>

            <!-- Feature cards -->
            <div style="margin-bottom: 32px;">
              <div style="background: #111d33; border: 1px solid #1e3a5f; border-radius: 12px; padding: 20px; margin-bottom: 12px;">
                <p style="margin: 0; font-size: 14px;">
                  <span style="color: #d4af37; font-weight: bold;">🤖 Konsultasi AI</span><br/>
                  <span style="color: #8899aa;">Analisis kasus hukum real-time dengan AI yang menguasai seluruh bidang hukum Indonesia</span>
                </p>
              </div>
              <div style="background: #111d33; border: 1px solid #1e3a5f; border-radius: 12px; padding: 20px; margin-bottom: 12px;">
                <p style="margin: 0; font-size: 14px;">
                  <span style="color: #d4af37; font-weight: bold;">📚 Learning Center</span><br/>
                  <span style="color: #8899aa;">Modul edukasi hukum interaktif agar Anda lebih paham hak-hak Anda</span>
                </p>
              </div>
              <div style="background: #111d33; border: 1px solid #1e3a5f; border-radius: 12px; padding: 20px;">
                <p style="margin: 0; font-size: 14px;">
                  <span style="color: #d4af37; font-weight: bold;">⚖️ LegalKita UMKM</span><br/>
                  <span style="color: #8899aa;">Temukan advokat terpercaya sesuai spesialisasi dan wilayah Anda</span>
                </p>
              </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="https://konsultan-ai.com/intake" 
                 style="display: inline-block; background: linear-gradient(135deg, #d4af37, #b8941f); color: #0a1628; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; letter-spacing: 0.3px;">
                Mulai Konsultasi Pertama Anda →
              </a>
            </div>

            <!-- Free trial info -->
            <div style="background: #0d1f3c; border: 1px solid #d4af3730; border-radius: 12px; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 13px; color: #d4af37;">
                🎁 Akun gratis Anda sudah termasuk <strong>3x konsultasi AI</strong> per 3 hari.
              </p>
              <p style="margin: 8px 0 0; font-size: 12px; color: #8899aa;">
                Upgrade ke Premium untuk akses tanpa batas
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #060e1a; padding: 24px 32px; text-align: center;">
            <p style="margin: 0 0 8px; font-size: 12px; color: #4a5568;">
              © ${new Date().getFullYear()} KonsultanAI — Asisten Hukum AI Indonesia
            </p>
            <p style="margin: 0; font-size: 11px; color: #4a5568;">
              <a href="https://konsultan-ai.com" style="color: #d4af37; text-decoration: none;">konsultan-ai.com</a> 
              &nbsp;|&nbsp; 
              <a href="https://konsultan-ai.com/privacy-policy" style="color: #4a5568; text-decoration: none;">Privacy Policy</a>
              &nbsp;|&nbsp;
              <a href="https://konsultan-ai.com/terms-of-service" style="color: #4a5568; text-decoration: none;">Terms of Service</a>
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('[WelcomeEmail] Sent to:', email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[WelcomeEmail] Error:', error);
    // Don't expose internal errors to client — still return success 
    // because email failure shouldn't block registration
    return NextResponse.json({ success: true });
  }
}
