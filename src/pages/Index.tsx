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
        title="Rado Clean — Profesionální úklid v Radotíně, Praze a okolí"
        description="Rado Clean — profesionální úklid domácností v Radotíně, Černošicích a Zbraslavi. Online rezervace za 2 minuty. Transparentní ceny od 1800 Kč."
        path="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Kolik stojí úklid domácnosti v Radotíně?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Ceny úklidu začínají od 1800 Kč za běžný úklid bytu. Generální úklid stojí od 2500 Kč a úklid po rekonstrukci od 3500 Kč. Všechny ceny jsou transparentní a konečné.",
                },
              },
              {
                "@type": "Question",
                name: "Jak si mohu rezervovat úklid?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Rezervaci můžete provést online za 2 minuty přímo na našem webu. Stačí vybrat balíček, datum a čas. Potvrzení obdržíte ihned na email.",
                },
              },
              {
                "@type": "Question",
                name: "V jakých oblastech poskytujete úklidové služby?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Poskytujeme úklidové služby v Radotíně, Černošicích, Zbraslavi, Dobřichovicích a okolí Prahy-západ.",
                },
              },
            ],
          },
        ]}
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
