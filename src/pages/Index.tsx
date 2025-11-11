import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Pricing from "@/components/Pricing";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import Guarantee from "@/components/Guarantee";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Benefits />
      <Pricing />
      <Team />
      <Testimonials />
      <Guarantee />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
