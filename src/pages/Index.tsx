import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import Benefits from "@/components/Benefits";
import HowItWorks from "@/components/HowItWorks";
import LocalService from "@/components/LocalService";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import PricingConfigurator from "@/components/PricingConfigurator";
import WhyUs from "@/components/WhyUs";
import CertificationsAwards from "@/components/CertificationsAwards";
import Team from "@/components/Team";
import GoogleReviews from "@/components/GoogleReviews";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import StickyCalculator from "@/components/StickyCalculator";
import RealtimeSocialProof from "@/components/RealtimeSocialProof";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import LiveChatWidget from "@/components/LiveChatWidget";

const Index = () => {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <Hero />
      <TrustBadges />
      <Benefits />
      <LocalService />
      <BeforeAfterGallery />
      <HowItWorks />
      <PricingConfigurator />
      <WhyUs />
      <CertificationsAwards />
      <Team />
      <GoogleReviews />
      <FAQ />
      <Contact />
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
      <StickyMobileCTA />
      <StickyCalculator />
      <RealtimeSocialProof />
      <ExitIntentPopup />
      <LiveChatWidget />
    </div>
  );
};

export default Index;
