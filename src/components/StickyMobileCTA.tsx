import { Button } from "@/components/ui/button";
import { Phone, ShoppingCart, ChevronUp, Info, Package, X, Clock } from "lucide-react";
import { usePricing } from "@/contexts/PricingContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const StickyMobileCTA = () => {
  const {
    selectedCategory,
    selectedPackage,
    selectedExtras,
    selectedWindowCount,
    totalPrice,
    estimatedTime,
    isConfigurationComplete,
    openReservation,
  } = usePricing();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExtrasPopover, setShowExtrasPopover] = useState(false);

  // Define extras options to get labels
  const extraOptions = [
    { id: "dog", label: "Mám psa nebo kočku", price: 200 },
    { id: "dishes", label: "Mytí nádobí", price: 150 },
    { id: "trash", label: "Vynášení odpadků", price: 50 },
    { id: "plants", label: "Zalévání květin", price: 50 },
    { id: "ironing", label: "Žehlení prádla (cca 2 hodiny)", price: 300 },
    { id: "garden", label: "Kompletní údržba zahrady", price: 600 },
    { id: "carpet-cleaning", label: "Čištění koberců a čalouněného nábytku", price: 500 },
    { id: "oven-cleaning", label: "Vyčištění trouby a grilu", price: 350 },
    { id: "fridge-cleaning", label: "Čištění lednice a mrazáku", price: 250 },
    { id: "balcony-terrace", label: "Velký balkon nebo terasa (nad 10 m²)", price: 450 },
    { id: "laundry", label: "Praní a sušení prádla", price: 400 },
    { id: "organizing", label: "Organizace šatníku nebo skříní", price: 550 },
    { id: "basement-garage", label: "Sklep / garáž / půda", price: 300 },
    { id: "wallpaper-cleaning", label: "Čištění tapetovaných stěn", price: 400 },
    { id: "walls-cleaning", label: "Čištění stěn a stropů (jedna místnost)", price: 600 },
  ];

  const windowCountOptions = [
    { id: "1-3", name: "1-3 okna", price: 200 },
    { id: "4-6", name: "4-6 oken", price: 350 },
    { id: "7-10", name: "7-10 oken", price: 500 },
    { id: "11+", name: "11+ oken", price: 700 },
  ];

  const getSelectedExtrasDetails = () => {
    const details = [];
    
    // Add selected extras
    selectedExtras.forEach((extraId) => {
      const extra = extraOptions.find((e) => e.id === extraId);
      if (extra) {
        details.push({
          label: extra.label,
          price: extra.price,
        });
      }
    });

    // Add window cleaning if selected
    if (selectedWindowCount) {
      const windowOption = windowCountOptions.find((w) => w.id === selectedWindowCount);
      if (windowOption) {
        details.push({
          label: `Mytí oken - ${windowOption.name}`,
          price: windowOption.price,
        });
      }
    }

    return details;
  };

  const selectedExtrasDetails = getSelectedExtrasDetails();
  const totalExtras = selectedExtrasDetails.length;

  const getCategoryLabel = () => {
    const labels = {
      standard: "Běžný úklid",
      general: "Generální úklid",
      "post-construction": "Po rekonstrukci",
      "post-moving": "Po stěhování",
      regular: "Pravidelný úklid",
    };
    return labels[selectedCategory];
  };

  const getPackageLabel = () => {
    const labels = {
      small: "Malý byt",
      medium: "Střední byt",
      large: "Rodinný dům",
    };
    return labels[selectedPackage];
  };

  const hasConfiguration = totalPrice > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-lg border-t-2 border-primary/20 shadow-2xl">
      <AnimatePresence>
        {isExpanded && hasConfiguration && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="container mx-auto px-4 md:px-6 py-4 border-b border-border">
              <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                {/* Configuration Summary */}
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-3 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Vaše konfigurace
                    </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      isConfigurationComplete 
                        ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300' 
                        : 'bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300'
                    }`}>
                      {isConfigurationComplete ? '✓ Hotovo' : '⚠ Nedokončeno'}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Typ:</span>
                      <span className="font-semibold text-foreground">{getCategoryLabel()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Prostor:</span>
                      <span className="font-semibold text-foreground">{getPackageLabel()}</span>
                    </div>
                    {estimatedTime > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Čas:
                        </span>
                        <span className="font-semibold text-foreground">{estimatedTime}h</span>
                      </div>
                    )}
                    {totalExtras > 0 && (
                      <Popover open={showExtrasPopover} onOpenChange={setShowExtrasPopover}>
                        <PopoverTrigger asChild>
                          <button className="flex items-center justify-between text-sm w-full hover:bg-primary/5 -mx-1 px-1 py-0.5 rounded transition-colors">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Package className="w-3.5 h-3.5" />
                              Extras:
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-primary">{totalExtras}× služeb</span>
                              <ChevronUp className={`w-3.5 h-3.5 text-primary transition-transform ${showExtrasPopover ? '' : 'rotate-180'}`} />
                            </div>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent 
                          side="top" 
                          align="center"
                          className="w-[calc(100vw-2rem)] max-w-sm p-0 mb-2 z-[100] bg-background border-2 border-primary/20 shadow-2xl"
                        >
                          <div className="max-h-[60vh] overflow-y-auto">
                            {/* Header */}
                            <div className="sticky top-0 bg-gradient-to-br from-primary/10 to-accent/10 px-4 py-3 border-b border-border flex items-center justify-between z-10">
                              <div className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-primary" />
                                <h4 className="font-bold text-foreground">Vybrané služby</h4>
                              </div>
                              <button
                                onClick={() => setShowExtrasPopover(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>

                            {/* Extras List */}
                            <div className="divide-y divide-border">
                              {selectedExtrasDetails.map((extra, idx) => (
                                <div
                                  key={idx}
                                  className="px-4 py-3 hover:bg-muted/30 transition-colors"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <span className="text-sm text-foreground flex-1">
                                      {extra.label}
                                    </span>
                                    <span className="text-sm font-bold text-primary whitespace-nowrap">
                                      +{extra.price} Kč
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Footer with Total */}
                            <div className="sticky bottom-0 bg-gradient-to-br from-primary/10 to-accent/10 px-4 py-3 border-t-2 border-primary/20">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-foreground">
                                  Celkem extras:
                                </span>
                                <span className="text-lg font-bold text-primary">
                                  +{selectedExtrasDetails.reduce((sum, e) => sum + e.price, 0)} Kč
                                </span>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>

                {/* Price Display */}
                <div className="bg-card rounded-xl p-3 border-2 border-primary/30">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted-foreground">Celková cena:</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-foreground">
                        {totalPrice.toLocaleString('cs-CZ')}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">Kč</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 md:px-6 py-3">
        {hasConfiguration ? (
          <div className="space-y-3 md:flex md:items-center md:justify-between md:space-y-0 md:gap-6">
            {/* Collapse/Expand Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full md:w-auto flex items-center justify-between md:justify-start text-sm text-muted-foreground hover:text-foreground transition-colors md:gap-3"
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span className="font-medium">
                  {isExpanded ? 'Skrýt detaily' : 'Zobrazit detaily'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!isExpanded && (
                  <span className="text-base font-bold text-primary">
                    {totalPrice.toLocaleString('cs-CZ')} Kč
                  </span>
                )}
                <ChevronUp
                  className={`w-4 h-4 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:flex gap-3 md:ml-auto">
              <a href="tel:+420739580935" className="flex-1 md:flex-none">
                <Button
                  variant="outline"
                  className="w-full md:w-auto md:px-8 h-12 text-base font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Zavolat
                </Button>
              </a>
              <Button
                variant="premium"
                className="w-full md:w-auto md:px-8 h-12 text-base font-semibold"
                onClick={openReservation}
                disabled={!isConfigurationComplete}
              >
                <ShoppingCart className="mr-2 w-5 h-5" />
                {isConfigurationComplete ? 'Objednat' : 'Dokončit'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:flex md:justify-center gap-3">
            <a href="tel:+420739580935" className="flex-1 md:flex-none">
              <Button
                variant="outline"
                className="w-full md:w-auto md:px-8 h-12 text-base font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Phone className="mr-2 w-5 h-5" />
                Zavolat
              </Button>
            </a>
            <Button
              variant="premium"
              className="w-full md:w-auto md:px-8 h-12 text-base font-semibold"
              onClick={openReservation}
            >
              <ShoppingCart className="mr-2 w-5 h-5" />
              Rezervovat
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyMobileCTA;
