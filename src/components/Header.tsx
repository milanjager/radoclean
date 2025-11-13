import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Menu, X } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2
              className={`text-xl md:text-2xl font-bold transition-colors ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
            >
              Prémiový Úklid
            </h2>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("pricing")}
              className={`font-medium transition-colors hover:text-primary ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
            >
              Spočítat cenu
            </button>
            <button
              onClick={() => scrollToSection("team")}
              className={`font-medium transition-colors hover:text-primary ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
            >
              Seznamte se s námi
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className={`font-medium transition-colors hover:text-primary ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
            >
              Reference
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className={`font-medium transition-colors hover:text-primary ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
            >
              Časté otázky
            </button>
            <a
              href="tel:+420777888999"
              className={`flex items-center gap-2 text-lg font-bold transition-colors hover:text-primary ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
            >
              <Phone className="w-5 h-5" />
              +420 777 888 999
            </a>
            <Button
              variant={isScrolled ? "premium" : "hero"}
              onClick={() => scrollToSection("contact")}
            >
              Rezervovat
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? "text-foreground" : "text-white"} />
            ) : (
              <Menu className={isScrolled ? "text-foreground" : "text-white"} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3 bg-background rounded-xl p-4 shadow-lg">
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-foreground font-medium text-left py-2 hover:text-primary transition-colors"
            >
              Spočítat cenu
            </button>
            <button
              onClick={() => scrollToSection("team")}
              className="text-foreground font-medium text-left py-2 hover:text-primary transition-colors"
            >
              Seznamte se s námi
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-foreground font-medium text-left py-2 hover:text-primary transition-colors"
            >
              Reference
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-foreground font-medium text-left py-2 hover:text-primary transition-colors"
            >
              Časté otázky
            </button>
            <a
              href="tel:+420777888999"
              className="flex items-center gap-2 text-foreground font-semibold py-3 px-4 rounded-xl bg-accent/10 hover:bg-accent/20 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="text-lg">+420 777 888 999</span>
            </a>
            <Button
              variant="premium"
              className="mt-2"
              onClick={() => scrollToSection("contact")}
            >
              Rezervovat termín
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
