import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { GlobalThemeToggle } from "@/components/layout/GlobalThemeToggle";

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
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <GlobalThemeToggle />
          </AuthProvider>
        </ThemeProvider>
        <script 
          type="text/javascript"
          src={process.env.MIDTRANS_IS_PRODUCTION === 'true' 
            ? "https://app.midtrans.com/snap/snap.js" 
            : "https://app.sandbox.midtrans.com/snap/snap.js"}
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        ></script>
      </body>
    </html>
  );
}
