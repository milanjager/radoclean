import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { useFlyToCart } from "@/hooks/useFlyToCart";

type PackageType = "small" | "medium" | "large";
type CategoryType = "standard" | "general" | "post-construction" | "post-moving" | "regular";
type FrequencyType = "weekly" | "twice-weekly" | "biweekly" | "monthly" | null;
type UrgentType = "urgent-24h" | "weekend" | "evening" | null;
type WindowCountType = "1-3" | "4-6" | "7-10" | "11+" | null;

interface PricingContextType {
  selectedCategory: CategoryType;
  setSelectedCategory: (category: CategoryType) => void;
  selectedPackage: PackageType;
  setSelectedPackage: (pkg: PackageType) => void;
  selectedExtras: Set<string>;
  setSelectedExtras: (extras: Set<string>) => void;
  selectedFrequency: FrequencyType;
  setSelectedFrequency: (freq: FrequencyType) => void;
  hasOwnSupplies: boolean;
  setHasOwnSupplies: (has: boolean) => void;
  selectedUrgent: UrgentType;
  setSelectedUrgent: (urgent: UrgentType) => void;
  selectedWindowCount: WindowCountType;
  setSelectedWindowCount: (count: WindowCountType) => void;
  totalPrice: number;
  setTotalPrice: (price: number) => void;
  estimatedTime: number;
  setEstimatedTime: (time: number) => void;
  isConfigurationComplete: boolean;
  setIsConfigurationComplete: (complete: boolean) => void;
  openReservation: () => void;
  triggerFlyAnimation: (element: HTMLElement, emoji?: string) => void;
  FlyingElements: () => React.ReactPortal | null;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export const PricingProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("standard");
  const [selectedPackage, setSelectedPackage] = useState<PackageType>("medium");
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [selectedFrequency, setSelectedFrequency] = useState<FrequencyType>(null);
  const [hasOwnSupplies, setHasOwnSupplies] = useState(false);
  const [selectedUrgent, setSelectedUrgent] = useState<UrgentType>(null);
  const [selectedWindowCount, setSelectedWindowCount] = useState<WindowCountType>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [isConfigurationComplete, setIsConfigurationComplete] = useState(false);
  
  const { triggerFly, FlyingElements } = useFlyToCart();

  const openReservation = () => {
    const pricingElement = document.getElementById("pricing");
    if (pricingElement) {
      const offset = 80;
      const elementPosition = pricingElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      // Trigger reservation dialog after scroll
      setTimeout(() => {
        const reserveButton = document.querySelector('[data-reserve-button]') as HTMLButtonElement;
        if (reserveButton) {
          reserveButton.click();
        }
      }, 500);
    }
  };

  const triggerFlyAnimation = useCallback((element: HTMLElement, emoji?: string) => {
    triggerFly(element, emoji);
  }, [triggerFly]);

  return (
    <PricingContext.Provider
      value={{
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
        totalPrice,
        setTotalPrice,
        estimatedTime,
        setEstimatedTime,
        isConfigurationComplete,
        setIsConfigurationComplete,
        openReservation,
        triggerFlyAnimation,
        FlyingElements,
      }}
    >
      {children}
    </PricingContext.Provider>
  );
};

export const usePricing = () => {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error("usePricing must be used within a PricingProvider");
  }
  return context;
};
