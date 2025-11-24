import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonListProps {
  items?: number;
  hasImage?: boolean;
  className?: string;
}

/**
 * Skeleton loader for list items
 */
export const SkeletonList = ({
  items = 5,
  hasImage = true,
  className = "",
}: SkeletonListProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-4 p-4 bg-card rounded-xl border"
        >
          {hasImage && (
            <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};
