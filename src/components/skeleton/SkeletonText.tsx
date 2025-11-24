import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTextProps {
  lines?: number;
  className?: string;
  /** Describe what text content is loading */
  contentType?: string;
}

/**
 * Skeleton loader for text content
 * Accessible with screen reader announcements
 */
export const SkeletonText = ({ 
  lines = 3, 
  className = "",
  contentType = "text content"
}: SkeletonTextProps) => {
  return (
    <div 
      className={`space-y-2 ${className}`}
      role="region"
      aria-label={`Loading ${contentType}`}
    >
      <span className="sr-only">
        Loading {lines} {lines === 1 ? "line" : "lines"} of {contentType}
      </span>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          ariaLabel={`Loading line ${i + 1} of ${lines}`}
          announce={i === 0} // Only announce first skeleton to avoid spam
          style={{
            width: i === lines - 1 ? "80%" : "100%",
          }}
        />
      ))}
    </div>
  );
};
