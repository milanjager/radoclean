import { useState, useEffect } from "react";

/**
 * Hook to generate and cache LQIP (Low-Quality Image Placeholder)
 */
export const useLQIP = (src: string, enabled = true) => {
  const [lqip, setLqip] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!enabled || !src) return;

    let mounted = true;

    const generateLQIP = async () => {
      // Check cache first
      const cacheKey = `lqip-${src}`;
      const cached = sessionStorage.getItem(cacheKey);
      
      if (cached && mounted) {
        setLqip(cached);
        return;
      }

      setIsGenerating(true);

      try {
        const img = new Image();
        img.crossOrigin = "anonymous";

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Failed to load image"));
          img.src = src;
        });

        // Create tiny canvas (20x20)
        const canvas = document.createElement("canvas");
        canvas.width = 20;
        canvas.height = 20;
        const ctx = canvas.getContext("2d");

        if (!ctx) throw new Error("Could not get canvas context");

        // Draw scaled down image
        ctx.drawImage(img, 0, 0, 20, 20);

        // Convert to low-quality base64
        const placeholder = canvas.toDataURL("image/jpeg", 0.3);

        if (mounted) {
          setLqip(placeholder);
          // Cache for session
          sessionStorage.setItem(cacheKey, placeholder);
        }
      } catch (error) {
        console.error("Failed to generate LQIP:", error);
      } finally {
        if (mounted) {
          setIsGenerating(false);
        }
      }
    };

    generateLQIP();

    return () => {
      mounted = false;
    };
  }, [src, enabled]);

  return { lqip, isGenerating };
};
