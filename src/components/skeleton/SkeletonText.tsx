import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

/**
 * Skeleton loader for text content
 */
export const SkeletonText = ({ lines = 3, className = "" }: SkeletonTextProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{
            width: i === lines - 1 ? "80%" : "100%",
          }}
        />
      ))}
    </div>
  );
};
