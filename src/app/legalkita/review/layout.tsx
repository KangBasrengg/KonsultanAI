import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Review Dokumen Hukum AI | LegalKita",
  description: "Upload atau tempel dokumen kontrak Anda. AI akan menganalisis risiko, menemukan celah hukum, dan memberikan rekomendasi perbaikan.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
