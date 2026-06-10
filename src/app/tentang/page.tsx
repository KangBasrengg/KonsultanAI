import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Scale, BookOpen, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Tentang KonsultanAI | Platform Edukasi Hukum Indonesia",
  description: "Pelajari lebih lanjut tentang misi KonsultanAI dalam menjembatani akses informasi hukum untuk seluruh masyarakat Indonesia berdasarkan asas fiksi hukum.",
};

export default function TentangPage() {
  return (
    <main className="min-h-screen bg-navy text-putih flex flex-col">
      <Navbar />

      <div className="flex-1 container mx-auto px-6 py-24 md:py-32 max-w-5xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gold/10 border border-gold/30 rounded-3xl mb-6 shadow-lg shadow-gold/20">
            <Scale className="w-10 h-10 text-gold" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-putih mb-6">
            Mewujudkan Keadilan Melalui <span className="text-gold">Akses Informasi</span>
          </h1>
          <p className="text-xl text-putih/70 max-w-3xl mx-auto leading-relaxed">
            <strong className="text-putih font-bold">KonsultanAI</strong> adalah platform edukasi hukum yang menghadirkan kemudahan akses terhadap seluruh peraturan perundang-undangan Indonesia bagi masyarakat luas. Berlandaskan asas fiksi hukum bahwa setiap warga negara dianggap mengetahui hukum yang berlaku, platform ini berkomitmen mewujudkan kesetaraan akses informasi hukum sebagaimana diamanatkan Pasal 28F UUD 1945 dan UU Keterbukaan Informasi Publik. Informasi yang disajikan bersifat edukatif dan tidak menggantikan pendampingan hukum profesional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-navy-light/40 border border-putih/20 p-8 rounded-3xl backdrop-blur-sm relative overflow-hidden group hover:border-gold/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <BookOpen className="w-10 h-10 text-gold mb-6 relative z-10" />
            <h3 className="text-xl font-bold mb-4 text-putih relative z-10">Fiksi Hukum & Edukasi</h3>
            <p className="text-putih/70 leading-relaxed relative z-10 text-sm">
              Asas fiksi hukum (*presumptio iures de iure*) menyatakan bahwa setiap warga negara dianggap mengetahui hukum yang diundangkan. Tantangannya, peraturan perundang-undangan Indonesia sangat kompleks dan terus berkembang. Kami menjembatani jurang pemahaman ini dengan menyediakan akses dan penjelasan pasal-pasal secara praktis di berbagai bidang hukum. Asas fiksi hukum tidak lagi menjadi beban sepihak, melainkan hak yang difasilitasi dengan baik.
            </p>
          </div>

          <div className="bg-navy-light/40 border border-putih/20 p-8 rounded-3xl backdrop-blur-sm relative overflow-hidden group hover:border-gold/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <Scale className="w-10 h-10 text-gold mb-6 relative z-10" />
            <h3 className="text-xl font-bold mb-4 text-putih relative z-10">Landasan Konstitusional</h3>
            <p className="text-putih/70 leading-relaxed relative z-10 text-sm">
              Operasional platform ini didukung oleh UUD 1945 Pasal 28F (Hak memperoleh informasi) dan Pasal 28C (Hak pengembangan diri). Serta UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik yang mengamanatkan aksesibilitas informasi hukum bagi masyarakat luas, dan UU ITE yang memberikan landasan hukum kuat penyediaan layanan informasi berbasis digital.
            </p>
          </div>

          <div className="bg-navy-light/40 border border-putih/20 p-8 rounded-3xl backdrop-blur-sm relative overflow-hidden group hover:border-gold/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <ShieldCheck className="w-10 h-10 text-gold mb-6 relative z-10" />
            <h3 className="text-xl font-bold mb-4 text-putih relative z-10">Batasan Operasional</h3>
            <p className="text-putih/70 leading-relaxed relative z-10 text-sm">
              Semua konten dalam aplikasi disadur langsung dari teks Undang-Undang resmi tanpa tambahan interpretasi subjektif, serta dilengkapi disclaimer profesional. Aplikasi ini <strong>tidak menyediakan layanan bantuan hukum</strong> ataupun nasihat hukum untuk kasus spesifik. Fungsinya setara dengan kamus hukum digital sebagai media edukasi.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

