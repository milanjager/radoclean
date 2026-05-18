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
  const getProgressPercentage = () => {
    let steps = 3; // category, package, extras
    let completed = 1; // category always selected

    if (selectedCategory === "regular") {
      steps = 4; // add frequency step
      if (selectedFrequency) completed++;
    }
    completed++; // package always selected
    if (selectedExtras.size > 0) completed++;
    return Math.round(completed / steps * 100);
  };
  return <section id="pricing" className="py-20 bg-calculator scroll-mt-20" style={{
    background: 'var(--calculator-gradient)'
  }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Interaktivní kalkulačka ceny
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6 font-bold">Vyberte typ úklidu, balíček a přidejte extras. Finální cenu vidíte okamžitě – bez čekání na nabídku.</p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Dokončeno</span>
              <span className="text-sm font-semibold text-primary">{getProgressPercentage()}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out" style={{
              width: `${getProgressPercentage()}%`
            }} />
            </div>
          </div>
        </div>

        {/* Popular Packages Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Star className="w-4 h-4" />
              <span className="text-sm font-semibold">Nejoblíbenější volby</span>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-3">
              ⚡ Přednastavené balíčky
            </h3>
            <p className="text-muted-foreground">
              Ušetřete čas - vyberte si z našich osvědčených kombinací
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {popularPackages.map(pkg => {
              const basePrice = packages[pkg.packageSize].basePrice;
              const category = categories.find(c => c.id === pkg.category);
              let totalPrice = basePrice * (category?.priceMultiplier || 1);
              
              pkg.extras.forEach(extraId => {
                const extra = extraOptions.find(e => e.id === extraId);
                if (extra) totalPrice += extra.price;
              });
              
              if (pkg.windowCount) {
                const windowOption = windowCountOptions.find(w => w.id === pkg.windowCount);
                if (windowOption) totalPrice += windowOption.price;
              }
              
              const discountedPrice = Math.round(totalPrice - pkg.savings);
              
              return (
                <div
                  key={pkg.id}
                  className="relative bg-card rounded-2xl p-6 border-2 border-border hover:border-primary transition-all hover:shadow-lg group"
                >
                  {pkg.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                        {pkg.badge}
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3">{pkg.icon}</div>
                    <h4 className="text-xl font-bold text-foreground mb-2">
                      {pkg.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">
                        {category?.name} • {packages[pkg.packageSize].name}
                      </span>
                    </div>
                    {pkg.extras.map(extraId => {
                      const extra = extraOptions.find(e => e.id === extraId);
                      return extra ? (
                        <div key={extraId} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{extra.label}</span>
                        </div>
                      ) : null;
                    })}
                    {pkg.windowCount && (
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">
                          Mytí oken ({windowCountOptions.find(w => w.id === pkg.windowCount)?.name})
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-4 mb-4">
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-foreground">
                        {discountedPrice.toLocaleString('cs-CZ')} Kč
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground line-through">
                        Standardně: {Math.round(totalPrice).toLocaleString('cs-CZ')} Kč
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        Ušetříte {pkg.savings} Kč
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={(e) => {
                      applyPopularPackage(pkg);
                      triggerFlyAnimation(e.currentTarget, pkg.icon);
                    }}
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Použít tento balíček
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Comparison Section - COMMENTED OUT
        <div className="max-w-5xl mx-auto mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full mb-4">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm font-semibold">Transparentní ceny</span>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-3">
              Porovnání s konkurencí v Praze
            </h3>
            <p className="text-muted-foreground">
              Ověřte si sami - naše ceny jsou férové a konkurenceschopné
            </p>
          </div>

          <div className="bg-card rounded-2xl border-2 border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left p-4 font-semibold text-foreground">Služba</th>
                    <th className="text-center p-4 font-semibold text-foreground">Naše cena</th>
                    <th className="text-center p-4 font-semibold text-muted-foreground">Konkurence Praha</th>
                    <th className="text-center p-4 font-semibold text-foreground">Hodnocení</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorComparison.map((item, idx) => (
                    <tr key={idx} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4 text-foreground">{item.service}</td>
                      <td className="p-4 text-center">
                        <span className="font-bold text-primary text-lg">
                          {typeof item.ours === 'number' ? `${item.ours.toLocaleString('cs-CZ')} Kč` : item.ours}
                        </span>
                      </td>
                      <td className="p-4 text-center text-muted-foreground">
                        {typeof item.competition === 'string' && item.competition.includes('-') 
                          ? item.competition 
                          : `${item.competition} Kč`}
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                          <Check className="w-4 h-4" />
                          {item.status === 'cheaper' ? 'Levnější' : 'Lepší'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 text-center">
              <p className="text-sm text-foreground font-medium">
                💰 <strong>Průměrná úspora oproti konkurenci:</strong> 400-600 Kč na úklid
              </p>
            </div>
          </div>
        </div>
        */}

        {/* Savings Section - Own Supplies */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-green-700 dark:text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">💰 Ušetřete</h3>
                <p className="text-sm text-muted-foreground">Máte vlastní čistící pomůcky? Snižte cenu!</p>
              </div>
            </div>
            <div
              onClick={() => setHasOwnSupplies(!hasOwnSupplies)}
              className={`cursor-pointer bg-card rounded-xl p-5 border-2 transition-all hover:shadow-md ${
                hasOwnSupplies ? 'border-green-500 bg-green-50 dark:bg-green-950/30' : 'border-border hover:border-green-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox checked={hasOwnSupplies} className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      Mám vlastní čistící prostředky a pomůcky
                    </span>
                    <span className="text-lg font-bold text-green-700 dark:text-green-400">
                      -200 Kč
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    (hadry, mop, vysavač, základní saponáty)
                  </p>
                </div>
              </div>
            </div>
            {hasOwnSupplies && (
              <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-300 dark:border-green-700">
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  ✓ Ušetříte 200 Kč • Doneseme si jen speciální prostředky
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Urgent Services Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            2. Urgentní služby (volitelné)
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {urgentOptions.map(urgent => {
              const isSelected = selectedUrgent === urgent.id;
              return (
                <button
                  key={urgent.id}
                  onClick={() => setSelectedUrgent(isSelected ? null : urgent.id)}
                  className={`text-center bg-card rounded-xl p-5 border-2 transition-all hover:shadow-md ${
                    isSelected ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20 shadow-md' : 'border-border hover:border-orange-300'
                  }`}
                >
                  <div className="text-4xl mb-3">{urgent.icon}</div>
                  <h4 className="font-bold text-foreground mb-2">
                    {urgent.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    {urgent.description}
                  </p>
                  <div className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-bold px-3 py-1 rounded-full">
                    +{Math.round((urgent.multiplier - 1) * 100)}%
                  </div>
                </button>
              );
            })}
          </div>
          {selectedUrgent && (
            <div className="mt-4 text-center">
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                ⚠️ Příplatek za urgentní službu: +{getTotalSurchargesAmount()} Kč
              </p>
            </div>
          )}
        </div>

        {/* Category Selection */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            3. Vyberte typ úklidu
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categories.map(category => {
            const isSelected = selectedCategory === category.id;
            return <button key={category.id} onClick={() => {
              setSelectedCategory(category.id);
              // Reset frequency when changing category
              if (category.id !== "regular") {
                setSelectedFrequency(null);
              }
            }} className={`text-center bg-card rounded-xl p-5 border-2 transition-all hover:shadow-md ${isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/50'}`}>
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h4 className="font-bold text-foreground mb-2">
                    {category.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {category.description}
                  </p>
                  {category.priceMultiplier !== 1 && <p className="text-xs font-semibold text-primary">
                      {category.priceMultiplier < 1 ? `Sleva ${Math.round((1 - category.priceMultiplier) * 100)}%` : `+${Math.round((category.priceMultiplier - 1) * 100)}%`}
                    </p>}
                </button>;
          })}
          </div>
        </div>

        {/* Frequency Selection - Only for Regular Cleaning */}
        {selectedCategory === "regular" && <div className="max-w-6xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              <h3 className="text-2xl font-bold text-foreground text-center">
                4. Vyberte frekvenci úklidu
              </h3>
              <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
                Povinné
              </span>
            </div>
            
            {!selectedFrequency && <Alert className="mb-6 max-w-2xl mx-auto border-primary/50 bg-primary/5">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertDescription className="text-foreground">
                  Pro pravidelný úklid musíte vybrat frekvenci pro výpočet ceny a pokračování.
                </AlertDescription>
              </Alert>}
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {frequencyOptions.map(frequency => {
            const isSelected = selectedFrequency === frequency.id;
            return <button key={frequency.id} onClick={() => setSelectedFrequency(frequency.id)} className={`text-center bg-card rounded-xl p-6 border-2 transition-all hover:shadow-md ${isSelected ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20' : 'border-border hover:border-primary/50'}`}>
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
                  </button>;
          })}
            </div>
          </div>}

        {/* Package Selection */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            {selectedCategory === "regular" ? "5" : "4"}. Vyberte velikost prostoru
          </h3>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {(Object.keys(packages) as PackageType[]).map(key => {
            const pkg = packages[key];
            const isSelected = selectedPackage === key;
            const packageIcons: Record<PackageType, string> = {
              small: "🏠",
              medium: "🏡",
              large: "🏘️",
            };
            return <button 
                key={key} 
                ref={(el) => { packageRefs.current[key] = el; }}
                onClick={(e) => {
                  setSelectedPackage(key);
                  triggerFlyAnimation(e.currentTarget, packageIcons[key]);
                }} 
                className={`text-left bg-card rounded-2xl p-6 border-2 transition-all hover:shadow-lg ${isSelected ? 'border-primary shadow-lg scale-105' : 'border-border hover:border-primary/50'}`}>
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
                {(categories.find(c => c.id === selectedCategory)?.priceMultiplier !== 1 || selectedCategory === "regular" && selectedFrequency) && <p className="text-xs text-muted-foreground mt-1 line-through">
                    Základ: {pkg.basePrice} Kč
                  </p>}
              </button>;
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
              {packages[selectedPackage].features.map((feature, idx) => <div key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>)}
            </div>
          </div>
        </div>

        {/* Extra Options */}
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            {selectedCategory === "regular" ? "6" : "5"}. Přidat extras (volitelné)
          </h3>
          
          {/* Window Cleaning Section */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-foreground mb-4">Mytí oken z vnější strany</h4>
            <RadioGroup value={selectedWindowCount || ""} onValueChange={(value) => setSelectedWindowCount(value as WindowCountType || null)}>
              <div className="grid sm:grid-cols-2 gap-3">
                {windowCountOptions.map(option => {
                  const isSelected = selectedWindowCount === option.id;
                  return (
                    <div
                      key={option.id}
                      className={`cursor-pointer bg-card rounded-xl p-4 border-2 transition-all hover:shadow-md ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground">{option.name}</span>
                            <span className="text-lg font-bold text-primary">+{option.price} Kč</span>
                          </div>
                        </Label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
            {selectedWindowCount && (
              <div className="mt-3 p-3 bg-primary/10 rounded-lg">
                <p className="text-sm text-primary font-medium">
                  ✓ Přidáno mytí oken: {windowCountOptions.find(w => w.id === selectedWindowCount)?.name}
                </p>
              </div>
            )}
          </div>

          {/* Smart Recommendations */}
          {getSmartRecommendations().length > 0 && (
            <div className="mb-8 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-foreground mb-2">
                    💡 Smart doporučení pro vás
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Zákazníci s podobnou konfigurací často přidávají:
                  </p>
                </div>
              </div>
              <div className="grid gap-3">
                {getSmartRecommendations().map(extraId => {
                  const extra = extraOptions.find(e => e.id === extraId);
                  if (!extra) return null;
                  
                  return (
                    <button
                      key={extraId}
                      onClick={(e) => {
                        toggleExtra(extraId);
                        triggerFlyAnimation(e.currentTarget, "💡");
                      }}
                      className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-blue-300 dark:border-blue-700 hover:border-blue-500 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-foreground">{extra.label}</p>
                          {extra.tooltip && (
                            <p className="text-xs text-muted-foreground">{extra.tooltip}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          +{extra.price} Kč
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">Klikněte pro přidání</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Other Extras */}
          <h4 className="text-lg font-semibold text-foreground mb-4">Ostatní doplňkové služby</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {extraOptions.map(extra => {
            const isSelected = selectedExtras.has(extra.id);
            return <div 
                key={extra.id} 
                onClick={(e) => {
                  const wasSelected = selectedExtras.has(extra.id);
                  toggleExtra(extra.id);
                  // Only trigger animation when adding, not removing
                  if (!wasSelected) {
                    triggerFlyAnimation(e.currentTarget as HTMLElement, "✓");
                  }
                }} 
                className={`cursor-pointer bg-card rounded-xl p-5 border-2 transition-all hover:shadow-md ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                  <div className="flex items-start gap-3">
                    <Checkbox checked={isSelected} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">
                          {extra.label}
                        </span>
                        {extra.tooltip && <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger onClick={e => e.stopPropagation()}>
                                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{extra.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>}
                      </div>
                      <span className="text-lg font-bold text-primary">
                        +{extra.price} Kč
                      </span>
                    </div>
                    {isSelected ? <Minus className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-muted-foreground" />}
                  </div>
                </div>;
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
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-2">
                  {calculateTotalPrice().toLocaleString('cs-CZ')} <span className="text-xl md:text-2xl text-muted-foreground">Kč</span>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4" />
                  Odhadovaný čas práce: {calculateEstimatedTime()} hodin
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-background/50 rounded-lg p-3">
                    <p className="text-muted-foreground mb-1">Základní cena</p>
                    <p className="font-semibold text-foreground">{getBasePriceWithCategory()} Kč</p>
                  </div>
                  {selectedExtras.size > 0 && <div className="bg-background/50 rounded-lg p-3">
                      <p className="text-muted-foreground mb-1">Extras</p>
                      <p className="font-semibold text-foreground">+{(() => {
                        let extrasTotal = Array.from(selectedExtras).reduce((sum, extraId) => {
                          const extra = extraOptions.find(e => e.id === extraId);
                          return sum + (extra?.price || 0);
                        }, 0);
                        if (selectedWindowCount) {
                          const windowOption = windowCountOptions.find(w => w.id === selectedWindowCount);
                          if (windowOption) extrasTotal += windowOption.price;
                        }
                        return extrasTotal;
                      })()} Kč</p>
                    </div>}
                  {getTotalSavingsAmount() > 0 && <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 border border-green-200 dark:border-green-800">
                      <p className="text-green-700 dark:text-green-300 mb-1 font-medium">💰 Vaše úspora</p>
                      <p className="font-bold text-green-700 dark:text-green-300 text-lg">
                        -{getTotalSavingsAmount()} Kč
                      </p>
                    </div>}
                  {getTotalSurchargesAmount() > 0 && <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                      <p className="text-orange-700 dark:text-orange-300 mb-1 font-medium">⚡ Příplatky</p>
                      <p className="font-bold text-orange-700 dark:text-orange-300 text-lg">
                        +{getTotalSurchargesAmount()} Kč
                      </p>
                    </div>}
                </div>
              </div>
              
              <div className="flex flex-col gap-3 w-full lg:w-auto">
                <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      data-reserve-button
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
                    <ReservationForm packageType={`${categories.find(c => c.id === selectedCategory)?.name} - ${selectedPackage}`} basePrice={getBasePriceWithCategory()} selectedExtras={Array.from(selectedExtras).map(id => {
                    const extra = extraOptions.find(e => e.id === id);
                    return {
                      id,
                      label: extra?.label || "",
                      price: extra?.price || 0
                    };
                  })} totalPrice={calculateTotalPrice()} frequency={selectedFrequency ? frequencyOptions.find(f => f.id === selectedFrequency)?.name : undefined} />
                  </DialogContent>
                </Dialog>
                
                {!isConfigurationComplete() && <p className="text-xs text-muted-foreground text-center lg:text-right">
                    ⚠️ Dokončete výběr frekvence
                  </p>}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Domy nad 150 m² nebo speciální požadavky?{" "}
            <button onClick={scrollToContact} className="text-primary hover:underline font-semibold">
              Napište nám
            </button>
            {" "}a připravíme nabídku na míru.
          </p>
        </div>
      </div>
    </section>;
};
export default PricingConfigurator;