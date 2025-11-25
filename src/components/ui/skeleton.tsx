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
        "animate-pulse rounded-md",
        "relative overflow-hidden",
        "backdrop-blur-md",
        "bg-gradient-to-r from-muted/30 via-primary/10 to-muted/30",
        "bg-[length:200%_100%]",
        "animate-gradient-move",
        "[transform-style:preserve-3d]",
        "before:absolute before:inset-0",
        "before:-translate-x-full",
        "before:animate-shimmer-3d",
        "before:bg-gradient-to-r",
        "before:from-transparent before:via-primary/20 before:to-transparent",
        "before:blur-xl",
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
