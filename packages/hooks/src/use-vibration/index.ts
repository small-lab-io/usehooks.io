import { useCallback, useRef } from "react";

interface UseVibrationReturn {
  vibrate: (pattern: number | number[]) => boolean;
  stop: () => void;
  isSupported: boolean;
}

export const useVibration = (): UseVibrationReturn => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isSupported =
    typeof navigator !== "undefined" && "vibrate" in navigator;

  const vibrate = useCallback(
    (pattern: number | number[]): boolean => {
      if (!isSupported) {
        return false;
      }

      try {
        return navigator.vibrate(pattern);
      } catch (error) {
        console.warn("Vibration failed:", error);
        return false;
      }
    },
    [isSupported]
  );

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isSupported) {
      navigator.vibrate(0);
    }
  }, [isSupported]);

  return {
    vibrate,
    stop,
    isSupported,
  };
};

export default useVibration;
