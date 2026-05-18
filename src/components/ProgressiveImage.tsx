import { useState, useEffect } from "react";
import { useLQIP } from "@/hooks/useLQIP";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  aspectRatio?: string;
  lqip?: string; // Optional pre-generated LQIP
  enableAutoLQIP?: boolean; // Auto-generate LQIP if not provided
}

const ProgressiveImage = ({ 
  src, 
  alt, 
  className = "", 
  loading = "lazy",
  aspectRatio = "aspect-video",
  lqip: providedLqip,
  enableAutoLQIP = true
}: ProgressiveImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  
  // Auto-generate LQIP if not provided and enabled
  const { lqip: autoLqip } = useLQIP(src, enableAutoLQIP && !providedLqip);
  const lqip = providedLqip || autoLqip;

  useEffect(() => {
    // Create observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px",
      }
    );

    const element = document.getElementById(`img-${src}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [src]);

  useEffect(() => {
    if (isInView || loading === "eager") {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImgSrc(src);
        setIsLoaded(true);
      };
    }
  }, [src, isInView, loading]);

  return (
    <div 
      id={`img-${src}`}
      className={`relative overflow-hidden bg-muted ${aspectRatio} ${className}`}
    >
      {/* Subtle skeleton until image is loaded (no blur) */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}

      {/* Actual image - no blur effect */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading={loading}
          decoding="async"
        />
      )}
    </div>
  );
};

export default ProgressiveImage;
