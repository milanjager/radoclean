import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

const AnimatedCounter = ({ value, duration = 2000 }: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState("0");
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            setIsVisible(true);
            hasAnimated.current = true;
          }
        });
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Extract number from string (e.g., "500-800 Kč" -> "800", "30%" -> "30")
    const matches = value.match(/\d+/g);
    if (!matches) {
      setDisplayValue(value);
      return;
    }

    const targetNumber = parseInt(matches[matches.length - 1]);
    const startTime = Date.now();
    const isPercentage = value.includes("%");
    const suffix = isPercentage ? "%" : " Kč";
    const hasRange = value.includes("-");
    const prefix = hasRange ? matches[0] + "-" : "";

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * targetNumber);

      setDisplayValue(`${prefix}${currentValue}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isVisible, value, duration]);

  return (
    <span ref={elementRef} className="font-bold tabular-nums">
      {displayValue}
    </span>
  );
};

export default AnimatedCounter;
