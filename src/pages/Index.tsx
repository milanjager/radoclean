import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustBadges from "@/components/TrustBadges";
import QuickPricing from "@/components/QuickPricing";
import StreetFinder from "@/components/StreetFinder";
import Benefits from "@/components/Benefits";
import HowItWorks from "@/components/HowItWorks";
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
import CertificationBadges from "@/components/CertificationBadges";
import RealtimeSocialProof from "@/components/RealtimeSocialProof";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import LocalService from "@/components/LocalService";
import VideoTestimonials from "@/components/VideoTestimonials";
import GoogleReviews from "@/components/GoogleReviews";
import CertificationsAwards from "@/components/CertificationsAwards";

const Index = () => {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      <Hero />
      <TrustBadges />
      <CertificationBadges />
      <LocalService />
      <BeforeAfterGallery />
      <HowItWorks />
      <QuickPricing />
      <StreetFinder />
      <Benefits />
      <PricingConfigurator />
      <NeighborhoodDiscount />
      <CertificationsAwards />
      <Team />
      <VideoTestimonials />
      <Testimonials />
      <GoogleReviews />
      <Guarantee />
      <FAQ />
      <Contact />
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
      <StickyMobileCTA />
      <StickyCalculator />
      <RealtimeSocialProof />
      <ExitIntentPopup />
    </div>
  );
};

export default Index;
