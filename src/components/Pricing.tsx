import { Button } from "@/components/ui/button";
import { Check, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      name: "Byt 1+kk až 2+kk",
      price: "1 800",
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
      name: "Byt 3+kk až 4+kk",
      price: "2 500",
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
      price: "3 500",
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
              
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {pkg.name}
              </h3>
              
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
