import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Phone } from "lucide-react";
import heroImage from "@/assets/hero-clean-room.jpg";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center pt-20">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/40" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-block mb-4 px-4 py-2 bg-accent/90 backdrop-blur-sm rounded-full">
            <span className="text-accent-foreground font-semibold text-sm">
              Působíme v Černošicích, Radotíně a Zbraslavi
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Prémiový úklid pro Radotín, Černošice a Zbraslav
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-white/95 mb-4 leading-relaxed">
            Bezpečný jako sousedská výpomoc, profesionální jako pětihvězdičkový hotel.
          </p>
          
          <div className="inline-block mb-8 px-6 py-3 bg-accent/95 backdrop-blur-sm rounded-2xl">
            <p className="text-accent-foreground font-bold text-lg md:text-xl">
              🏠 Od 1 800 Kč • ⏱️ Rezervace za 2 minuty • ✓ Záruka spokojenosti
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg group"
              onClick={() => scrollToSection("pricing")}
            >
              Spočítat cenu úklidu
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg bg-white/95 hover:bg-white border-0"
              onClick={() => scrollToSection("contact")}
            >
              <Calendar className="mr-2" />
              Nezávazná kalkulace
            </Button>
            
            <a href="tel:+420777888999" className="sm:hidden">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full text-lg bg-white/95 hover:bg-white border-0"
              >
                <Phone className="mr-2" />
                Zavolat teď
              </Button>
            </a>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                <span className="text-accent-foreground text-xs">✓</span>
              </div>
              <span>Pevné ceny bez dohadování</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                <span className="text-accent-foreground text-xs">✓</span>
              </div>
              <span>Online rezervace termínu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                <span className="text-accent-foreground text-xs">✓</span>
              </div>
              <span>Místní tým, který znáte</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
