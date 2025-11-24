import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SkeletonText, SkeletonCard, SkeletonList } from "@/components/skeleton";
import { useLoading } from "@/hooks/useLoading";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Demo showing accessibility features of skeleton components
 */
const AccessibilityDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showA11yInfo, setShowA11yInfo] = useState(true);
  const shouldShowSkeleton = useLoading(isLoading);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Skeleton Accessibility Features
            </h2>
            <p className="text-muted-foreground mb-6">
              Our skeletons are fully accessible with screen reader support
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={simulateLoading}
                disabled={isLoading}
                variant="premium"
              >
                {isLoading ? "Loading..." : "Test Loading"}
              </Button>
              <Button
                onClick={() => setShowA11yInfo(!showA11yInfo)}
                variant="outline"
              >
                {showA11yInfo ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
                {showA11yInfo ? "Hide" : "Show"} A11y Info
              </Button>
            </div>
          </div>

          {showA11yInfo && (
            <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-primary" />
                Screen Reader Experience
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>ARIA roles:</strong> Each skeleton has role="status" to announce loading state</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Live regions:</strong> aria-live="polite" announces changes without interrupting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Content hints:</strong> Descriptive labels explain what is being loaded</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Smart announcements:</strong> Only first item announces to avoid spam</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Semantic HTML:</strong> Proper article, list, and figure elements</span>
                </li>
              </ul>
            </Card>
          )}

          <div className="space-y-8">
            {/* Text Skeleton Example */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Text Content</h3>
              {shouldShowSkeleton ? (
                <SkeletonText lines={3} contentType="article content" />
              ) : (
                <div className="space-y-2">
                  <p className="text-muted-foreground">
                    This is a sample paragraph that appears after loading completes.
                  </p>
                  <p className="text-muted-foreground">
                    Screen readers announce "Loading article content" during the skeleton state.
                  </p>
                  <p className="text-muted-foreground">
                    Then smoothly transition to reading the actual content.
                  </p>
                </div>
              )}
            </Card>

            {/* Card Skeleton Example */}
            <div>
              <h3 className="font-semibold mb-4">Card with Image</h3>
              {shouldShowSkeleton ? (
                <SkeletonCard 
                  hasImage 
                  hasAvatar 
                  textLines={3}
                  contentType="team member profile"
                />
              ) : (
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20" />
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10" />
                      <div>
                        <p className="font-semibold">Jana Nováková</p>
                        <p className="text-sm text-muted-foreground">Vedoucí týmu</p>
                      </div>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Team Member Profile</h4>
                    <p className="text-muted-foreground">
                      Loaded content with proper semantic structure and ARIA labels.
                    </p>
                  </div>
                </Card>
              )}
            </div>

            {/* List Skeleton Example */}
            <div>
              <h3 className="font-semibold mb-4">List Items</h3>
              {shouldShowSkeleton ? (
                <SkeletonList items={3} hasImage contentType="service offerings" />
              ) : (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-card rounded-xl border">
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold mb-1">Service {i}</h5>
                        <p className="text-sm text-muted-foreground">
                          Description of the service offering.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Testing Guide */}
          <Card className="p-6 mt-12 bg-muted/50">
            <h3 className="font-semibold mb-4">Testing Accessibility</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <strong className="text-foreground">With Screen Reader:</strong>
                <p>Enable VoiceOver (Mac), NVDA (Windows), or JAWS and navigate through loading states</p>
              </div>
              <div>
                <strong className="text-foreground">Keyboard Navigation:</strong>
                <p>Use Tab key to navigate - focus indicators should be visible on all interactive elements</p>
              </div>
              <div>
                <strong className="text-foreground">Browser DevTools:</strong>
                <p>Open Accessibility tab in Chrome/Firefox DevTools to inspect ARIA attributes</p>
              </div>
              <div>
                <strong className="text-foreground">axe DevTools:</strong>
                <p>Install axe browser extension to automatically check for accessibility issues</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AccessibilityDemo;
