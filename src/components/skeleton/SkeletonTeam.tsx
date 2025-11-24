import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTeamProps {
  members?: number;
  className?: string;
}

/**
 * Skeleton loader for team member cards
 */
export const SkeletonTeam = ({ members = 4, className = "" }: SkeletonTeamProps) => {
  return (
    <div className={`grid md:grid-cols-2 gap-8 ${className}`}>
      {Array.from({ length: members }).map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-2xl border overflow-hidden"
        >
          <div className="grid sm:grid-cols-5 gap-0">
            {/* Image */}
            <div className="sm:col-span-2">
              <Skeleton className="w-full aspect-square sm:aspect-auto h-full rounded-none" />
            </div>

            {/* Content */}
            <div className="sm:col-span-3 p-6 space-y-4">
              {/* Quote */}
              <div className="bg-primary/5 rounded-xl p-3 border-l-4 border-primary">
                <Skeleton className="h-4 w-full" />
              </div>

              {/* Name */}
              <Skeleton className="h-7 w-2/3" />

              {/* Role */}
              <Skeleton className="h-5 w-1/2" />

              {/* Location */}
              <Skeleton className="h-4 w-3/4" />

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
