import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "AI Legal Assistant Indonesia - Konsultan Hukum Cerdas",
  description: "Platform konsultasi hukum berbasis AI yang membantu masyarakat Indonesia memahami permasalahan hukum di berbagai bidang, mulai dari pidana, perdata, ketenagakerjaan, hingga hukum bisnis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-navy text-putih">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <script 
          type="text/javascript"
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        ></script>
      </body>
    </html>
  );
}
