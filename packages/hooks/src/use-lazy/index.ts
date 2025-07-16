"use client";

import { lazy, useState, useCallback, useRef, ComponentType } from "react";

export interface UseLazyOptions {
  /** Preload the component immediately */
  preload?: boolean;
  /** Callback when component starts loading */
  onLoadStart?: () => void;
  /** Callback when component loads successfully */
  onLoadSuccess?: (component: ComponentType<any>) => void;
  /** Callback when component fails to load */
  onLoadError?: (error: Error) => void;
}

export interface UseLazyReturn<T extends ComponentType<any>> {
  /** The lazy component */
  Component: T | null;
  /** Whether the component is currently loading */
  loading: boolean;
  /** Loading error if any */
  error: Error | null;
  /** Manually trigger component loading */
  load: () => Promise<T | null>;
  /** Preload the component without rendering */
  preload: () => Promise<T | null>;
  /** Reset the loading state */
  reset: () => void;
}

export function useLazy<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T } | T>,
  options: UseLazyOptions = {}
): UseLazyReturn<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [Component, setComponent] = useState<T | null>(null);

  const loadPromiseRef = useRef<Promise<T | null> | null>(null);
  const lazyComponentRef = useRef<T | null | React.LazyExoticComponent<T>>(
    null
  );
  const hasLoadedRef = useRef(false);

  const load = useCallback(async (): Promise<T | null> => {
    // Return existing promise if already loading
    if (loadPromiseRef.current) {
      return loadPromiseRef.current;
    }

    // Return cached component if already loaded
    if (hasLoadedRef.current && lazyComponentRef.current) {
      return lazyComponentRef.current as T;
    }

    setLoading(true);
    setError(null);
    options.onLoadStart?.();

    loadPromiseRef.current = (async () => {
      try {
        const module = await importFn();
        const component = "default" in module ? module.default : module;

        lazyComponentRef.current = component as T;
        hasLoadedRef.current = true;
        setComponent(component as T);
        setLoading(false);
        options.onLoadSuccess?.(component as T);

        return component as T;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to load component");
        setError(error);
        setLoading(false);
        options.onLoadError?.(error);
        throw error;
      } finally {
        loadPromiseRef.current = null;
      }
    })();

    return loadPromiseRef.current;
  }, [importFn, options]);

  const preload = useCallback(async (): Promise<T | null> => {
    try {
      return await load();
    } catch (error) {
      // Preload failures are silent by default
      return null;
    }
  }, [load]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setComponent(null);
    hasLoadedRef.current = false;
    lazyComponentRef.current = null;
    loadPromiseRef.current = null;
  }, []);

  // Create lazy component that triggers loading
  const LazyComponent = useCallback(() => {
    if (!lazyComponentRef.current) {
      // Create a lazy component that will trigger our load function
      lazyComponentRef.current = lazy(async () => {
        const component = await load();
        return { default: component } as { default: T };
      });
    }
    return lazyComponentRef.current;
  }, [load]);

  // Preload if requested
  useState(() => {
    if (options.preload) {
      preload();
    }
  });

  return {
    Component: Component as T | null,
    loading,
    error,
    load,
    preload,
    reset,
  };
}
