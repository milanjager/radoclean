import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import QuickPricing from "@/components/QuickPricing";
import StreetFinder from "@/components/StreetFinder";
import Benefits from "@/components/Benefits";
import PricingConfigurator from "@/components/PricingConfigurator";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import Guarantee from "@/components/Guarantee";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import StickyCalculator from "@/components/StickyCalculator";
import NeighborhoodDiscount from "@/components/NeighborhoodDiscount";

const Index = () => {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <Hero />
      <TrustBadges />
      <QuickPricing />
      <StreetFinder />
      <Benefits />
      <PricingConfigurator />
      <NeighborhoodDiscount />
      <Team />
      <Testimonials />
      <Guarantee />
      <FAQ />
      <Contact />
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
      <StickyMobileCTA />
      <StickyCalculator />
    </div>
  );
};

export default Index;
