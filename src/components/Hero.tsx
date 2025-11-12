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
    <section className="relative min-h-[75vh] flex items-center pt-20">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-block mb-4 px-4 py-2 bg-accent/90 backdrop-blur-sm rounded-full">
            <span className="text-accent-foreground font-semibold text-sm">
              Působíme v Černošicích, Radotíně a Zbraslavi
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Vrátíme vám volné víkendy
          </h1>
          
          <p className="text-xl md:text-2xl text-white/95 mb-8 leading-relaxed">
            Prémiový úklid pro váš domov. Bez fotobankovitých slibů – jen skutečné výsledky a transparentní ceny.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg group"
              onClick={() => scrollToSection("pricing")}
            >
              Zjistit cenu
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg bg-white/95 hover:bg-white border-0"
              onClick={() => scrollToSection("contact")}
            >
              <Calendar className="mr-2" />
              Rezervovat termín
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
