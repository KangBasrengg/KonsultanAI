"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    {
      q: "Apakah AI ini bisa menggantikan pengacara asli?",
      a: "Tidak. Aplikasi ini bukan pengganti pengacara profesional. Semua hasil AI hanya berupa edukasi dan rekomendasi awal berdasarkan data yang diberikan pengguna untuk membantu pemahaman hukum."
    },
    {
      q: "Apakah data dan kronologi kasus saya aman?",
      a: "Sangat aman. Kami menggunakan sistem enkripsi dan kami tidak akan pernah membagikan riwayat kasus Anda kepada pihak ketiga. Privasi Anda adalah prioritas kami."
    },
    {
      q: "Referensi hukum apa yang digunakan oleh AI?",
      a: "Sistem kami merujuk pada seluruh peraturan perundang-undangan Indonesia yang berlaku, termasuk KUHP Nasional terbaru (UU No. 1/2023), KUH Perdata, UU Ketenagakerjaan, UU ITE, UU Perlindungan Konsumen, dan berbagai regulasi sektoral lainnya yang selalu diperbarui."
    },
    {
      q: "Metode pembayaran apa saja yang didukung?",
      a: "Kami mendukung pembayaran QRIS otomatis yang terhubung ke rekening BCA, e-wallet, dan transfer bank. Akses premium Anda akan aktif seketika setelah pembayaran berhasil."
    }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-24 bg-navy">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Pertanyaan <span className="text-gold">Umum</span></h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-putih/20 rounded-2xl bg-navy-light/30 overflow-hidden">
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full text-left px-6 py-5 flex items-center justify-between font-semibold focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gold transition-transform duration-300 ${openIdx === idx ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-5 text-putih/70 text-sm leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

