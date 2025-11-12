import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, HelpCircle, Plus, Minus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReservationForm from "./ReservationForm";

type PackageType = "small" | "medium" | "large";

interface ExtraOption {
  id: string;
  label: string;
  price: number;
  tooltip?: string;
}

const PricingConfigurator = () => {
  const [selectedPackage, setSelectedPackage] = useState<PackageType>("medium");
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  const packages = {
    small: {
      name: "Malý byt (1+kk, 2+kk)",
      subtitle: "Do 60 m²",
      basePrice: 1800,
      features: [
        "Kompletní úklid všech místností",
        "Koupelna včetně vany/sprchy",
        "Kuchyň včetně spotřebičů",
        "Mytí oken zevnitř",
        "Doprava a čistící prostředky v ceně",
      ],
    },
    medium: {
      name: "Střední byt (3+kk, 4+kk)",
      subtitle: "60-100 m²",
      basePrice: 2500,
      features: [
        "Kompletní úklid všech místností",
        "Koupelna včetně vany/sprchy",
        "Kuchyň včetně spotřebičů",
        "Mytí oken zevnitř",
        "Doprava a čistící prostředky v ceně",
        "Balkon nebo terasa",
      ],
    },
    large: {
      name: "Rodinný dům",
      subtitle: "100-150 m²",
      basePrice: 3500,
      features: [
        "Kompletní úklid všech místností",
        "2 koupelny včetně vany/sprchy",
        "Kuchyň včetně spotřebičů",
        "Mytí oken zevnitř",
        "Doprava a čistící prostředky v ceně",
        "Balkon, terasa nebo zahrada (základní)",
        "Schodiště",
      ],
    },
  };

  const extraOptions: ExtraOption[] = [
    { 
      id: "dog", 
      label: "Mám psa nebo kočku", 
      price: 200,
      tooltip: "Extra čištění od chlupů + hypoalergenní prostředky"
    },
    { 
      id: "windows-outside", 
      label: "Mytí oken z vnější strany", 
      price: 400 
    },
    { 
      id: "deep-cleaning", 
      label: "Hloubkové čištění (po rekonstrukci)", 
      price: 800,
      tooltip: "Odstranění stavebního prachu, skvrn od barvy, intenzivní čištění"
    },
    { 
      id: "ironing", 
      label: "Žehlení prádla (cca 2 hodiny)", 
      price: 300 
    },
    { 
      id: "garden", 
      label: "Kompletní údržba zahrady", 
      price: 600,
      tooltip: "Sekání trávy, hrabání listí, údržba květinových záhonů"
    },
  ];

  const toggleExtra = (extraId: string) => {
    const newExtras = new Set(selectedExtras);
    if (newExtras.has(extraId)) {
      newExtras.delete(extraId);
    } else {
      newExtras.add(extraId);
    }
    setSelectedExtras(newExtras);
  };

  const calculateTotalPrice = () => {
    const basePrice = packages[selectedPackage].basePrice;
    const extrasPrice = Array.from(selectedExtras).reduce((sum, extraId) => {
      const extra = extraOptions.find(e => e.id === extraId);
      return sum + (extra?.price || 0);
    }, 0);
    return basePrice + extrasPrice;
  };

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

  return (
    <section id="pricing" className="py-20 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Interaktivní kalkulačka ceny
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Vyberte balíček a přidejte extras. Finální cenu vidíte okamžitě – bez čekání na nabídku.
          </p>
        </div>

        {/* Package Selection */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {(Object.keys(packages) as PackageType[]).map((key) => {
            const pkg = packages[key];
            const isSelected = selectedPackage === key;
            
            return (
              <button
                key={key}
                onClick={() => setSelectedPackage(key)}
                className={`text-left bg-card rounded-2xl p-6 border-2 transition-all hover:shadow-lg ${
                  isSelected 
                    ? 'border-primary shadow-lg scale-105' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {pkg.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {pkg.subtitle}
                </p>
                <div className="text-3xl font-bold text-foreground">
                  {pkg.basePrice} <span className="text-lg text-muted-foreground">Kč</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Package Details */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-card rounded-2xl p-8 border-2 border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Základní balíček zahrnuje:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {packages[selectedPackage].features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Extra Options */}
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            Přidat extras (volitelné)
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {extraOptions.map((extra) => {
              const isSelected = selectedExtras.has(extra.id);
              
              return (
                <div
                  key={extra.id}
                  onClick={() => toggleExtra(extra.id)}
                  className={`cursor-pointer bg-card rounded-xl p-5 border-2 transition-all hover:shadow-md ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      checked={isSelected}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">
                          {extra.label}
                        </span>
                        {extra.tooltip && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger onClick={(e) => e.stopPropagation()}>
                                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{extra.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <span className="text-lg font-bold text-primary">
                        +{extra.price} Kč
                      </span>
                    </div>
                    {isSelected ? (
                      <Minus className="w-5 h-5 text-primary" />
                    ) : (
                      <Plus className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total Price & CTA */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-2xl p-8 border-2 border-primary/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Celková cena
                </p>
                <div className="text-5xl font-bold text-foreground">
                  {calculateTotalPrice().toLocaleString('cs-CZ')} <span className="text-2xl text-muted-foreground">Kč</span>
                </div>
                {selectedExtras.size > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Základ: {packages[selectedPackage].basePrice} Kč + Extras: {
                      Array.from(selectedExtras).reduce((sum, extraId) => {
                        const extra = extraOptions.find(e => e.id === extraId);
                        return sum + (extra?.price || 0);
                      }, 0)
                    } Kč
                  </p>
                )}
              </div>
              <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="premium"
                    size="lg"
                    className="text-lg px-8 h-14"
                  >
                    Rezervovat termín
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">
                      Dokončit rezervaci
                    </DialogTitle>
                  </DialogHeader>
                  <ReservationForm
                    packageType={selectedPackage}
                    basePrice={packages[selectedPackage].basePrice}
                    selectedExtras={Array.from(selectedExtras).map(id => {
                      const extra = extraOptions.find(e => e.id === id);
                      return { id, label: extra?.label || "", price: extra?.price || 0 };
                    })}
                    totalPrice={calculateTotalPrice()}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Domy nad 150 m² nebo speciální požadavky?{" "}
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

export default PricingConfigurator;
