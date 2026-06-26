import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Tanya Hukum UMKM | LegalKita",
  description: "Tanyakan masalah hak kerja, pajak UMKM, izin usaha, dan hukum bisnis lainnya. Dijawab instan oleh asisten hukum AI.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
