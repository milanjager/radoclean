import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonGalleryProps {
  columns?: 2 | 3 | 4;
  items?: number;
  className?: string;
}

/**
 * Skeleton loader for image galleries
 */
export const SkeletonGallery = ({
  columns = 3,
  items = 6,
  className = "",
}: SkeletonGalleryProps) => {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="w-full aspect-square rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
};
