import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import HowItWorks from "@/components/HowItWorks";
import LocalService from "@/components/LocalService";
// import ResultsWithPricing from "@/components/ResultsWithPricing";
import PricingConfigurator from "@/components/PricingConfigurator";
import ValueProposition from "@/components/ValueProposition";
import GoogleReviews from "@/components/GoogleReviews";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Careers from "@/components/Careers";
import CompanyInfo from "@/components/CompanyInfo";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import StickyCalculator from "@/components/StickyCalculator";
import LiveChatWidget from "@/components/LiveChatWidget";
import { PricingProvider } from "@/contexts/PricingContext";
import ScrollBlurWrapper from "@/components/ScrollBlurWrapper";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SEO from "@/components/SEO";

const Index = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);
  return (
    <PricingProvider>
      <SEO
        title="Rado Clean — Úklid Radotín, Černošice, Zbraslav"
        description="Profesionální úklid domácností v Radotíně, Zbraslavi a Černošicích. Transparentní ceny od 1800 Kč. Online rezervace za 2 minuty."
        path="/"
      />
      <div className="min-h-screen pb-20 md:pb-0">
        <Header />
        <ScrollBlurWrapper>
          <Hero />
          <TrustBadges />
          <LocalService />
          <HowItWorks />
          <PricingConfigurator />
          {/* <ResultsWithPricing /> */}
          <ValueProposition />
          <GoogleReviews />
          <FAQ />
          <Careers />
          <Contact />
          <CompanyInfo />
          <Footer />
        </ScrollBlurWrapper>
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
