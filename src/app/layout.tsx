import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Legal Assistant Indonesia - Konsultan Hukum Cerdas",
  description: "Platform konsultasi hukum berbasis AI yang membantu masyarakat Indonesia memahami permasalahan hukum berdasarkan KUHP terbaru.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-navy text-putih">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
