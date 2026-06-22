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
        behavior: "smooth"
      });
    }
  };
  return <section className="relative min-h-[85vh] flex items-center pt-20">
      {/* Video Background with poster image for fast LCP */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster={heroImage}
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/40" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-block mb-4 px-4 py-2 bg-accent/90 rounded-full">
            <span className="text-accent-foreground font-semibold text-sm">
              🏡 Váš místní úklidový partner v Radotíně a okolí
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight my-[57px] mb-[12px] lg:text-6xl">
            Cleaner Maniacs Prague — Profesionální úklid v Praze a Radotíně
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-white mb-4 leading-relaxed">
            Super úklid pro sousedy v Radotíně, Černošicích a Zbraslavi
          </p>
          
          <div className="inline-block mb-8 px-6 py-3 bg-accent/95 rounded-2xl mt-[62px]">
            <p className="text-accent-foreground font-bold text-lg md:text-xl">
              🏠 Od 1 800 Kč • ⏱️ Rezervace za 2 minuty • ✓ Záruka spokojenosti
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="lg" className="text-lg group shadow-lg hover:shadow-xl transition-all" onClick={() => scrollToSection("pricing")}>
              🔥 Rezervovat úklid TEĎ
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="outline" size="lg" className="text-lg bg-white/95 hover:bg-white text-primary hover:text-primary border-0 shadow-md hover:shadow-lg transition-all" onClick={() => scrollToSection("contact")}>
              <Calendar className="mr-2" />
              Spočítat cenu za 30 sekund
            </Button>
            
            <a href="tel:+420603425692" className="sm:hidden">
              <Button variant="outline" size="lg" className="w-full text-lg bg-white/95 hover:bg-white border-0">
                <Phone className="mr-2" />
                Zavolat teď
              </Button>
            </a>
          </div>
          
          <div className="flex flex-wrap gap-6 text-white mt-[76px]">
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
            
          </div>

          <p className="text-white text-sm mt-4">
            📞 <strong>Volat můžete i o víkendu</strong> - odpovídáme 7 dní v týdnu
          </p>
        </div>
      </div>
    </section>;
};
export default Hero;