"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, CheckCircle, AlertCircle, Loader2, QrCode, Copy, Check } from "lucide-react";
import Image from "next/image";

interface QRISPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  amount: number;
  chatId?: string;
  userEmail?: string;
  userName?: string;
  paymentType?: 'subscription' | 'booking' | 'listing';
  onSuccess?: () => void;
}

export default function QRISPaymentModal({
  isOpen,
  onClose,
  planName,
  amount,
  chatId,
  userEmail,
  userName,
  paymentType = 'subscription',
  onSuccess,
}: QRISPaymentModalProps) {
  const [step, setStep] = useState<'scan' | 'upload' | 'success'>('scan');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formattedAmount = `Rp ${amount.toLocaleString('id-ID')}`;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file maksimal 5MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmitProof = async () => {
    if (!imageFile) {
      setError('Silakan pilih foto bukti pembayaran');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Upload image to Supabase Storage
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Silakan login terlebih dahulu');

      const fileExt = imageFile.name.split('.').pop();
      const fileName = `payment-proof-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/payment-proofs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('chat-images')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      // Also send as a message in the chat (if chatId exists)
      if (chatId) {
        await supabase.from('messages').insert({
          chat_id: chatId,
          sender_id: user.id,
          content: `📎 Bukti Pembayaran untuk ${planName} (${formattedAmount})\n\nMohon diverifikasi. Terima kasih! 🙏`,
          image_url: imageUrl,
        });

        await supabase.from('chats').update({
          updated_at: new Date().toISOString(),
        }).eq('id', chatId);
      }

      // Send email notification to admin
      await fetch('/api/payment-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          planName,
          amount,
          imageUrl,
          userEmail,
          userName,
          paymentType,
        }),
      });

      setStep('success');
    } catch (err: any) {
      console.error('Payment proof upload error:', err);
      setError(err.message || 'Gagal mengunggah bukti pembayaran. Silakan coba lagi.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(amount.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    if (step === 'success' && onSuccess) {
      onSuccess();
    }
    setStep('scan');
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-navy-dark border border-putih/20 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-putih/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-putih">Pembayaran QRIS</h2>
                  <p className="text-xs text-putih/50">{planName}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-putih/5 hover:bg-putih/10 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-putih/60" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === 'scan' && (
                <div className="space-y-6">
                  {/* Amount */}
                  <div className="bg-navy/50 border border-putih/10 rounded-2xl p-4 text-center">
                    <p className="text-xs text-putih/50 mb-1">Total Pembayaran</p>
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-2xl font-bold text-gold">{formattedAmount}</p>
                      <button 
                        onClick={handleCopyAmount}
                        className="p-1.5 rounded-lg bg-putih/5 hover:bg-putih/10 transition-colors"
                        title="Salin nominal"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-putih/50" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* QRIS Image */}
                  <div className="bg-white rounded-2xl p-4 flex items-center justify-center">
                    <div className="relative w-full aspect-square max-w-[320px]">
                      <Image
                        src="/images/QRIS.jpeg"
                        alt="QRIS Payment QR Code - Hood Tech"
                        fill
                        className="object-contain rounded-xl"
                        priority
                      />
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm">
                      <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold shrink-0">1</span>
                      <p className="text-putih/70">Buka aplikasi e-wallet atau mobile banking Anda</p>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold shrink-0">2</span>
                      <p className="text-putih/70">Scan QR Code di atas dan masukkan nominal <strong className="text-gold">{formattedAmount}</strong></p>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <span className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold shrink-0">3</span>
                      <p className="text-putih/70">Setelah pembayaran berhasil, klik tombol di bawah untuk upload bukti</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => setStep('upload')}
                    className="w-full py-3.5 bg-gold text-navy font-bold rounded-xl hover:bg-gold-light transition-colors"
                  >
                    Sudah Bayar? Upload Bukti →
                  </button>
                </div>
              )}

              {step === 'upload' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gold mx-auto mb-3" />
                    <h3 className="font-bold text-putih text-lg">Upload Bukti Pembayaran</h3>
                    <p className="text-sm text-putih/50 mt-1">Screenshot halaman sukses pembayaran Anda</p>
                  </div>

                  {/* Upload Area */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                      imagePreview 
                        ? 'border-gold/50 bg-gold/5' 
                        : 'border-putih/20 hover:border-gold/30 hover:bg-putih/5'
                    }`}
                  >
                    {imagePreview ? (
                      <div className="space-y-3">
                        <img 
                          src={imagePreview} 
                          alt="Preview bukti pembayaran" 
                          className="max-h-48 mx-auto rounded-xl object-contain"
                        />
                        <p className="text-xs text-putih/50">Klik untuk ganti foto</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-10 h-10 text-putih/30 mx-auto" />
                        <p className="text-sm text-putih/50">Klik atau drag foto ke sini</p>
                        <p className="text-xs text-putih/30">JPG, PNG, WEBP (Maks. 5MB)</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setStep('scan'); setError(null); }}
                      className="flex-1 py-3 bg-putih/5 text-putih font-semibold rounded-xl hover:bg-putih/10 transition-colors border border-putih/10"
                    >
                      ← Kembali
                    </button>
                    <button
                      onClick={handleSubmitProof}
                      disabled={!imageFile || isUploading}
                      className="flex-1 py-3 bg-gold text-navy font-bold rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        'Kirim Bukti'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {step === 'success' && (
                <div className="text-center space-y-6 py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                  >
                    <CheckCircle className="w-20 h-20 text-green-400 mx-auto" />
                  </motion.div>
                  
                  <div>
                    <h3 className="font-bold text-xl text-putih mb-2">Bukti Pembayaran Terkirim! 🎉</h3>
                    <p className="text-sm text-putih/60 leading-relaxed">
                      Admin akan memverifikasi pembayaran Anda dalam <strong className="text-gold">1x24 jam</strong>. 
                      Setelah dikonfirmasi, layanan Anda akan segera aktif.
                    </p>
                  </div>

                  <div className="bg-navy/50 border border-green-500/20 rounded-2xl p-4 text-left space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-putih/50">Layanan</span>
                      <span className="text-putih font-semibold">{planName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-putih/50">Nominal</span>
                      <span className="text-gold font-bold">{formattedAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-putih/50">Status</span>
                      <span className="text-yellow-400 font-semibold">⏳ Menunggu Verifikasi</span>
                    </div>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full py-3.5 bg-gold text-navy font-bold rounded-xl hover:bg-gold-light transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
