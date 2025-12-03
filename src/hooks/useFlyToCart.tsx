import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface FlyingItem {
  id: string;
  startX: number;
  startY: number;
  emoji?: string;
}

export const useFlyToCart = () => {
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const targetRef = useRef<HTMLDivElement | null>(null);

  const triggerFly = useCallback((element: HTMLElement, emoji?: string) => {
    const rect = element.getBoundingClientRect();
    const id = Math.random().toString(36).substring(7);
    
    setFlyingItems(prev => [...prev, {
      id,
      startX: rect.left + rect.width / 2,
      startY: rect.top + rect.height / 2,
      emoji: emoji || "✓",
    }]);

    // Remove item after animation completes
    setTimeout(() => {
      setFlyingItems(prev => prev.filter(item => item.id !== id));
    }, 600);
  }, []);

  const FlyingElements = () => {
    if (typeof window === "undefined") return null;
    
    // Target is the bottom of viewport (sticky CTA position)
    const targetX = window.innerWidth / 2;
    const targetY = window.innerHeight - 40;

    return createPortal(
      <AnimatePresence>
        {flyingItems.map(item => (
          <motion.div
            key={item.id}
            initial={{
              position: "fixed",
              left: item.startX,
              top: item.startY,
              scale: 1,
              opacity: 1,
              zIndex: 9999,
              pointerEvents: "none",
            }}
            animate={{
              left: targetX,
              top: targetY,
              scale: 0.3,
              opacity: 0.8,
            }}
            exit={{
              scale: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.5,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            className="flex items-center justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center text-2xl shadow-lg shadow-accent/50">
              {item.emoji}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>,
      document.body
    );
  };

  return { triggerFly, FlyingElements, targetRef };
};
