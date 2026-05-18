import { useEffect, useRef } from "react";

/**
 * Wraps children and applies a scroll-based blur effect to each direct child:
 * sections fade in from blurred to sharp as they approach the viewport center,
 * and blur back out as they leave. Respects prefers-reduced-motion.
 */
const ScrollBlurWrapper = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const targets = Array.from(container.children) as HTMLElement[];
    targets.forEach((el) => {
      el.style.transition = "filter 0.4s ease-out, opacity 0.4s ease-out";
      el.style.willChange = "filter, opacity";
    });

    const MAX_BLUR = 16; // px

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const center = vh / 2;
      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // distance from element center to viewport center, normalized to viewport height
        const elCenter = rect.top + rect.height / 2;
        const dist = Math.abs(elCenter - center) / vh;
        // 0 when centered, 1+ when far away
        const t = Math.min(1, Math.max(0, dist - 0.15) / 0.6);
        const blur = t * MAX_BLUR;
        const opacity = 1 - t * 0.4;
        el.style.filter = blur > 0.1 ? `blur(${blur.toFixed(2)}px)` : "";
        el.style.opacity = String(opacity);
      });
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      targets.forEach((el) => {
        el.style.filter = "";
        el.style.opacity = "";
        el.style.transition = "";
        el.style.willChange = "";
      });
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
};

export default ScrollBlurWrapper;
