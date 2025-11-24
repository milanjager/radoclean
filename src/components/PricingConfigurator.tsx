import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, HelpCircle, Plus, Minus, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReservationForm from "./ReservationForm";

type PackageType = "small" | "medium" | "large";
type CategoryType = "standard" | "general" | "post-construction" | "post-moving" | "regular";
type FrequencyType = "weekly" | "biweekly" | "monthly" | null;

interface ExtraOption {
  id: string;
  label: string;
  price: number;
  tooltip?: string;
}

interface Category {
  id: CategoryType;
  name: string;
  description: string;
  priceMultiplier: number;
  icon: string;
}

interface FrequencyOption {
  id: FrequencyType;
  name: string;
  description: string;
  discount: number;
  icon: string;
}

const PricingConfigurator = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("standard");
  const [selectedPackage, setSelectedPackage] = useState<PackageType>("medium");
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [selectedFrequency, setSelectedFrequency] = useState<FrequencyType>(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  const frequencyOptions: FrequencyOption[] = [
    {
      id: "weekly",
      name: "Týdenní",
      description: "1x týdně - maximální úspora",
      discount: 0.20,
      icon: "📆"
    },
    {
      id: "biweekly",
      name: "Každé 2 týdny",
      description: "2x měsíčně - ideální volba",
      discount: 0.15,
      icon: "📅"
    },
    {
      id: "monthly",
      name: "Měsíční",
      description: "1x měsíčně - základní servis",
      discount: 0.10,
      icon: "🗓️"
    }
  ];

  const categories: Category[] = [
    {
      id: "standard",
      name: "Běžný úklid",
      description: "Pravidelný úklid pro udržení čistoty",
      priceMultiplier: 1,
      icon: "🏠"
    },
    {
      id: "general",
      name: "Generální úklid",
      description: "Hloubkové čištění všech prostorů",
      priceMultiplier: 1.5,
      icon: "✨"
    },
    {
      id: "post-construction",
      name: "Úklid po rekonstrukci",
      description: "Odstranění stavebního prachu a nečistot",
      priceMultiplier: 2,
      icon: "🔨"
    },
    {
      id: "post-moving",
      name: "Úklid po stěhování",
      description: "Kompletní úklid vyprázdněných prostor",
      priceMultiplier: 1.7,
      icon: "📦"
    },
    {
      id: "regular",
      name: "Pravidelný úklid",
      description: "Týdenní nebo měsíční servis se slevou",
      priceMultiplier: 0.85,
      icon: "📅"
    }
  ];

  const packages = {
    small: {
      name: "Malý byt (1+kk, 2+kk)",
      subtitle: "Do 60 m²",
      basePrice: 1890,
      features: [
        "Kompletní úklid všech místností",
        "Koupelna včetně vany/sprchy",
        "Kuchyň včetně spotřebičů",
        "Mytí oken zevnitř",
        "Doprava a čistící prostředky v ceně",
        "Fixní cena bez překvapení",
      ],
    },
    medium: {
      name: "Střední byt (3+kk, 4+kk)",
      subtitle: "60-100 m²",
      basePrice: 2890,
      features: [
        "Kompletní úklid všech místností",
        "Koupelna včetně vany/sprchy",
        "Kuchyň včetně spotřebičů",
        "Mytí oken zevnitř",
        "Doprava a čistící prostředky v ceně",
        "Balkon nebo terasa",
        "Místní firma - žádné dojezdné",
      ],
    },
    large: {
      name: "Rodinný dům / Generální",
      subtitle: "100-150 m²",
      basePrice: 4990,
      features: [
        "Kompletní úklid všech místností",
        "2 koupelny včetně vany/sprchy",
        "Kuchyň včetně spotřebičů a vyčištění trouby",
        "Mytí oken zevnitř i zvenku",
        "Doprava a čistící prostředky v ceně",
        "Balkon, terasa nebo zahrada (základní)",
        "Schodiště",
        "Kompletní servis bez starostí",
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
    const category = categories.find(c => c.id === selectedCategory);
    let basePrice = packages[selectedPackage].basePrice * (category?.priceMultiplier || 1);
    
    // Apply frequency discount if regular category and frequency is selected
    if (selectedCategory === "regular" && selectedFrequency) {
      const frequency = frequencyOptions.find(f => f.id === selectedFrequency);
      if (frequency) {
        basePrice = basePrice * (1 - frequency.discount);
      }
    }
    
    const extrasPrice = Array.from(selectedExtras).reduce((sum, extraId) => {
      const extra = extraOptions.find(e => e.id === extraId);
      return sum + (extra?.price || 0);
    }, 0);
    return Math.round(basePrice + extrasPrice);
  };

  const getBasePriceWithCategory = () => {
    const category = categories.find(c => c.id === selectedCategory);
    let basePrice = packages[selectedPackage].basePrice * (category?.priceMultiplier || 1);
    
    // Apply frequency discount if regular category and frequency is selected
    if (selectedCategory === "regular" && selectedFrequency) {
      const frequency = frequencyOptions.find(f => f.id === selectedFrequency);
      if (frequency) {
        basePrice = basePrice * (1 - frequency.discount);
      }
    }
    
    return Math.round(basePrice);
  };

  const getTotalDiscountPercentage = () => {
    const category = categories.find(c => c.id === selectedCategory);
    let totalDiscount = 0;
    
    if (category && category.priceMultiplier < 1) {
      totalDiscount += (1 - category.priceMultiplier);
    }
    
    if (selectedCategory === "regular" && selectedFrequency) {
      const frequency = frequencyOptions.find(f => f.id === selectedFrequency);
      if (frequency) {
        totalDiscount += frequency.discount;
      }
    }
    
    return totalDiscount;
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

  const isConfigurationComplete = () => {
    // For regular category, frequency must be selected
    if (selectedCategory === "regular" && !selectedFrequency) {
      return false;
    }
    return true;
  };

  const getProgressPercentage = () => {
    let steps = 3; // category, package, extras
    let completed = 1; // category always selected
    
    if (selectedCategory === "regular") {
      steps = 4; // add frequency step
      if (selectedFrequency) completed++;
    }
    
    completed++; // package always selected
    if (selectedExtras.size > 0) completed++;
    
    return Math.round((completed / steps) * 100);
  };

  return (
    <section id="pricing" className="py-20 bg-calculator scroll-mt-20" style={{ background: 'var(--calculator-gradient)' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Interaktivní kalkulačka ceny
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            Vyberte typ úklidu, balíček a přidejte extras. Finální cenu vidíte okamžitě – bez čekání na nabídku.
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Dokončeno</span>
              <span className="text-sm font-semibold text-primary">{getProgressPercentage()}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            1. Vyberte typ úklidu
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    // Reset frequency when changing category
                    if (category.id !== "regular") {
                      setSelectedFrequency(null);
                    }
                  }}
                  className={`text-center bg-card rounded-xl p-5 border-2 transition-all hover:shadow-md ${
                    isSelected 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h4 className="font-bold text-foreground mb-2">
                    {category.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {category.description}
                  </p>
                  {category.priceMultiplier !== 1 && (
                    <p className="text-xs font-semibold text-primary">
                      {category.priceMultiplier < 1 
                        ? `Sleva ${Math.round((1 - category.priceMultiplier) * 100)}%`
                        : `+${Math.round((category.priceMultiplier - 1) * 100)}%`
                      }
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Frequency Selection - Only for Regular Cleaning */}
        {selectedCategory === "regular" && (
          <div className="max-w-6xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              <h3 className="text-2xl font-bold text-foreground text-center">
                2. Vyberte frekvenci úklidu
              </h3>
              <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
                Povinné
              </span>
            </div>
            
            {!selectedFrequency && (
              <Alert className="mb-6 max-w-2xl mx-auto border-primary/50 bg-primary/5">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertDescription className="text-foreground">
                  Pro pravidelný úklid musíte vybrat frekvenci pro výpočet ceny a pokračování.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {frequencyOptions.map((frequency) => {
                const isSelected = selectedFrequency === frequency.id;
                
                return (
                  <button
                    key={frequency.id}
                    onClick={() => setSelectedFrequency(frequency.id)}
                    className={`text-center bg-card rounded-xl p-6 border-2 transition-all hover:shadow-md ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-4xl mb-3">{frequency.icon}</div>
                    <h4 className="font-bold text-foreground mb-2">
                      {frequency.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      {frequency.description}
                    </p>
                    <div className="inline-block bg-primary/10 text-primary text-sm font-bold px-3 py-1 rounded-full">
                      Extra sleva {Math.round(frequency.discount * 100)}%
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Package Selection */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            {selectedCategory === "regular" ? "3" : "2"}. Vyberte velikost prostoru
          </h3>
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
                  {(() => {
                    const category = categories.find(c => c.id === selectedCategory);
                    let price = pkg.basePrice * (category?.priceMultiplier || 1);
                    
                    if (selectedCategory === "regular" && selectedFrequency) {
                      const frequency = frequencyOptions.find(f => f.id === selectedFrequency);
                      if (frequency) {
                        price = price * (1 - frequency.discount);
                      }
                    }
                    
                    return Math.round(price);
                  })()} <span className="text-lg text-muted-foreground">Kč</span>
                </div>
                {(categories.find(c => c.id === selectedCategory)?.priceMultiplier !== 1 || 
                  (selectedCategory === "regular" && selectedFrequency)) && (
                  <p className="text-xs text-muted-foreground mt-1 line-through">
                    Základ: {pkg.basePrice} Kč
                  </p>
                )}
                {getTotalDiscountPercentage() > 0 && (
                  <p className="text-xs font-semibold text-primary mt-1">
                    Celkem sleva: {Math.round(getTotalDiscountPercentage() * 100)}%
                  </p>
                )}
              </button>
            );
          })}
          </div>
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
            {selectedCategory === "regular" ? "4" : "3"}. Přidat extras (volitelné)
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
          <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-2xl p-6 md:p-8 border-2 border-primary/30 shadow-lg">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1 w-full">
                <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">
                  Celková cena za úklid
                </p>
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                  {calculateTotalPrice().toLocaleString('cs-CZ')} <span className="text-xl md:text-2xl text-muted-foreground">Kč</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-background/50 rounded-lg p-3">
                    <p className="text-muted-foreground mb-1">Základní cena</p>
                    <p className="font-semibold text-foreground">{getBasePriceWithCategory()} Kč</p>
                  </div>
                  {selectedExtras.size > 0 && (
                    <div className="bg-background/50 rounded-lg p-3">
                      <p className="text-muted-foreground mb-1">Extras</p>
                      <p className="font-semibold text-foreground">+{
                        Array.from(selectedExtras).reduce((sum, extraId) => {
                          const extra = extraOptions.find(e => e.id === extraId);
                          return sum + (extra?.price || 0);
                        }, 0)
                      } Kč</p>
                    </div>
                  )}
                  {getTotalDiscountPercentage() > 0 && (
                    <div className="bg-primary/10 rounded-lg p-3 sm:col-span-2">
                      <p className="text-primary mb-1 font-medium">💰 Vaše úspora</p>
                      <p className="font-bold text-primary text-lg">
                        {Math.round(getTotalDiscountPercentage() * 100)}% 
                        <span className="text-sm font-normal ml-2">
                          ({Math.round(packages[selectedPackage].basePrice * getTotalDiscountPercentage())} Kč)
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-3 w-full lg:w-auto">
                <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="premium"
                      size="lg"
                      className="text-lg px-8 h-14 w-full lg:w-auto min-w-[200px] shadow-lg"
                      disabled={!isConfigurationComplete()}
                    >
                      ⚡ Rezervovat TEĎ • Zbývá {selectedPackage === 'medium' ? '2 volné dny' : 'omezená kapacita'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">
                        Dokončit rezervaci
                      </DialogTitle>
                      <DialogDescription>
                        Vyplňte prosím kontaktní údaje a upřesněte požadavky na úklid.
                      </DialogDescription>
                    </DialogHeader>
                    <ReservationForm
                      packageType={`${categories.find(c => c.id === selectedCategory)?.name} - ${selectedPackage}`}
                      basePrice={getBasePriceWithCategory()}
                      selectedExtras={Array.from(selectedExtras).map(id => {
                        const extra = extraOptions.find(e => e.id === id);
                        return { id, label: extra?.label || "", price: extra?.price || 0 };
                      })}
                      totalPrice={calculateTotalPrice()}
                      frequency={selectedFrequency ? frequencyOptions.find(f => f.id === selectedFrequency)?.name : undefined}
                    />
                  </DialogContent>
                </Dialog>
                
                {!isConfigurationComplete() && (
                  <p className="text-xs text-muted-foreground text-center lg:text-right">
                    ⚠️ Dokončete výběr frekvence
                  </p>
                )}
              </div>
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
