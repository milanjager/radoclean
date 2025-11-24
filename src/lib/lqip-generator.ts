/**
 * LQIP (Low-Quality Image Placeholder) Generator
 * Generates tiny blurred versions of images for better loading experience
 */

interface LQIPOptions {
  width?: number;
  height?: number;
  quality?: number;
}

/**
 * Generate a low-quality placeholder from an image URL or File
 */
export const generateLQIP = async (
  source: string | File,
  options: LQIPOptions = {}
): Promise<string> => {
  const { width = 20, height = 20, quality = 0.3 } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        // Create a small canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Draw the image scaled down
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with low quality
        const lqip = canvas.toDataURL("image/jpeg", quality);
        resolve(lqip);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    // Load the image
    if (typeof source === "string") {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(source);
    }
  });
};

/**
 * Pre-generate LQIPs for multiple images
 */
export const generateLQIPBatch = async (
  sources: (string | File)[],
  options?: LQIPOptions
): Promise<Map<string, string>> => {
  const lqipMap = new Map<string, string>();

  await Promise.all(
    sources.map(async (source, index) => {
      try {
        const lqip = await generateLQIP(source, options);
        const key = typeof source === "string" ? source : `file-${index}`;
        lqipMap.set(key, lqip);
      } catch (error) {
        console.error(`Failed to generate LQIP for source ${index}:`, error);
      }
    })
  );

  return lqipMap;
};

/**
 * Hook to use LQIP with automatic generation
 */
export const useLQIP = (src: string) => {
  const [lqip, setLqip] = React.useState<string>("");

  React.useEffect(() => {
    let mounted = true;

    const generatePlaceholder = async () => {
      try {
        const placeholder = await generateLQIP(src);
        if (mounted) {
          setLqip(placeholder);
        }
      } catch (error) {
        console.error("Failed to generate LQIP:", error);
      }
    };

    // Check if LQIP is cached
    const cached = sessionStorage.getItem(`lqip-${src}`);
    if (cached) {
      setLqip(cached);
    } else {
      generatePlaceholder().then(() => {
        if (lqip) {
          sessionStorage.setItem(`lqip-${src}`, lqip);
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, [src]);

  return lqip;
};

// Import React for the hook
import React from "react";
