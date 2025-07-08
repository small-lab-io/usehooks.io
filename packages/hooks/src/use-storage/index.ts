import { useState, useEffect, useCallback } from "react";

interface StorageEstimate {
  quota?: number;
  usage?: number;
  usageDetails?: {
    [key: string]: number;
  };
}

interface UseStorageReturn {
  // Storage estimation
  estimate: StorageEstimate | null;
  isLoading: boolean;
  error: string | null;

  // Persistence management
  isPersistent: boolean | null;

  // Methods
  getEstimate: () => Promise<StorageEstimate | null>;
  requestPersistentStorage: () => Promise<boolean>;
  checkPersistence: () => Promise<boolean>;

  // Computed values
  usagePercentage: number | null;
  isSupported: boolean;
}

export const useStorage = (): UseStorageReturn => {
  const [estimate, setEstimate] = useState<StorageEstimate | null>(null);
  const [isPersistent, setIsPersistent] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Storage API is supported
  const isSupported =
    typeof navigator !== "undefined" &&
    "storage" in navigator &&
    typeof navigator.storage.estimate === "function";

  // Get storage estimate
  const getEstimate = useCallback(async (): Promise<StorageEstimate | null> => {
    if (!isSupported) {
      setError("Storage API is not supported");
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      const storageEstimate = await navigator.storage.estimate();
      setEstimate(storageEstimate);
      return storageEstimate;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get storage estimate";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // Request persistent storage
  const requestPersistentStorage = useCallback(async (): Promise<boolean> => {
    if (!isSupported || !navigator.storage.persist) {
      setError("Persistent storage is not supported");
      return false;
    }

    try {
      setError(null);
      const persistent = await navigator.storage.persist();
      setIsPersistent(persistent);
      return persistent;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to request persistent storage";
      setError(errorMessage);
      return false;
    }
  }, [isSupported]);

  // Check if storage is persistent
  const checkPersistence = useCallback(async (): Promise<boolean> => {
    if (!isSupported || !navigator.storage.persisted) {
      setError("Persistence check is not supported");
      return false;
    }

    try {
      setError(null);
      const persistent = await navigator.storage.persisted();
      setIsPersistent(persistent);
      return persistent;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to check persistence";
      setError(errorMessage);
      return false;
    }
  }, [isSupported]);

  // Calculate usage percentage
  const usagePercentage =
    estimate?.quota && estimate?.usage
      ? Math.round((estimate.usage / estimate.quota) * 100)
      : null;

  // Initialize on mount
  useEffect(() => {
    if (isSupported) {
      getEstimate();
      checkPersistence();
    }
  }, [isSupported, getEstimate, checkPersistence]);

  return {
    estimate,
    isLoading,
    error,
    isPersistent,
    getEstimate,
    requestPersistentStorage,
    checkPersistence,
    usagePercentage,
    isSupported,
  };
};
