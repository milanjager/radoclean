import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, HelpCircle, Plus, Minus, AlertCircle, Sparkles, TrendingDown, Lightbulb, Star, Zap, Home, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { usePricing } from "@/contexts/PricingContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ReservationForm from "./ReservationForm";

type PackageType = "small" | "medium" | "large";
type CategoryType = "standard" | "general" | "post-construction" | "post-moving" | "regular";
type FrequencyType = "weekly" | "twice-weekly" | "biweekly" | "monthly" | null;
type UrgentType = "urgent-24h" | "weekend" | "evening" | null;
type WindowCountType = "1-3" | "4-6" | "7-10" | "11+" | null;
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

interface PopularPackage {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: CategoryType;
  packageSize: PackageType;
  extras: string[];
  windowCount?: WindowCountType;
  savings: number;
  badge?: string;
}
const PricingConfigurator = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedPackage,
    setSelectedPackage,
    selectedExtras,
    setSelectedExtras,
    selectedFrequency,
    setSelectedFrequency,
    hasOwnSupplies,
    setHasOwnSupplies,
    selectedUrgent,
    setSelectedUrgent,
    selectedWindowCount,
    setSelectedWindowCount,
    setTotalPrice,
    setEstimatedTime,
    setIsConfigurationComplete: setContextConfigComplete,
    triggerFlyAnimation,
  } = usePricing();
  
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const packageRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const frequencyOptions: FrequencyOption[] = [{
    id: "twice-weekly",
    name: "2x týdně",
    description: "Dvakrát týdně - maximální čistota",
    discount: 0.20,
    icon: "⭐"
  }, {
    id: "weekly",
    name: "1x týdně",
    description: "Jednou týdně - ideální volba",
    discount: 0.15,
    icon: "📆"
  }, {
    id: "biweekly",
    name: "1x za 14 dní",
    description: "Každé dva týdny",
    discount: 0.10,
    icon: "📅"
  }, {
    id: "monthly",
    name: "1x měsíčně",
    description: "Jednou měsíčně - základní servis",
    discount: 0.05,
    icon: "🗓️"
  }];

  const urgentOptions = [{
    id: "urgent-24h" as UrgentType,
    name: "Potřebuji do 24 hodin",
    description: "Express služba",
    multiplier: 1.30,
    icon: "⚡"
  }, {
    id: "weekend" as UrgentType,
    name: "Úklid o víkendu",
    description: "Sobota nebo neděle",
    multiplier: 1.20,
    icon: "📅"
  }, {
    id: "evening" as UrgentType,
    name: "Úklid večer (po 18:00)",
    description: "Večerní hodiny",
    multiplier: 1.15,
    icon: "🌙"
  }];

  const windowCountOptions = [{
    id: "1-3" as WindowCountType,
    name: "1-3 okna",
    price: 200
  }, {
    id: "4-6" as WindowCountType,
    name: "4-6 oken",
    price: 350
  }, {
    id: "7-10" as WindowCountType,
    name: "7-10 oken",
    price: 500
  }, {
    id: "11+" as WindowCountType,
    name: "11+ oken",
    price: 700
  }];

  const popularPackages: PopularPackage[] = [{
    id: "spring-cleaning",
    name: "Jarní úklid",
    description: "Komplexní úklid pro osvěžení domova",
    icon: "🌸",
    category: "general",
    packageSize: "medium",
    extras: ["oven-cleaning", "fridge-cleaning"],
    windowCount: "4-6",
    savings: 250,
    badge: "Nejoblíbenější"
  }, {
    id: "family-standard",
    name: "Rodinný standard",
    description: "Pro rodiny s dětmi a mazlíčky",
    icon: "👨‍👩‍👧‍👦",
    category: "standard",
    packageSize: "medium",
    extras: ["dog", "balcony-terrace", "dishes"],
    savings: 150
  }, {
    id: "premium-care",
    name: "Premium péče",
    description: "Luxusní úklid s organizací",
    icon: "✨",
    category: "general",
    packageSize: "large",
    extras: ["ironing", "carpet-cleaning", "organizing"],
    windowCount: "7-10",
    savings: 400,
    badge: "VIP"
  }];

  const competitorComparison = [
    { service: "Malý byt (do 60m²)", ours: 1890, competition: "2200-2400", status: "cheaper" },
    { service: "Střední byt (60-100m²)", ours: 2890, competition: "3500-3800", status: "cheaper" },
    { service: "Rodinný dům (100-150m²)", ours: 4990, competition: "5800-6200", status: "cheaper" },
    { service: "Generální úklid", ours: "+50%", competition: "+60-80%", status: "better" },
    { service: "Pravidelný úklid", ours: "až -20%", competition: "-10-15%", status: "better" }
  ];
  const categories: Category[] = [{
    id: "standard",
    name: "Běžný úklid",
    description: "Pravidelný úklid pro udržení čistoty",
    priceMultiplier: 1,
    icon: "🏠"
  }, {
    id: "general",
    name: "Generální úklid",
    description: "Hloubkové čištění všech prostorů",
    priceMultiplier: 1.5,
    icon: "✨"
  }, {
    id: "post-construction",
    name: "Úklid po rekonstrukci",
    description: "Odstranění stavebního prachu a nečistot",
    priceMultiplier: 2,
    icon: "🔨"
  }, {
    id: "post-moving",
    name: "Úklid po stěhování",
    description: "Kompletní úklid vyprázdněných prostor",
    priceMultiplier: 1.7,
    icon: "📦"
  }, {
    id: "regular",
    name: "Pravidelný úklid",
    description: "Týdenní nebo měsíční servis se slevou",
    priceMultiplier: 0.85,
    icon: "📅"
  }];
  const packages = {
    small: {
      name: "Malý byt (1+kk, 2+kk)",
      subtitle: "Do 60 m²",
      basePrice: 1890,
      features: ["Kompletní úklid všech místností", "Koupelna včetně vany/sprchy", "Kuchyň včetně spotřebičů", "Mytí oken zevnitř", "Doprava a čistící prostředky v ceně", "Fixní cena bez překvapení"]
    },
    medium: {
      name: "Střední byt (3+kk, 4+kk)",
      subtitle: "60-100 m²",
      basePrice: 2890,
      features: ["Kompletní úklid všech místností", "Koupelna včetně vany/sprchy", "Kuchyň včetně spotřebičů", "Mytí oken zevnitř", "Doprava a čistící prostředky v ceně", "Balkon nebo terasa", "Místní firma - žádné dojezdné"]
    },
    large: {
      name: "Rodinný dům / Generální",
      subtitle: "100-150 m²",
      basePrice: 4990,
      features: ["Kompletní úklid všech místností", "2 koupelny včetně vany/sprchy", "Kuchyň včetně spotřebičů a vyčištění trouby", "Mytí oken zevnitř i zvenku", "Doprava a čistící prostředky v ceně", "Balkon, terasa nebo zahrada (základní)", "Schodiště", "Kompletní servis bez starostí"]
    }
  };
  const extraOptions: ExtraOption[] = [{
    id: "dog",
    label: "Mám psa nebo kočku",
    price: 200,
    tooltip: "Extra čištění od chlupů + hypoalergenní prostředky"
  }, {
    id: "dishes",
    label: "Mytí nádobí",
    price: 150,
    tooltip: "Umytí a utření nádobí"
  }, {
    id: "trash",
    label: "Vynášení odpadků",
    price: 50,
    tooltip: "Vynést koše a vyměnit pytlíky"
  }, {
    id: "plants",
    label: "Zalévání květin",
    price: 50,
    tooltip: "Péče o pokojové rostliny"
  }, {
    id: "ironing",
    label: "Žehlení prádla (cca 2 hodiny)",
    price: 300,
    tooltip: "Vyžehlení a poskládání prádla"
  }, {
    id: "garden",
    label: "Kompletní údržba zahrady",
    price: 600,
    tooltip: "Sekání trávy, hrabání listí, údržba květinových záhonů"
  }, {
    id: "carpet-cleaning",
    label: "Čištění koberců a čalouněného nábytku",
    price: 500,
    tooltip: "Profesionální hloubkové čištění koberců a sedací soupravy"
  }, {
    id: "oven-cleaning",
    label: "Vyčištění trouby a grilu",
    price: 350,
    tooltip: "Důkladné odmastění a dezinfekce trouby"
  }, {
    id: "fridge-cleaning",
    label: "Čištění lednice a mrazáku",
    price: 250,
    tooltip: "Kompletní vyčištění, odmrazení a dezinfekce"
  }, {
    id: "balcony-terrace",
    label: "Velký balkon nebo terasa (nad 10 m²)",
    price: 450,
    tooltip: "Vymetení, umytí podlahy a čištění zábradlí"
  }, {
    id: "laundry",
    label: "Praní a sušení prádla",
    price: 400,
    tooltip: "Vypraní jedné várky prádla včetně sušení"
  }, {
    id: "organizing",
    label: "Organizace šatníku nebo skříní",
    price: 550,
    tooltip: "Přeskládání a uspořádání oblečení nebo kuchyňských skříní"
  }, {
    id: "basement-garage",
    label: "Sklep / garáž / půda",
    price: 300,
    tooltip: "Úklid vedlejších prostorů"
  }, {
    id: "wallpaper-cleaning",
    label: "Čištění tapetovaných stěn",
    price: 400,
    tooltip: "Šetrné čištění tapet a odstranění skvrn"
  }, {
    id: "walls-cleaning",
    label: "Čištění stěn a stropů (jedna místnost)",
    price: 600,
    tooltip: "Odstranění pavučin, skvrn a otisků ze stěn"
  }];
  const toggleExtra = (extraId: string) => {
    const newExtras = new Set(selectedExtras);
    if (newExtras.has(extraId)) {
      newExtras.delete(extraId);
    } else {
      newExtras.add(extraId);
    }
    setSelectedExtras(newExtras);
  };

  const applyPopularPackage = (pkg: PopularPackage) => {
    setSelectedCategory(pkg.category);
    setSelectedPackage(pkg.packageSize);
    setSelectedExtras(new Set(pkg.extras));
    if (pkg.windowCount) {
      setSelectedWindowCount(pkg.windowCount);
    }
    if (pkg.category === "regular") {
      setSelectedFrequency("weekly");
    }
  };

  const getSmartRecommendations = () => {
    const recommendations: string[] = [];
    
    // Based on package size
    if (selectedPackage === "large" && !selectedExtras.has("garden")) {
      recommendations.push("garden");
    }
    if (selectedPackage === "medium" && !selectedExtras.has("balcony-terrace")) {
      recommendations.push("balcony-terrace");
    }

    // Based on category
    if (selectedCategory === "general" && !selectedExtras.has("oven-cleaning")) {
      recommendations.push("oven-cleaning");
    }
    if (selectedCategory === "post-construction" && !selectedExtras.has("walls-cleaning")) {
      recommendations.push("walls-cleaning");
    }

    // Based on existing selections
    if (selectedExtras.has("dog") && !selectedExtras.has("carpet-cleaning")) {
      recommendations.push("carpet-cleaning");
    }
    if (selectedExtras.has("ironing") && !selectedExtras.has("laundry")) {
      recommendations.push("laundry");
    }

    // Return top 3 recommendations that aren't already selected
    return recommendations
      .filter(id => !selectedExtras.has(id))
      .slice(0, 3);
  };

  const calculateEstimatedTime = () => {
    // Base time for each package (in hours)
    const packageBaseTimes = {
      small: 2,
      medium: 3,
      large: 4.5,
    };

    // Category multipliers
    const categoryMultipliers = {
      standard: 1,
      general: 1.5,
      "post-construction": 2,
      "post-moving": 1.8,
      regular: 0.9, // Regular cleaning is faster
    };

    let totalTime = packageBaseTimes[selectedPackage] * categoryMultipliers[selectedCategory];

    // Add time for extras (in hours)
    const extraTimes: Record<string, number> = {
      dog: 0.5,
      dishes: 0.5,
      trash: 0.1,
      plants: 0.1,
      ironing: 2,
      garden: 2,
      "carpet-cleaning": 1.5,
      "oven-cleaning": 1,
      "fridge-cleaning": 0.5,
      "balcony-terrace": 1,
      laundry: 1.5,
      organizing: 2,
      "basement-garage": 1,
      "wallpaper-cleaning": 1.5,
      "walls-cleaning": 2,
    };

    selectedExtras.forEach((extraId) => {
      if (extraTimes[extraId]) {
        totalTime += extraTimes[extraId];
      }
    });

    // Add time for window cleaning
    if (selectedWindowCount) {
      const windowTimes: Record<string, number> = {
        "1-3": 0.5,
        "4-6": 1,
        "7-10": 1.5,
        "11+": 2,
      };
      totalTime += windowTimes[selectedWindowCount] || 0;
    }

    return Math.round(totalTime * 10) / 10; // Round to 1 decimal place
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

    // Apply urgent service multiplier
    if (selectedUrgent) {
      const urgent = urgentOptions.find(u => u.id === selectedUrgent);
      if (urgent) {
        basePrice = basePrice * urgent.multiplier;
      }
    }

    // Discount for own supplies
    let suppliesDiscount = 0;
    if (hasOwnSupplies) {
      suppliesDiscount = 200;
    }

    // Calculate extras price
    let extrasPrice = Array.from(selectedExtras).reduce((sum, extraId) => {
      const extra = extraOptions.find(e => e.id === extraId);
      return sum + (extra?.price || 0);
    }, 0);

    // Add window cleaning if selected
    if (selectedWindowCount) {
      const windowOption = windowCountOptions.find(w => w.id === selectedWindowCount);
      if (windowOption) {
        extrasPrice += windowOption.price;
      }
    }

    return Math.round(basePrice + extrasPrice - suppliesDiscount);
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

    // Apply urgent service multiplier
    if (selectedUrgent) {
      const urgent = urgentOptions.find(u => u.id === selectedUrgent);
      if (urgent) {
        basePrice = basePrice * urgent.multiplier;
      }
    }

    return Math.round(basePrice);
  };
  const getTotalSavingsAmount = () => {
    let savings = 0;
    
    // Own supplies discount
    if (hasOwnSupplies) {
      savings += 200;
    }

    // Frequency discount
    if (selectedCategory === "regular" && selectedFrequency) {
      const frequency = frequencyOptions.find(f => f.id === selectedFrequency);
      if (frequency) {
        savings += Math.round(packages[selectedPackage].basePrice * frequency.discount);
      }
    }

    return savings;
  };

  const getTotalSurchargesAmount = () => {
    const category = categories.find(c => c.id === selectedCategory);
    const basePrice = packages[selectedPackage].basePrice * (category?.priceMultiplier || 1);
    
    let surcharge = 0;
    
    // Urgent service surcharge
    if (selectedUrgent) {
      const urgent = urgentOptions.find(u => u.id === selectedUrgent);
      if (urgent) {
        surcharge += Math.round(basePrice * (urgent.multiplier - 1));
      }
    }

    return surcharge;
  };
  const scrollToContact = () => {
    const element = document.getElementById("contact");
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
  const isConfigurationComplete = () => {
    // For regular category, frequency must be selected
    if (selectedCategory === "regular" && !selectedFrequency) {
      return false;
    }
    return true;
  };

  // Update context whenever configuration changes
  useEffect(() => {
    const total = calculateTotalPrice();
    const time = calculateEstimatedTime();
    setTotalPrice(total);
    setEstimatedTime(time);
    setContextConfigComplete(isConfigurationComplete());
  }, [
    selectedCategory,
    selectedPackage,
    selectedExtras,
    selectedFrequency,
    hasOwnSupplies,
    selectedUrgent,
    selectedWindowCount,
  ]);
  // ===== Multi-step wizard =====
  const [currentStep, setCurrentStep] = useState(1);
  const [showPopular, setShowPopular] = useState(false);

  const totalSteps = 5;
  const stepTitles = [
    "Typ úklidu",
    "Velikost prostoru",
    "Doplňkové služby",
    "Termín & pomůcky",
    "Shrnutí & rezervace",
  ];

  const canProceed = () => {
    if (currentStep === 1) {
      if (selectedCategory === "regular" && !selectedFrequency) return false;
      return !!selectedCategory;
    }
    if (currentStep === 2) return !!selectedPackage;
    return true;
  };

  const goNext = () => {
    if (currentStep < totalSteps && canProceed()) {
      setCurrentStep(currentStep + 1);
      const el = document.getElementById("pricing");
      if (el) {
        const offset = 80;
        const pos = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: pos, behavior: "smooth" });
      }
    }
  };
  const goBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const applyPopularAndJump = (pkg: PopularPackage) => {
    applyPopularPackage(pkg);
    setCurrentStep(5);
  };

  return <section id="pricing" className="py-20 bg-calculator scroll-mt-20" style={{
    background: 'var(--calculator-gradient)'
  }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Interaktivní kalkulačka ceny
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Projděte pět rychlých kroků – finální cenu uvidíte na konci.
          </p>
        </div>

        {/* Popular Packages – discrete shortcut */}
        <div className="max-w-5xl mx-auto mb-4">
          <Collapsible open={showPopular} onOpenChange={setShowPopular}>
            <CollapsibleTrigger className="w-full flex items-center justify-between gap-3 bg-card/60 hover:bg-card border border-dashed border-border hover:border-primary/50 rounded-xl px-4 py-3 transition-all group">
              <div className="flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Nechce se vám konfigurovat? Vyberte hotový balíček</p>
                  <p className="text-xs text-muted-foreground">3 nejoblíbenější kombinace se slevou – jedním klikem hotovo</p>
                </div>
              </div>
              <ArrowRight className={`w-4 h-4 text-muted-foreground transition-transform ${showPopular ? 'rotate-90' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                {popularPackages.map(pkg => {
                  const basePrice = packages[pkg.packageSize].basePrice;
                  const category = categories.find(c => c.id === pkg.category);
                  let total = basePrice * (category?.priceMultiplier || 1);
                  pkg.extras.forEach(extraId => {
                    const extra = extraOptions.find(e => e.id === extraId);
                    if (extra) total += extra.price;
                  });
                  if (pkg.windowCount) {
                    const w = windowCountOptions.find(o => o.id === pkg.windowCount);
                    if (w) total += w.price;
                  }
                  const discountedPrice = Math.round(total - pkg.savings);
                  return (
                    <div key={pkg.id} className="relative bg-card rounded-2xl p-5 border-2 border-border hover:border-primary transition-all hover:shadow-lg">
                      {pkg.badge && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">{pkg.badge}</span>
                        </div>
                      )}
                      <div className="text-center mb-3">
                        <div className="text-4xl mb-2">{pkg.icon}</div>
                        <h4 className="text-lg font-bold text-foreground">{pkg.name}</h4>
                        <p className="text-xs text-muted-foreground">{pkg.description}</p>
                      </div>
                      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-3 mb-3 text-center">
                        <div className="text-2xl font-bold text-foreground">{discountedPrice.toLocaleString('cs-CZ')} Kč</div>
                        <p className="text-xs text-muted-foreground line-through">{Math.round(total).toLocaleString('cs-CZ')} Kč</p>
                        <p className="text-xs font-semibold text-primary">Ušetříte {pkg.savings} Kč</p>
                      </div>
                      <Button onClick={(e) => { applyPopularAndJump(pkg); triggerFlyAnimation(e.currentTarget, pkg.icon); }} variant="outline" className="w-full">
                        <Zap className="w-4 h-4 mr-2" /> Použít a pokračovat
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>


        {/* Wizard container */}
        <div className="max-w-5xl mx-auto bg-card rounded-2xl border-2 border-border shadow-sm p-6 md:p-8">
          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-foreground">Krok {currentStep} z {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{stepTitles[currentStep - 1]}</span>
            </div>
            <div className="flex gap-2 mb-4">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className={`flex-1 h-2 rounded-full transition-all ${i + 1 <= currentStep ? 'bg-gradient-to-r from-primary to-accent' : 'bg-muted'}`} />
              ))}
            </div>
            <div className="hidden md:flex justify-between">
              {stepTitles.map((t, i) => (
                <button
                  key={t}
                  onClick={() => { if (i + 1 < currentStep) setCurrentStep(i + 1); }}
                  className={`text-xs font-medium transition-colors ${i + 1 === currentStep ? 'text-primary' : i + 1 < currentStep ? 'text-foreground hover:text-primary cursor-pointer' : 'text-muted-foreground'}`}
                >
                  {i + 1}. {t}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 1 – Category + Frequency */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2 text-center">Jaký typ úklidu potřebujete?</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">Vyberte kategorii, která nejlépe odpovídá vaší situaci.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {categories.map(category => {
                  const isSelected = selectedCategory === category.id;
                  return (
                    <button key={category.id} onClick={() => {
                      setSelectedCategory(category.id);
                      if (category.id !== "regular") setSelectedFrequency(null);
                    }} className={`text-center bg-card rounded-xl p-4 border-2 transition-all hover:shadow-md ${isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/50'}`}>
                      <div className="text-3xl mb-2">{category.icon}</div>
                      <h4 className="font-bold text-foreground text-sm mb-1">{category.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{category.description}</p>
                      {category.priceMultiplier !== 1 && (
                        <p className="text-xs font-semibold text-primary">
                          {category.priceMultiplier < 1 ? `Sleva ${Math.round((1 - category.priceMultiplier) * 100)}%` : `+${Math.round((category.priceMultiplier - 1) * 100)}%`}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedCategory === "regular" && (
                <div className="mt-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <h4 className="text-lg font-bold text-foreground">Frekvence úklidu</h4>
                    <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">Povinné</span>
                  </div>
                  {!selectedFrequency && (
                    <Alert className="mb-4 border-primary/50 bg-primary/5">
                      <AlertCircle className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-foreground">Vyberte frekvenci pro získání slevy a pokračování.</AlertDescription>
                    </Alert>
                  )}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {frequencyOptions.map(frequency => {
                      const isSelected = selectedFrequency === frequency.id;
                      return (
                        <button key={frequency.id} onClick={() => setSelectedFrequency(frequency.id)} className={`text-center bg-card rounded-xl p-4 border-2 transition-all hover:shadow-md ${isSelected ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}`}>
                          <div className="text-3xl mb-2">{frequency.icon}</div>
                          <h4 className="font-bold text-foreground text-sm mb-1">{frequency.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{frequency.description}</p>
                          <div className="inline-block bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">Sleva {Math.round(frequency.discount * 100)}%</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 – Package */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2 text-center">Jak velký je váš prostor?</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">Vyberte velikost odpovídající vaší dispozici.</p>
              <div className="grid md:grid-cols-3 gap-4">
                {(Object.keys(packages) as PackageType[]).map(key => {
                  const pkg = packages[key];
                  const isSelected = selectedPackage === key;
                  const packageIcons: Record<PackageType, string> = { small: "🏠", medium: "🏡", large: "🏘️" };
                  return (
                    <button
                      key={key}
                      ref={(el) => { packageRefs.current[key] = el; }}
                      onClick={(e) => { setSelectedPackage(key); triggerFlyAnimation(e.currentTarget, packageIcons[key]); }}
                      className={`text-left bg-card rounded-2xl p-5 border-2 transition-all hover:shadow-lg ${isSelected ? 'border-primary shadow-lg scale-[1.02]' : 'border-border hover:border-primary/50'}`}>
                      <div className="text-3xl mb-2">{packageIcons[key]}</div>
                      <h3 className="text-lg font-bold text-foreground mb-1">{pkg.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{pkg.subtitle}</p>
                      <div className="text-2xl font-bold text-foreground">
                        {(() => {
                          const category = categories.find(c => c.id === selectedCategory);
                          let price = pkg.basePrice * (category?.priceMultiplier || 1);
                          if (selectedCategory === "regular" && selectedFrequency) {
                            const f = frequencyOptions.find(fr => fr.id === selectedFrequency);
                            if (f) price = price * (1 - f.discount);
                          }
                          return Math.round(price);
                        })()} <span className="text-base text-muted-foreground">Kč</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 bg-muted/30 rounded-xl p-5 border border-border">
                <h4 className="font-bold text-foreground mb-3">V základním balíčku najdete:</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {packages[selectedPackage].features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 – Extras + Windows */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2 text-center">Doplňkové služby</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">Vše volitelné – přidejte jen to, co potřebujete.</p>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-foreground mb-3">Mytí oken z vnější strany</h4>
                <RadioGroup value={selectedWindowCount || ""} onValueChange={(value) => setSelectedWindowCount(value as WindowCountType || null)}>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {windowCountOptions.map(option => {
                      const isSelected = selectedWindowCount === option.id;
                      return (
                        <div key={option.id} className={`cursor-pointer bg-card rounded-xl p-3 border-2 transition-all hover:shadow-md ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value={option.id} id={option.id} />
                            <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-foreground">{option.name}</span>
                                <span className="font-bold text-primary">+{option.price} Kč</span>
                              </div>
                            </Label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              </div>

              {getSmartRecommendations().length > 0 && (
                <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-foreground">Smart doporučení</h4>
                      <p className="text-xs text-muted-foreground">Často přidávané k vaší konfiguraci:</p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    {getSmartRecommendations().map(extraId => {
                      const extra = extraOptions.find(e => e.id === extraId);
                      if (!extra) return null;
                      return (
                        <button key={extraId} onClick={(e) => { toggleExtra(extraId); triggerFlyAnimation(e.currentTarget, "💡"); }}
                          className="flex items-center justify-between p-3 bg-background rounded-lg border-2 border-blue-300 dark:border-blue-700 hover:border-blue-500 transition-all">
                          <div className="flex items-center gap-2">
                            <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-semibold text-foreground">{extra.label}</span>
                          </div>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">+{extra.price} Kč</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <h4 className="text-lg font-semibold text-foreground mb-3">Ostatní doplňkové služby</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {extraOptions.map(extra => {
                  const isSelected = selectedExtras.has(extra.id);
                  return (
                    <div key={extra.id}
                      onClick={(e) => {
                        const wasSelected = selectedExtras.has(extra.id);
                        toggleExtra(extra.id);
                        if (!wasSelected) triggerFlyAnimation(e.currentTarget as HTMLElement, "✓");
                      }}
                      className={`cursor-pointer bg-card rounded-xl p-4 border-2 transition-all hover:shadow-md ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                      <div className="flex items-start gap-3">
                        <Checkbox checked={isSelected} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-foreground text-sm">{extra.label}</span>
                            {extra.tooltip && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger onClick={e => e.stopPropagation()}>
                                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent><p className="max-w-xs">{extra.tooltip}</p></TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <span className="font-bold text-primary">+{extra.price} Kč</span>
                        </div>
                        {isSelected ? <Minus className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-muted-foreground" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4 – Urgent + Own supplies */}
          {currentStep === 4 && (
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2 text-center">Termín a pomůcky</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">Volitelné – ovlivní cenu nahoru nebo dolů.</p>

              <h4 className="text-lg font-semibold text-foreground mb-3">Urgentní služba</h4>
              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                {urgentOptions.map(urgent => {
                  const isSelected = selectedUrgent === urgent.id;
                  return (
                    <button key={urgent.id} onClick={() => setSelectedUrgent(isSelected ? null : urgent.id)}
                      className={`text-center bg-card rounded-xl p-4 border-2 transition-all hover:shadow-md ${isSelected ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20 shadow-md' : 'border-border hover:border-orange-300'}`}>
                      <div className="text-3xl mb-2">{urgent.icon}</div>
                      <h4 className="font-bold text-foreground text-sm mb-1">{urgent.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{urgent.description}</p>
                      <div className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-bold px-2 py-1 rounded-full">+{Math.round((urgent.multiplier - 1) * 100)}%</div>
                    </button>
                  );
                })}
              </div>

              <h4 className="text-lg font-semibold text-foreground mb-3">Vlastní pomůcky</h4>
              <div
                onClick={() => setHasOwnSupplies(!hasOwnSupplies)}
                className={`cursor-pointer bg-card rounded-xl p-5 border-2 transition-all hover:shadow-md ${hasOwnSupplies ? 'border-green-500 bg-green-50 dark:bg-green-950/30' : 'border-border hover:border-green-300'}`}>
                <div className="flex items-start gap-3">
                  <Checkbox checked={hasOwnSupplies} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Mám vlastní čistící prostředky a pomůcky</span>
                      <span className="font-bold text-green-700 dark:text-green-400">-200 Kč</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">(hadry, mop, vysavač, základní saponáty)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5 – Summary + CTA */}
          {currentStep === 5 && (
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2 text-center">Shrnutí vaší kalkulace</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">Zkontrolujte přehled a pokračujte k rezervaci.</p>

              <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 rounded-2xl p-6 border-2 border-primary/30 mb-6">
                <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wide">Celková cena</p>
                <div className="text-5xl font-bold text-foreground mb-2">
                  {calculateTotalPrice().toLocaleString('cs-CZ')} <span className="text-2xl text-muted-foreground">Kč</span>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4" /> Odhadovaný čas: {calculateEstimatedTime()} h
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-background/60 rounded-lg p-3">
                    <p className="text-muted-foreground mb-1">Typ úklidu</p>
                    <p className="font-semibold text-foreground">{categories.find(c => c.id === selectedCategory)?.name}</p>
                  </div>
                  <div className="bg-background/60 rounded-lg p-3">
                    <p className="text-muted-foreground mb-1">Velikost</p>
                    <p className="font-semibold text-foreground">{packages[selectedPackage].name}</p>
                  </div>
                  <div className="bg-background/60 rounded-lg p-3">
                    <p className="text-muted-foreground mb-1">Základní cena</p>
                    <p className="font-semibold text-foreground">{getBasePriceWithCategory()} Kč</p>
                  </div>
                  {(selectedExtras.size > 0 || selectedWindowCount) && (
                    <div className="bg-background/60 rounded-lg p-3">
                      <p className="text-muted-foreground mb-1">Extras ({selectedExtras.size + (selectedWindowCount ? 1 : 0)})</p>
                      <p className="font-semibold text-foreground">+{(() => {
                        let extrasTotal = Array.from(selectedExtras).reduce((sum, id) => {
                          const e = extraOptions.find(x => x.id === id);
                          return sum + (e?.price || 0);
                        }, 0);
                        if (selectedWindowCount) {
                          const w = windowCountOptions.find(o => o.id === selectedWindowCount);
                          if (w) extrasTotal += w.price;
                        }
                        return extrasTotal;
                      })()} Kč</p>
                    </div>
                  )}
                  {getTotalSavingsAmount() > 0 && (
                    <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 border border-green-200 dark:border-green-800">
                      <p className="text-green-700 dark:text-green-300 mb-1 font-medium">💰 Úspora</p>
                      <p className="font-bold text-green-700 dark:text-green-300">-{getTotalSavingsAmount()} Kč</p>
                    </div>
                  )}
                  {getTotalSurchargesAmount() > 0 && (
                    <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                      <p className="text-orange-700 dark:text-orange-300 mb-1 font-medium">⚡ Příplatky</p>
                      <p className="font-bold text-orange-700 dark:text-orange-300">+{getTotalSurchargesAmount()} Kč</p>
                    </div>
                  )}
                </div>
              </div>

              <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
                <DialogTrigger asChild>
                  <Button data-reserve-button variant="premium" size="lg" className="w-full text-lg h-14 shadow-lg" disabled={!isConfigurationComplete()}>
                    ⚡ Rezervovat TEĎ
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Dokončit rezervaci</DialogTitle>
                    <DialogDescription>Vyplňte prosím kontaktní údaje a upřesněte požadavky na úklid.</DialogDescription>
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
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button variant="outline" onClick={goBack} disabled={currentStep === 1} className="min-w-[120px]">
              <ArrowLeft className="w-4 h-4 mr-2" /> Zpět
            </Button>

            <div className="text-center hidden sm:block">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Mezisoučet</p>
              <p className="text-xl font-bold text-foreground">{calculateTotalPrice().toLocaleString('cs-CZ')} Kč</p>
            </div>

            {currentStep < totalSteps ? (
              <Button onClick={goNext} disabled={!canProceed()} className="min-w-[120px]">
                Pokračovat <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <div className="min-w-[120px]" />
            )}
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-muted-foreground">
            Domy nad 150 m² nebo speciální požadavky?{" "}
            <button onClick={scrollToContact} className="text-primary hover:underline font-semibold">Napište nám</button>
            {" "}a připravíme nabídku na míru.
          </p>
        </div>
      </div>
    </section>;
};
export default PricingConfigurator;