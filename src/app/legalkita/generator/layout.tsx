import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generator Kontrak AI | LegalKita",
  description: "Buat draft kontrak kerja PKWT, perjanjian sewa, jual-beli, dan kemitraan dalam 2 menit menggunakan AI yang mengerti hukum Indonesia.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
