import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShieldCheck } from "lucide-react";
import ScrollFadeIn from "@/components/ui/ScrollFadeIn";

export const metadata = {
  title: "Privacy Policy | KonsultanAI",
  description: "Kebijakan Privasi dan Perlindungan Data Pengguna KonsultanAI",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-6 py-24 md:py-32 max-w-4xl">
        <ScrollFadeIn className="bg-navy-light/30 border border-putih/20 p-8 md:p-12 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-navy border border-putih/20 flex items-center justify-center rounded-2xl shadow-lg">
              <ShieldCheck className="w-8 h-8 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-serif text-gold">Privacy Policy</h1>
              <p className="text-putih/60 mt-1">Terakhir diperbarui: 1 Juni 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-putih/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-putih mb-4">1. Pengumpulan Informasi</h2>
              <p>
                Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami saat mendaftar akun, termasuk namun tidak terbatas pada nama, alamat email, dan informasi profil. Selain itu, kami juga menyimpan riwayat kronologi masalah yang Anda masukkan untuk keperluan konsultasi hukum berbasis AI.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-putih mb-4">2. Penggunaan Data</h2>
              <p>
                Data yang kami kumpulkan digunakan secara eksklusif untuk:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Menyediakan layanan analisis hukum menggunakan kecerdasan buatan.</li>
                <li>Mempersonalisasi pengalaman Anda di platform KonsultanAI.</li>
                <li>Meningkatkan kualitas algoritma dan akurasi analisis hukum kami (secara anonim).</li>
                <li>Mengamankan akun Anda dari akses yang tidak sah.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-putih mb-4">3. Keamanan Data</h2>
              <p>
                KonsultanAI berkomitmen penuh menjaga kerahasiaan masalah hukum Anda. Seluruh transmisi data dienkripsi menggunakan protokol keamanan standar industri (SSL/HTTPS). Data Anda disimpan dengan aman menggunakan infrastruktur database Supabase yang terenkripsi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-putih mb-4">4. Kebijakan Pihak Ketiga & AI</h2>
              <p>
                KonsultanAI menggunakan layanan pihak ketiga (OpenAI / Freemodel) untuk memproses kronologi Anda. Meskipun kami telah memastikan standar keamanan tertinggi, kami menyarankan agar Anda <strong>tidak memasukkan data pribadi yang sangat sensitif</strong> (seperti nomor KTP, nomor rekening, atau nama lengkap pihak ketiga) ke dalam form kronologi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-putih mb-4">5. Perubahan Kebijakan</h2>
              <p>
                Kami berhak untuk memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan signifikan dengan mengirimkan email ke alamat email yang terkait dengan akun Anda atau dengan menempatkan pemberitahuan yang menonjol di situs kami.
              </p>
            </section>
          </div>
        </ScrollFadeIn>
      </div>

      <Footer />
    </main>
  );
}

