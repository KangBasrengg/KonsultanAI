import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AlertTriangle } from "lucide-react";
import ScrollFadeIn from "@/components/ui/ScrollFadeIn";

export const metadata = {
  title: "Disclaimer | KonsultanAI",
  description: "Pernyataan Penyangkalan (Disclaimer) KonsultanAI",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-6 py-24 md:py-32 max-w-4xl">
        <ScrollFadeIn className="bg-navy-light/30 border border-putih/20 p-8 md:p-12 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-navy border border-putih/20 flex items-center justify-center rounded-2xl shadow-lg">
              <AlertTriangle className="w-8 h-8 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-serif text-gold">Disclaimer</h1>
              <p className="text-putih/60 mt-1">Terakhir diperbarui: 1 Juni 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-putih/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-putih mb-4">1. Bukan Nasihat Hukum Profesional</h2>
              <p>
                Semua informasi, teks, grafis, analisis, dan materi lain yang tersedia di KonsultanAI disediakan semata-mata untuk tujuan <strong>informasi dan edukasi umum</strong>. KonsultanAI adalah platform kecerdasan buatan dan <strong>TIDAK</strong> bertindak sebagai pengacara, kantor hukum, atau penyedia nasihat hukum profesional.
              </p>
              <p className="mt-4">
                Informasi yang dihasilkan oleh sistem kami tidak boleh dianggap sebagai pengganti dari nasihat, diagnosis, atau representasi hukum dari advokat yang berlisensi dan berkompeten di yurisdiksi Anda.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-putih mb-4">2. Akurasi dan Keterbaruan Informasi</h2>
              <p>
                Meskipun kami berusaha sebaik mungkin untuk melatih AI kami dengan data peraturan perundang-undangan Indonesia terbaru, hukum bersifat dinamis dan terus berubah. Kami <strong>tidak menjamin</strong> bahwa semua informasi yang disajikan selalu akurat, lengkap, atau mutakhir (up-to-date) dengan yurisprudensi atau undang-undang yang baru disahkan.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-putih mb-4">3. Tidak Ada Hubungan Pengacara-Klien</h2>
              <p>
                Penggunaan platform ini, termasuk pengiriman kronologi kasus dan penerimaan analisis AI, <strong>tidak menciptakan hubungan pengacara-klien (attorney-client relationship)</strong> antara Anda dengan KonsultanAI, pemilik, atau pengembangnya. Komunikasi antara Anda dan KonsultanAI tidak dilindungi oleh hak istimewa pengacara-klien (attorney-client privilege).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-putih mb-4">4. Batasan Tanggung Jawab (Limitation of Liability)</h2>
              <p>
                Dalam keadaan apa pun, KonsultanAI beserta tim pengembang, afiliasi, dan mitranya <strong>tidak bertanggung jawab</strong> atas segala kerugian langsung, tidak langsung, insidental, khusus, atau konsekuensial yang timbul dari:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Penggunaan atau ketidakmampuan untuk menggunakan layanan ini.</li>
                <li>Tindakan, keputusan, atau kelalaian yang Anda ambil berdasarkan informasi yang disediakan oleh platform kami.</li>
                <li>Setiap kesalahan, kelalaian, atau ketidakakuratan dalam konten analisis.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-putih mb-4">5. Rekomendasi Tindakan</h2>
              <p>
                Untuk masalah hukum yang spesifik, kompleks, atau membutuhkan tindakan litigasi, kami selalu menyarankan Anda untuk berkonsultasi langsung dengan advokat bersertifikat. Anda dapat menggunakan fitur <strong>Marketplace Advokat</strong> kami untuk menemukan praktisi hukum yang tepat untuk menangani kasus Anda secara profesional.
              </p>
            </section>
          </div>
        </ScrollFadeIn>
      </div>

      <Footer />
    </main>
  );
}
