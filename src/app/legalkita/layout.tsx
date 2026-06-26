import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LegalKita - Asisten Hukum AI untuk UMKM | KonsultanAI",
  description: "LegalKita membantu UMKM Indonesia membuat kontrak kerja, perjanjian sewa, review dokumen hukum, dan tanya jawab regulasi secara instan menggunakan teknologi AI.",
  openGraph: {
    title: "LegalKita - Asisten Hukum AI untuk UMKM",
    description: "Buat kontrak dalam 2 menit, review risiko dokumen, dan konsultasi hukum instan. Khusus didesain untuk UMKM Indonesia.",
    type: "website",
    url: "https://konsultan-ai.com/legalkita",
  }
};

export default function LegalKitaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
