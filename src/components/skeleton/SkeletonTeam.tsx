import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTeamProps {
  members?: number;
  className?: string;
}

/**
 * Skeleton loader for team member cards
 * Accessible with member count and structured content
 */
export const SkeletonTeam = ({ members = 4, className = "" }: SkeletonTeamProps) => {
  return (
    <div 
      className={`grid md:grid-cols-2 gap-8 ${className}`}
      role="list"
      aria-busy="true"
      aria-label={`Loading ${members} team members`}
    >
      <span className="sr-only">
        Loading team member profiles. {members} {members === 1 ? "member" : "members"} in total.
      </span>
      {Array.from({ length: members }).map((_, i) => (
        <article
          key={i}
          className="bg-card rounded-2xl border overflow-hidden"
          role="listitem"
          aria-label={`Loading team member ${i + 1} of ${members}`}
        >
          <div className="grid sm:grid-cols-5 gap-0">
            {/* Image */}
            <div className="sm:col-span-2">
              <Skeleton 
                className="w-full aspect-square sm:aspect-auto h-full rounded-none"
                ariaLabel={`Loading photo for team member ${i + 1}`}
                announce={false}
              />
            </div>

            {/* Content */}
            <div className="sm:col-span-3 p-6 space-y-4">
              {/* Quote */}
              <div 
                className="bg-primary/5 rounded-xl p-3 border-l-4 border-primary"
                role="group"
                aria-label="Loading member quote"
              >
                <Skeleton 
                  className="h-4 w-full"
                  ariaLabel={`Loading quote for team member ${i + 1}`}
                  announce={i === 0}
                />
              </div>

              {/* Name */}
              <Skeleton 
                className="h-7 w-2/3"
                ariaLabel={`Loading name for team member ${i + 1}`}
                announce={false}
              />

              {/* Role */}
              <Skeleton 
                className="h-5 w-1/2"
                ariaLabel={`Loading role for team member ${i + 1}`}
                announce={false}
              />

              {/* Location */}
              <Skeleton 
                className="h-4 w-3/4"
                ariaLabel={`Loading location for team member ${i + 1}`}
                announce={false}
              />

              {/* Description */}
              <div 
                className="space-y-2"
                role="group"
                aria-label="Loading member description"
              >
                <Skeleton 
                  className="h-4 w-full"
                  ariaLabel={`Loading bio line 1 for team member ${i + 1}`}
                  announce={false}
                />
                <Skeleton 
                  className="h-4 w-4/5"
                  ariaLabel={`Loading bio line 2 for team member ${i + 1}`}
                  announce={false}
                />
                <Skeleton 
                  className="h-3 w-full"
                  ariaLabel={`Loading specialty for team member ${i + 1}`}
                  announce={false}
                />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
