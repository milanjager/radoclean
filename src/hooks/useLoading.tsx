import { useState, useEffect } from "react";

interface UseLoadingOptions {
  delay?: number; // Delay before showing skeleton (avoid flash)
  minDuration?: number; // Minimum loading duration (avoid flicker)
}

/**
 * Hook to manage loading states with built-in delays
 * Prevents flash of loading content for fast operations
 */
export const useLoading = (
  isLoading: boolean,
  options: UseLoadingOptions = {}
) => {
  const { delay = 200, minDuration = 500 } = options;
  const [shouldShowLoading, setShouldShowLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);

  useEffect(() => {
    let delayTimer: NodeJS.Timeout;
    let minDurationTimer: NodeJS.Timeout;

    if (isLoading) {
      // Start delay timer
      delayTimer = setTimeout(() => {
        setShouldShowLoading(true);
        setLoadingStartTime(Date.now());
      }, delay);
    } else {
      // If loading stopped
      if (loadingStartTime) {
        const elapsed = Date.now() - loadingStartTime;
        const remaining = Math.max(0, minDuration - elapsed);

        // Ensure minimum duration
        minDurationTimer = setTimeout(() => {
          setShouldShowLoading(false);
          setLoadingStartTime(null);
        }, remaining);
      } else {
        setShouldShowLoading(false);
      }
    }

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(minDurationTimer);
    };
  }, [isLoading, delay, minDuration, loadingStartTime]);

  return shouldShowLoading;
};
