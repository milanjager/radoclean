import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Screen reader announcement for what is loading */
  ariaLabel?: string;
  /** Whether to show loading announcement */
  announce?: boolean;
}

function Skeleton({
  className,
  ariaLabel = "Loading content",
  announce = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
      aria-live={announce ? "polite" : "off"}
      className={cn(
        "animate-pulse rounded-md bg-muted/50",
        "relative overflow-hidden",
        "before:absolute before:inset-0",
        "before:-translate-x-full",
        "before:animate-[shimmer_2s_infinite]",
        "before:bg-gradient-to-r",
        "before:from-transparent before:via-muted/80 before:to-transparent",
        className
      )}
      {...props}
    >
      {announce && (
        <span className="sr-only">
          {ariaLabel}
        </span>
      )}
    </div>
  )
}

export { Skeleton }
