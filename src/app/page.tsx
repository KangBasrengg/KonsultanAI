import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import HowItWorks from "@/components/sections/HowItWorks";
import Features from "@/components/sections/Features";
import DemoSection from "@/components/sections/DemoSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-navy text-putih">
      <Navbar />
      <HeroSection />
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
