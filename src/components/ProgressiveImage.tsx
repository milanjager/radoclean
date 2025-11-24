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
      {/* LQIP Blur placeholder */}
      {lqip ? (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            isLoaded ? "opacity-0" : "opacity-100"
          }`}
          style={{
            backgroundImage: `url(${lqip})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(20px)",
            transform: "scale(1.1)",
          }}
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br from-muted via-muted/50 to-muted transition-opacity duration-500 ${
            isLoaded ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="absolute inset-0 animate-pulse" />
        </div>
      )}

      {/* Actual image */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLoaded 
              ? "opacity-100 scale-100 blur-0" 
              : "opacity-0 scale-105 blur-lg"
          }`}
          loading={loading}
          decoding="async"
        />
      )}

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default ProgressiveImage;
