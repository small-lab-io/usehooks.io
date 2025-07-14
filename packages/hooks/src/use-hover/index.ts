'use client';

import { useState, useCallback, useRef, useEffect } from "react";

interface UseHoverOptions {
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  delay?: number;
}

interface UseHoverReturn<T extends HTMLElement = HTMLElement> {
  isHovered: boolean;
  ref: React.RefObject<T>;
}

export const useHover = <T extends HTMLElement = HTMLElement>(
  options: UseHoverOptions = {}
): UseHoverReturn<T> => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<T>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { onHoverStart, onHoverEnd, delay = 0 } = options;

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsHovered(true);
        onHoverStart?.();
      }, delay);
    } else {
      setIsHovered(true);
      onHoverStart?.();
    }
  }, [onHoverStart, delay]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsHovered(false);
    onHoverEnd?.();
  }, [onHoverEnd]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleMouseEnter, handleMouseLeave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isHovered,
    ref: ref as React.RefObject<T>,
  };
};
