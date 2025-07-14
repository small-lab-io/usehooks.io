'use client';

import { useState, useCallback, useRef, useEffect } from "react";

interface UseUserMediaConstraints {
  video?: boolean | MediaTrackConstraints;
  audio?: boolean | MediaTrackConstraints;
}

interface UseUserMediaReturn {
  stream: MediaStream | null;
  error: string | null;
  isLoading: boolean;
  isSupported: boolean;
  startCapture: (constraints?: UseUserMediaConstraints) => Promise<void>;
  stopCapture: () => void;
}

const DEFAULT_CONSTRAINTS: UseUserMediaConstraints = {
  video: true,
  audio: true,
};

export const useUserMedia = (
  initialConstraints: UseUserMediaConstraints = DEFAULT_CONSTRAINTS
): UseUserMediaReturn => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const isSupported =
    typeof navigator !== "undefined" &&
    "mediaDevices" in navigator &&
    "getUserMedia" in navigator.mediaDevices;

  const stopCapture = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
      setStream(null);
    }
    setError(null);
  }, []);

  const startCapture = useCallback(
    async (constraints: UseUserMediaConstraints = initialConstraints) => {
      if (!isSupported) {
        setError("getUserMedia is not supported in this browser");
        return;
      }

      // Stop any existing stream
      stopCapture();

      setIsLoading(true);
      setError(null);

      try {
        const mediaStream =
          await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = mediaStream;
        setStream(mediaStream);
      } catch (err) {
        let errorMessage = "Failed to access media devices";

        if (err instanceof Error) {
          switch (err.name) {
            case "NotAllowedError":
              errorMessage =
                "Permission denied. Please allow camera/microphone access.";
              break;
            case "NotFoundError":
              errorMessage = "No camera or microphone found.";
              break;
            case "NotReadableError":
              errorMessage = "Camera or microphone is already in use.";
              break;
            case "OverconstrainedError":
              errorMessage =
                "Camera or microphone constraints cannot be satisfied.";
              break;
            case "SecurityError":
              errorMessage = "Security error. Make sure you're using HTTPS.";
              break;
            case "AbortError":
              errorMessage = "Media access was aborted.";
              break;
            default:
              errorMessage = err.message || errorMessage;
          }
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [isSupported, initialConstraints, stopCapture]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, [stopCapture]);

  return {
    stream,
    error,
    isLoading,
    isSupported,
    startCapture,
    stopCapture,
  };
};

export default useUserMedia;
