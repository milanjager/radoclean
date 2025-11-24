import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonListProps {
  items?: number;
  hasImage?: boolean;
  className?: string;
  /** Describe what list content is loading */
  contentType?: string;
}

/**
 * Skeleton loader for list items
 * Accessible with list semantics and item counts
 */
export const SkeletonList = ({
  items = 5,
  hasImage = true,
  className = "",
  contentType = "list items",
}: SkeletonListProps) => {
  return (
    <div 
      className={`space-y-4 ${className}`}
      role="feed"
      aria-busy="true"
      aria-label={`Loading ${items} ${contentType}`}
    >
      <span className="sr-only">
        Loading list with {items} {contentType}
      </span>
      {Array.from({ length: items }).map((_, i) => (
        <article
          key={i}
          className="flex items-start gap-4 p-4 bg-card rounded-xl border"
          role="status"
          aria-label={`Loading item ${i + 1} of ${items}`}
        >
          {hasImage && (
            <Skeleton 
              className="w-16 h-16 rounded-lg flex-shrink-0"
              ariaLabel={`Loading thumbnail for item ${i + 1}`}
              announce={false}
            />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton 
              className="h-5 w-3/4"
              ariaLabel={`Loading title for item ${i + 1}`}
              announce={i === 0}
            />
            <Skeleton 
              className="h-4 w-full"
              ariaLabel={`Loading description line 1 for item ${i + 1}`}
              announce={false}
            />
            <Skeleton 
              className="h-4 w-2/3"
              ariaLabel={`Loading description line 2 for item ${i + 1}`}
              announce={false}
            />
          </div>
        </article>
      ))}
    </div>
  );
};
