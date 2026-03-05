import HeroSection from "@/components/landing/HeroSection";
import IntegrationsSection from "@/components/landing/IntegrationsSection";
import SecuritySection from "@/components/landing/SecuritySection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <main className="bg-white min-h-screen relative overflow-x-hidden">
      <HeroSection />
      <IntegrationsSection />
      <SecuritySection />
      <HowItWorksSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
