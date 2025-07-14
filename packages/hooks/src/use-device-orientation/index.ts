'use client';

import { useState, useEffect, useCallback } from "react";

interface DeviceOrientation {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  absolute: boolean;
  webkitCompassHeading?: number;
  webkitCompassAccuracy?: number;
}

interface UseDeviceOrientationOptions {
  absolute?: boolean;
}

interface UseDeviceOrientationReturn {
  orientation: DeviceOrientation | null;
  isSupported: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  startListening: () => void;
  stopListening: () => void;
  isListening: boolean;
}

// Extend DeviceOrientationEvent interface for webkit properties
declare global {
  interface DeviceOrientationEvent {
    webkitCompassHeading?: number;
    webkitCompassAccuracy?: number;
  }
}

export const useDeviceOrientation = (
  options: UseDeviceOrientationOptions = {}
): UseDeviceOrientationReturn => {
  const [orientation, setOrientation] = useState<DeviceOrientation | null>(
    null
  );
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if DeviceOrientationEvent is supported
  const isSupported =
    typeof window !== "undefined" && "DeviceOrientationEvent" in window;

  // Handle orientation change
  const handleOrientationChange = useCallback(
    (event: DeviceOrientationEvent) => {
      setOrientation({
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
        absolute: event.absolute,
        webkitCompassHeading: event.webkitCompassHeading,
        webkitCompassAccuracy: event.webkitCompassAccuracy,
      });
    },
    []
  );

  // Request permission for iOS 13+ devices
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError("DeviceOrientationEvent is not supported");
      return false;
    }

    try {
      setError(null);

      // Check if permission is required (iOS 13+)
      if (
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        const permission = await (
          DeviceOrientationEvent as any
        ).requestPermission();

        if (permission === "granted") {
          return true;
        } else {
          setError("Permission denied for device orientation");
          return false;
        }
      }

      // Permission not required or already granted
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to request permission";
      setError(errorMessage);
      return false;
    }
  }, [isSupported]);

  // Start listening to orientation changes
  const startListening = useCallback(() => {
    if (!isSupported || isListening) return;

    try {
      setError(null);
      window.addEventListener(
        "deviceorientation",
        handleOrientationChange,
        true
      );
      setIsListening(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start listening";
      setError(errorMessage);
    }
  }, [isSupported, isListening, handleOrientationChange]);

  // Stop listening to orientation changes
  const stopListening = useCallback(() => {
    if (!isSupported || !isListening) return;

    try {
      window.removeEventListener(
        "deviceorientation",
        handleOrientationChange,
        true
      );
      setIsListening(false);
      setOrientation(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to stop listening";
      setError(errorMessage);
    }
  }, [isSupported, isListening, handleOrientationChange]);

  // Auto-start listening if absolute option is provided
  useEffect(() => {
    if (options.absolute !== undefined && isSupported) {
      const initializeOrientation = async () => {
        const hasPermission = await requestPermission();
        if (hasPermission) {
          startListening();
        }
      };

      initializeOrientation();
    }

    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [options.absolute, isSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isListening, stopListening]);

  return {
    orientation,
    isSupported,
    error,
    requestPermission,
    startListening,
    stopListening,
    isListening,
  };
};
