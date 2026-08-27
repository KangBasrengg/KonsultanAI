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
      a: "Sistem kami merujuk pada seluruh peraturan perundang-undangan Indonesia yang berlaku, termasuk KUHP Nasional terbaru (UU No. 1/2023) beserta perbandingannya dengan KUHP Lama (WvS), KUHAP (UU No. 8/1981), KUH Perdata, UU Ketenagakerjaan, UU ITE, UU TPKS, UU Perlindungan Konsumen, dan berbagai regulasi sektoral lainnya yang selalu diperbarui."
    },
    {
      q: "Apakah limit token AI (Analisis & Konsultasi) memiliki waktu reset?",
      a: "Ya. Untuk menjaga kestabilan server, limit token AI akan otomatis di-reset setiap 2 hari (48 jam) dihitung sejak waktu penggunaan terakhir. Aturan ini berlaku untuk semua pengguna. Anda bisa mengecek sisa waktu reset di menu Pengaturan Akun."
    },
    {
      q: "Metode pembayaran apa saja yang didukung?",
      a: "Kami mendukung pembayaran otomatis melalui QRIS, GoPay, OVO, transfer bank, dan kartu kredit. Akses premium Anda akan aktif seketika setelah pembayaran berhasil."
    }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-putih">Pertanyaan <span className="text-gold">Umum</span></h2>
          <p className="text-putih/60 text-sm md:text-base">Hal-hal yang sering ditanyakan seputar layanan kami.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-putih/20 rounded-2xl bg-navy-light/30 overflow-hidden">
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full text-left px-6 py-5 flex items-center justify-between font-semibold focus:outline-none text-putih"
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

