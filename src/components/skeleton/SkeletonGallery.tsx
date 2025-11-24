import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonGalleryProps {
  columns?: 2 | 3 | 4;
  items?: number;
  className?: string;
  /** Describe what gallery content is loading */
  contentType?: string;
}

/**
 * Skeleton loader for image galleries
 * Accessible with grid semantics and item counts
 */
export const SkeletonGallery = ({
  columns = 3,
  items = 6,
  className = "",
  contentType = "images",
}: SkeletonGalleryProps) => {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div 
      className={`grid ${gridCols[columns]} gap-4 ${className}`}
      role="list"
      aria-busy="true"
      aria-label={`Loading gallery with ${items} ${contentType}`}
    >
      <span className="sr-only">
        Loading gallery grid with {items} {contentType} in {columns} columns
      </span>
      {Array.from({ length: items }).map((_, i) => (
        <figure 
          key={i} 
          className="space-y-2"
          role="listitem"
          aria-label={`Loading gallery item ${i + 1} of ${items}`}
        >
          <Skeleton 
            className="w-full aspect-square rounded-xl"
            ariaLabel={`Loading image ${i + 1}`}
            announce={i === 0}
          />
          <Skeleton 
            className="h-4 w-3/4"
            ariaLabel={`Loading title for image ${i + 1}`}
            announce={false}
          />
          <Skeleton 
            className="h-3 w-1/2"
            ariaLabel={`Loading caption for image ${i + 1}`}
            announce={false}
          />
        </figure>
      ))}
    </div>
  );
};
