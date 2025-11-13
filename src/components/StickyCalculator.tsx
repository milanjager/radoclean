import { useState } from "react";
import { Calculator, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const StickyCalculator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] = useState(70);

  const calculatePrice = (sqm: number) => {
    // Base price: 18 Kč per m² + 300 Kč fixed
    return Math.round(sqm * 18 + 300);
  };

  const scrollToPricing = () => {
    const element = document.getElementById("pricing");
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Only - Hidden on mobile where sticky CTA exists */}
      <div className="hidden md:block fixed bottom-6 right-6 z-40">
        {!isOpen ? (
          <Button
            onClick={() => setIsOpen(true)}
            variant="premium"
            size="lg"
            className="rounded-full w-16 h-16 shadow-2xl hover:scale-110 transition-transform"
          >
            <Calculator className="w-7 h-7" />
          </Button>
        ) : (
          <div className="bg-card border-2 border-primary rounded-2xl shadow-2xl p-6 w-80 animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Rychlá kalkulace
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-foreground">
                    Velikost prostoru
                  </label>
                  <span className="text-2xl font-bold text-primary">
                    {size} m²
                  </span>
                </div>
                <Slider
                  value={[size]}
                  onValueChange={(value) => setSize(value[0])}
                  min={30}
                  max={200}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>30 m²</span>
                  <span>200 m²</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    Odhadovaná cena
                  </p>
                  <p className="text-4xl font-bold text-foreground">
                    {calculatePrice(size).toLocaleString('cs-CZ')} <span className="text-xl text-muted-foreground">Kč</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    * Běžný úklid, základní balíček
                  </p>
                </div>
              </div>

              <Button
                onClick={scrollToPricing}
                variant="premium"
                className="w-full"
                size="lg"
              >
                Podrobná kalkulace
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                💡 Tip: Pravidelný úklid ušetří až 20% ceny
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StickyCalculator;
