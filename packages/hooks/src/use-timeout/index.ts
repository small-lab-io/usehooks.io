import { useEffect, useRef, useCallback } from "react";

export interface UseTimeoutReturn {
  start: () => void;
  stop: () => void;
  reset: () => void;
  isActive: () => boolean;
}

export function useTimeout(
  callback: () => void,
  delay: number | null
): UseTimeoutReturn {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const start = useCallback(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only set timeout if delay is not null
    if (delay !== null) {
      timeoutRef.current = setTimeout(() => {
        callbackRef.current();
        timeoutRef.current = null;
      }, delay);
    }
  }, [delay]);

  const stop = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    start();
  }, [stop, start]);

  const isActive = useCallback(() => {
    return timeoutRef.current !== null;
  }, []);

  // Auto-start timeout when delay changes (if delay is not null)
  useEffect(() => {
    if (delay !== null) {
      start();
    } else {
      stop();
    }

    // Cleanup on unmount or when delay changes
    return stop;
  }, [delay, start, stop]);

  return { start, stop, reset, isActive };
}

// Simplified version that just runs the timeout automatically
export function useTimeoutEffect(
  callback: () => void,
  delay: number | null
): void {
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return;
    }

    const timeoutId = setTimeout(() => {
      callbackRef.current();
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [delay]);
}
