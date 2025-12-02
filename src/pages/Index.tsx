import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import HowItWorks from "@/components/HowItWorks";
import LocalService from "@/components/LocalService";
import ResultsWithPricing from "@/components/ResultsWithPricing";
import PricingConfigurator from "@/components/PricingConfigurator";
import ValueProposition from "@/components/ValueProposition";
import Team from "@/components/Team";
import GoogleReviews from "@/components/GoogleReviews";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import StickyCalculator from "@/components/StickyCalculator";
import LiveChatWidget from "@/components/LiveChatWidget";
import { PricingProvider } from "@/contexts/PricingContext";

const Index = () => {
  return (
    <PricingProvider>
      <div className="min-h-screen pb-20 md:pb-0">
        <Header />
        <Hero />
        <TrustBadges />
        <LocalService />
        <HowItWorks />
        <PricingConfigurator />
        <ResultsWithPricing />
        <ValueProposition />
        <Team />
        <GoogleReviews />
        <FAQ />
        <Contact />
        <Footer />
        <WhatsAppButton />
        <ScrollToTop />
        <StickyMobileCTA />
        <StickyCalculator />
        <LiveChatWidget />
      </div>
    </PricingProvider>
  );
};

export default Index;
