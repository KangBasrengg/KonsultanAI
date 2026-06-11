import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText } from "lucide-react";
import ScrollFadeIn from "@/components/ui/ScrollFadeIn";

export const metadata = {
  title: "Terms of Service | KonsultanAI",
  description: "Syarat dan Ketentuan Penggunaan Layanan KonsultanAI",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-6 py-24 md:py-32 max-w-4xl">
        <ScrollFadeIn className="bg-navy-light/30 border border-putih/20 p-8 md:p-12 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-navy border border-putih/20 flex items-center justify-center rounded-2xl shadow-lg">
              <FileText className="w-8 h-8 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-serif text-gold">Terms of Service</h1>
              <p className="text-putih/60 mt-1">Terakhir diperbarui: 1 Juni 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-putih/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-putih mb-4">1. Penerimaan Syarat</h2>
              <p>
                Dengan mengakses dan menggunakan situs web KonsultanAI, Anda setuju untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari persyaratan ini, Anda tidak diperkenankan menggunakan layanan kami.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-putih mb-4">2. Sifat Layanan (Disclaimer Legal)</h2>
              <div className="bg-kuning/10 border-l-4 border-kuning p-4 rounded-r-lg text-putih mb-4">
                <strong>Penting:</strong> KonsultanAI adalah asisten kecerdasan buatan dan <strong>BUKAN pengganti dari penasihat hukum profesional, advokat, atau pengacara bersertifikat.</strong>
              </div>
              <p>
                Analisis yang diberikan oleh KonsultanAI berdasarkan pada algoritma bahasa dan referensi peraturan perundang-undangan Indonesia. Hasil yang diberikan hanya bertujuan sebagai referensi awal dan panduan edukasi. Kami tidak bertanggung jawab atas kerugian atau konsekuensi hukum apa pun yang timbul akibat pengambilan keputusan berdasarkan hasil analisis platform ini.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-putih mb-4">3. Akun Pengguna</h2>
              <p>
                Untuk menggunakan layanan penuh, Anda harus membuat akun. Anda bertanggung jawab untuk menjaga kerahasiaan kata sandi Anda dan membatasi akses ke komputer atau perangkat Anda. Anda menyetujui tanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-putih mb-4">4. Pembatasan Penggunaan</h2>
              <p>
                Layanan ini disediakan dengan batasan penggunaan yang wajar. Tindakan membanjiri sistem (spamming), melakukan ekstraksi data otomatis (scraping), atau menggunakan layanan ini untuk tujuan melanggar hukum sangat dilarang dan dapat mengakibatkan pemblokiran akun secara permanen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-putih mb-4">5. Kebijakan Pembayaran (Premium)</h2>
              <p>
                Langganan Premium bersifat final dan tidak dapat dikembalikan (non-refundable), kecuali terdapat kendala teknis dari pihak KonsultanAI yang menyebabkan layanan tidak dapat digunakan sama sekali selama lebih dari 3x24 jam berturut-turut.
              </p>
            </section>
          </div>
        </ScrollFadeIn>
      </div>

      <Footer />
    </main>
  );
}

