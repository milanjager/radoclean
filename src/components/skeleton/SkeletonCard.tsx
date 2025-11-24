import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonCardProps {
  hasImage?: boolean;
  imageAspect?: string;
  hasAvatar?: boolean;
  textLines?: number;
  className?: string;
}

/**
 * Skeleton loader for card components
 */
export const SkeletonCard = ({
  hasImage = true,
  imageAspect = "aspect-video",
  hasAvatar = false,
  textLines = 3,
  className = "",
}: SkeletonCardProps) => {
  return (
    <div className={`bg-card rounded-2xl border overflow-hidden ${className}`}>
      {/* Image */}
      {hasImage && (
        <Skeleton className={`w-full ${imageAspect} rounded-none`} />
      )}

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Avatar + Name */}
        {hasAvatar && (
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        )}

        {/* Title */}
        <Skeleton className="h-6 w-3/4" />

        {/* Text Lines */}
        <div className="space-y-2">
          {Array.from({ length: textLines }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-4"
              style={{
                width: i === textLines - 1 ? "60%" : "100%",
              }}
            />
          ))}
        </div>

        {/* Button */}
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  );
};
