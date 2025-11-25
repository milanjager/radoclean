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
        "backdrop-blur-md",
        "before:absolute before:inset-0",
        "before:-translate-x-full",
        "before:animate-[shimmer_2.5s_ease-in-out_infinite]",
        "before:bg-gradient-to-r",
        "before:from-transparent before:via-primary/20 before:to-transparent",
        "before:blur-xl",
        "before:[transform:translateX(-100%)_rotateY(-15deg)_scale(1.2)]",
        "before:animate-shimmer-3d",
        "[transform-style:preserve-3d]",
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
