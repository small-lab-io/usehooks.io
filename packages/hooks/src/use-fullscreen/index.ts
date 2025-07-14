'use client';

import { useState, useEffect, useCallback, useRef } from "react";

export interface UseFullscreenOptions {
  onEnter?: () => void;
  onExit?: () => void;
  onError?: (error: Error) => void;
}

export interface UseFullscreenReturn {
  isFullscreen: boolean;
  isSupported: boolean;
  enter: (element?: Element) => Promise<void>;
  exit: () => Promise<void>;
  toggle: (element?: Element) => Promise<void>;
  element: Element | null;
}

export function useFullscreen(
  targetRef?: React.RefObject<Element>,
  options: UseFullscreenOptions = {}
): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [element, setElement] = useState<Element | null>(null);
  const optionsRef = useRef(options);

  // Update options ref when options change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Check if fullscreen is supported
  const isSupported = Boolean(
    document.fullscreenEnabled ||
      (document as any).webkitFullscreenEnabled ||
      (document as any).mozFullScreenEnabled ||
      (document as any).msFullscreenEnabled
  );

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement;

      const isCurrentlyFullscreen = Boolean(fullscreenElement);
      setIsFullscreen(isCurrentlyFullscreen);
      setElement(fullscreenElement);

      if (isCurrentlyFullscreen) {
        optionsRef.current.onEnter?.();
      } else {
        optionsRef.current.onExit?.();
      }
    };

    const handleFullscreenError = () => {
      optionsRef.current.onError?.(
        new Error("Failed to enter fullscreen mode")
      );
    };

    // Add event listeners for different browsers
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    document.addEventListener("fullscreenerror", handleFullscreenError);
    document.addEventListener("webkitfullscreenerror", handleFullscreenError);
    document.addEventListener("mozfullscreenerror", handleFullscreenError);
    document.addEventListener("MSFullscreenError", handleFullscreenError);

    // Set initial state
    handleFullscreenChange();

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );

      document.removeEventListener("fullscreenerror", handleFullscreenError);
      document.removeEventListener(
        "webkitfullscreenerror",
        handleFullscreenError
      );
      document.removeEventListener("mozfullscreenerror", handleFullscreenError);
      document.removeEventListener("MSFullscreenError", handleFullscreenError);
    };
  }, []);

  const enter = useCallback(
    async (elementToFullscreen?: Element) => {
      if (!isSupported) {
        throw new Error("Fullscreen API is not supported");
      }

      const target =
        elementToFullscreen || targetRef?.current || document.documentElement;

      if (!target) {
        throw new Error("No element provided for fullscreen");
      }

      try {
        if (target.requestFullscreen) {
          await target.requestFullscreen();
        } else if ((target as any).webkitRequestFullscreen) {
          await (target as any).webkitRequestFullscreen();
        } else if ((target as any).mozRequestFullScreen) {
          await (target as any).mozRequestFullScreen();
        } else if ((target as any).msRequestFullscreen) {
          await (target as any).msRequestFullscreen();
        } else {
          throw new Error("Fullscreen API is not supported");
        }
      } catch (error) {
        optionsRef.current.onError?.(error as Error);
        throw error;
      }
    },
    [isSupported, targetRef]
  );

  const exit = useCallback(async () => {
    if (!isSupported) {
      throw new Error("Fullscreen API is not supported");
    }

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      } else {
        throw new Error("Fullscreen API is not supported");
      }
    } catch (error) {
      optionsRef.current.onError?.(error as Error);
      throw error;
    }
  }, [isSupported]);

  const toggle = useCallback(
    async (elementToFullscreen?: Element) => {
      if (isFullscreen) {
        await exit();
      } else {
        await enter(elementToFullscreen);
      }
    },
    [isFullscreen, enter, exit]
  );

  return {
    isFullscreen,
    isSupported,
    enter,
    exit,
    toggle,
    element,
  };
}
