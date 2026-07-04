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
  title: "KonsultanAI - Asisten Hukum AI Pertama di Indonesia",
  description: "Dapatkan analisis kasus, rekomendasi pasal, dan template dokumen hukum secara instan dan cerdas dengan KonsultanAI. Solusi legal yang cepat, tepat, dan terjangkau untuk seluruh masyarakat Indonesia.",
  keywords: ["Konsultan AI", "KonsultanAI", "AI Legal Assistant", "Konsultasi Hukum AI", "Hukum Indonesia", "Pengacara AI", "Konsultan Hukum Cerdas", "Bantuan Hukum Online"],
  authors: [{ name: "KonsultanAI Team" }],
  creator: "KonsultanAI",
  publisher: "KonsultanAI",
  openGraph: {
    title: "KonsultanAI - Asisten Hukum AI Pertama di Indonesia",
    description: "Dapatkan analisis kasus, rekomendasi pasal, dan template dokumen hukum secara instan dan cerdas dengan KonsultanAI.",
    url: "https://konsultan-ai.com",
    siteName: "KonsultanAI",
    images: [
      {
        url: "https://konsultan-ai.com/icon.png",
        width: 800,
        height: 800,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KonsultanAI - Asisten Hukum AI Pertama di Indonesia",
    description: "Dapatkan analisis kasus dan rekomendasi pasal secara instan dan cerdas dengan KonsultanAI.",
    images: ["https://konsultan-ai.com/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
        {/* Midtrans Snap - temporarily disabled, using static QRIS instead
        <script
          type="text/javascript"
          src={process.env.MIDTRANS_IS_PRODUCTION === 'true'
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js"}
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        ></script>
        */}
        {/* Structured Data for Google Search (Knowledge Graph / About this result) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "KonsultanAI",
              "alternateName": "Konsultan AI Indonesia",
              "url": "https://konsultan-ai.com",
              "logo": "https://konsultan-ai.com/icon.png",
              "description": "Platform Asisten Hukum AI Pertama di Indonesia yang memberikan analisis kasus, rekomendasi pasal, dan template dokumen hukum secara instan dan cerdas.",
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "muhammadnuril155@gmail.com",
                "contactType": "customer service",
                "availableLanguage": ["Indonesian", "English"]
              },
              "sameAs": [
                "https://konsultan-ai.com"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "KonsultanAI",
              "url": "https://konsultan-ai.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://konsultan-ai.com/learning?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
