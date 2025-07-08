import { useState, useCallback } from "react";

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

interface UseWebShareReturn {
  isLoading: boolean;
  error: string | null;
  isSupported: boolean;
  share: (data: ShareData) => Promise<boolean>;
  canShare: (data?: ShareData) => boolean;
  clearError: () => void;
}

export const useWebShare = (): UseWebShareReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Web Share API is supported
  const isSupported =
    typeof navigator !== "undefined" &&
    "share" in navigator &&
    typeof navigator.share === "function";

  // Check if data can be shared
  const canShare = useCallback(
    (data?: ShareData): boolean => {
      if (!isSupported || !navigator.canShare) {
        return false;
      }

      if (!data) {
        return true;
      }

      try {
        return navigator.canShare(data);
      } catch {
        return false;
      }
    },
    [isSupported]
  );

  // Share data using the Web Share API
  const share = useCallback(
    async (data: ShareData): Promise<boolean> => {
      if (!isSupported || !navigator.share) {
        setError("Web Share API is not supported");
        return false;
      }

      // Validate that at least one known property is provided
      if (!data.title && !data.text && !data.url && !data.files?.length) {
        setError("At least one of title, text, url, or files must be provided");
        return false;
      }

      // Check if the data can be shared
      if (navigator.canShare && !navigator.canShare(data)) {
        setError("The provided data cannot be shared");
        return false;
      }

      try {
        setIsLoading(true);
        setError(null);

        await navigator.share(data);
        return true;
      } catch (err) {
        let errorMessage = "Failed to share";

        if (err instanceof Error) {
          // Handle specific error cases
          switch (err.name) {
            case "InvalidStateError":
              errorMessage =
                "Document is not fully active or other sharing operations are in progress";
              break;
            case "NotAllowedError":
              errorMessage =
                "Sharing is not allowed. This may be due to permissions policy, lack of user activation, or security restrictions";
              break;
            case "TypeError":
              errorMessage =
                "The share data is invalid. Check that URLs are properly formatted and data is valid";
              break;
            case "AbortError":
              errorMessage =
                "Share was cancelled by the user or no share targets are available";
              break;
            case "DataError":
              errorMessage =
                "There was a problem starting the share target or transmitting the data";
              break;
            default:
              errorMessage =
                err.message || "An unknown error occurred while sharing";
          }
        }

        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isSupported]
  );

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    isSupported,
    share,
    canShare,
    clearError,
  };
};
