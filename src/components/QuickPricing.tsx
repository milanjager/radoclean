import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const QuickPricing = () => {
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
  };

  const packages = [
    {
      name: "Start",
      subtitle: "Byt 1+kk, 2+kk",
      price: "1 800",
      features: [
        "Koupelna + kuchyň",
        "Mytí oken zevnitř",
        "Prostředky v ceně",
        "Doprava zdarma",
      ],
      popular: false,
    },
    {
      name: "Standard",
      subtitle: "Byt 3+kk, 4+kk",
      price: "2 500",
      features: [
        "Všechny místnosti",
        "Koupelna + kuchyň",
        "Mytí oken zevnitř",
        "Balkon/terasa",
        "Prostředky v ceně",
      ],
      popular: true,
    },
    {
      name: "Premium",
      subtitle: "Rodinný dům",
      price: "3 500",
      features: [
        "Celý dům do 150 m²",
        "2 koupelny",
        "Všechny místnosti",
        "Mytí oken",
        "Schodiště",
        "Zahrada (základní)",
      ],
      popular: false,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Transparentní ceny bez překvapení
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Žádné "cena na dotaz". Vidíte přesně, kolik zaplatíte. Vždy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative bg-card rounded-2xl p-8 border-2 transition-all hover:shadow-warm ${
                pkg.popular
                  ? "border-primary shadow-warm scale-105"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
                  Nejoblíbenější
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {pkg.name}
                </h3>
                <p className="text-sm text-muted-foreground">{pkg.subtitle}</p>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-foreground">
                    {pkg.price}
                  </span>
                  <span className="text-xl text-muted-foreground">Kč</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  za jednorázový úklid
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={scrollToPricing}
                variant={pkg.popular ? "premium" : "outline"}
                className="w-full"
                size="lg"
              >
                Vybrat balíček
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            💡 <strong>Pravidelný úklid?</strong> Ušetříte až 20% při týdenním nebo měsíčním servisu
          </p>
          <Button
            onClick={scrollToPricing}
            variant="ghost"
            className="text-primary hover:text-primary/80"
          >
            Podrobná kalkulace s extras →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default QuickPricing;
