import { Button } from "@/components/ui/button";
import { Phone, ShoppingCart, ChevronUp, Info } from "lucide-react";
import { usePricing } from "@/contexts/PricingContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const StickyMobileCTA = () => {
  const {
    selectedCategory,
    selectedPackage,
    selectedExtras,
    totalPrice,
    isConfigurationComplete,
    openReservation,
  } = usePricing();
  
  const [isExpanded, setIsExpanded] = useState(false);

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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-lg border-t-2 border-primary/20 shadow-2xl">
      <AnimatePresence>
        {isExpanded && hasConfiguration && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 border-b border-border">
              <div className="space-y-3">
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
                    {selectedExtras.size > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Extras:</span>
                        <span className="font-semibold text-primary">{selectedExtras.size}×</span>
                      </div>
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

      <div className="container mx-auto px-4 py-3">
        {hasConfiguration ? (
          <div className="space-y-3">
            {/* Collapse/Expand Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
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
            <div className="grid grid-cols-2 gap-3">
              <a href="tel:+420739580935" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full h-12 text-base font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Zavolat
                </Button>
              </a>
              <Button
                variant="premium"
                className="w-full h-12 text-base font-semibold"
                onClick={openReservation}
                disabled={!isConfigurationComplete}
              >
                <ShoppingCart className="mr-2 w-5 h-5" />
                {isConfigurationComplete ? 'Objednat' : 'Dokončit'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <a href="tel:+420739580935" className="flex-1">
              <Button
                variant="outline"
                className="w-full h-12 text-base font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Phone className="mr-2 w-5 h-5" />
                Zavolat
              </Button>
            </a>
            <Button
              variant="premium"
              className="w-full h-12 text-base font-semibold"
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
