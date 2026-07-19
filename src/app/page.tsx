import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import { Suspense, lazy } from "react";
import AuthTrigger from "@/components/auth/AuthTrigger";
import dynamic from "next/dynamic";

// Lazy-load below-the-fold sections to reduce initial JS bundle
const UserGuideSection = dynamic(() => import("@/components/sections/UserGuideSection"));
const StatsSection = dynamic(() => import("@/components/sections/StatsSection"));
const HowItWorks = dynamic(() => import("@/components/sections/HowItWorks"));
const Features = dynamic(() => import("@/components/sections/Features"));
const DemoSection = dynamic(() => import("@/components/sections/DemoSection"));
const PricingSection = dynamic(() => import("@/components/sections/PricingSection"));
const FAQSection = dynamic(() => import("@/components/sections/FAQSection"));
const Footer = dynamic(() => import("@/components/layout/Footer"));

export default function Home() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={null}>
        <AuthTrigger />
      </Suspense>
      <Navbar />
      <HeroSection />
      <UserGuideSection />
      <StatsSection />
      <HowItWorks />
      <Features />
      <DemoSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
