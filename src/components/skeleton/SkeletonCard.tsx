import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonCardProps {
  hasImage?: boolean;
  imageAspect?: string;
  hasAvatar?: boolean;
  textLines?: number;
  className?: string;
  /** Describe what card content is loading */
  contentType?: string;
}

/**
 * Skeleton loader for card components
 * Accessible with structured content hints
 */
export const SkeletonCard = ({
  hasImage = true,
  imageAspect = "aspect-video",
  hasAvatar = false,
  textLines = 3,
  className = "",
  contentType = "card",
}: SkeletonCardProps) => {
  return (
    <article 
      className={`bg-card rounded-2xl border overflow-hidden ${className}`}
      role="status"
      aria-busy="true"
      aria-label={`Loading ${contentType}`}
    >
      <span className="sr-only">
        Loading {contentType} with {hasImage ? "image, " : ""}{hasAvatar ? "author information, " : ""}title and description
      </span>

      {/* Image */}
      {hasImage && (
        <Skeleton 
          className={`w-full ${imageAspect} rounded-none`}
          ariaLabel={`Loading ${contentType} image`}
          announce={false}
        />
      )}

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Avatar + Name */}
        {hasAvatar && (
          <div className="flex items-center gap-3">
            <Skeleton 
              className="w-10 h-10 rounded-full"
              ariaLabel="Loading author avatar"
              announce={false}
            />
            <div className="flex-1 space-y-2">
              <Skeleton 
                className="h-4 w-32"
                ariaLabel="Loading author name"
                announce={false}
              />
              <Skeleton 
                className="h-3 w-24"
                ariaLabel="Loading author role"
                announce={false}
              />
            </div>
          </div>
        )}

        {/* Title */}
        <Skeleton 
          className="h-6 w-3/4"
          ariaLabel={`Loading ${contentType} title`}
          announce={false}
        />

        {/* Text Lines */}
        <div className="space-y-2" role="group" aria-label="Loading description">
          {Array.from({ length: textLines }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-4"
              ariaLabel={`Loading description line ${i + 1}`}
              announce={false}
              style={{
                width: i === textLines - 1 ? "60%" : "100%",
              }}
            />
          ))}
        </div>

        {/* Button */}
        <Skeleton 
          className="h-10 w-28"
          ariaLabel="Loading action button"
          announce={false}
        />
      </div>
    </article>
  );
};
