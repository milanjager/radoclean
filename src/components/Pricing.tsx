import { Button } from "@/components/ui/button";
import { Check, HelpCircle, BadgeCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
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
      name: "Malý byt (1+kk, 2+kk)",
      subtitle: "Do 60 m²",
      price: "2 800",
      features: [
        "Kompletní úklid všech místností",
        "Koupelna včetně vany/sprchy",
        "Kuchyň včetně spotřebičů",
        "Mytí oken zevnitř",
        "Doprava a čistící prostředky v ceně",
      ],
      popular: false,
    },
    {
      name: "Střední byt (3+kk, 4+kk)",
      subtitle: "60-100 m²",
      price: "3 500",
      features: [
        "Kompletní úklid všech místností",
        "Koupelna včetně vany/sprchy",
        "Kuchyň včetně spotřebičů",
        "Mytí oken zevnitř",
        "Doprava a čistící prostředky v ceně",
        "Balkon nebo terasa",
      ],
      popular: true,
    },
    {
      name: "Rodinný dům",
      subtitle: "100-150 m²",
      price: "4 500",
      features: [
        "Kompletní úklid všech místností",
        "2 koupelny včetně vany/sprchy",
        "Kuchyň včetně spotřebičů",
        "Mytí oken zevnitř",
        "Doprava a čistící prostředky v ceně",
        "Balkon, terasa nebo zahrada (základní)",
        "Schodiště",
      ],
      popular: false,
      note: "Domy nad 150 m² - individuální cenová nabídka",
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Jednoduché ceny
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Žádné kalkulačky za m². Žádné dohadování. Jen jasná cena, kterou vidíte hned.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <BadgeCheck className="w-4 h-4 mr-2" />
              Férové tržní ceny ověřené konkurencí
            </Badge>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <div 
              key={index}
              className={`relative bg-card rounded-2xl p-8 shadow-sm border-2 transition-all hover:shadow-lg ${
                pkg.popular ? 'border-primary scale-105' : 'border-border'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-6 py-1 rounded-full text-sm font-semibold">
                  Nejoblíbenější
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {pkg.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {pkg.subtitle}
              </p>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-foreground">
                  {pkg.price}
                </span>
                <span className="text-xl text-muted-foreground ml-2">Kč</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                    {feature.includes("základní") && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Úklid terasy/balkonu, zametení listí. Kompletní údržba zahrady za příplatek.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={pkg.popular ? "premium" : "default"} 
                className="w-full"
                size="lg"
                onClick={scrollToContact}
              >
                Objednat teď
              </Button>
              
              {pkg.note && (
                <p className="text-xs text-muted-foreground text-center mt-3">
                  {pkg.note}
                </p>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Potřebujete jiný typ úklidu?{" "}
            <button 
              onClick={scrollToContact}
              className="text-primary hover:underline font-semibold"
            >
              Napište nám
            </button>
            {" "}a připravíme nabídku na míru.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
