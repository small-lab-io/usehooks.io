"use client";

import { useCallback } from "react";

type ClosureFunction<T = any, R = any> = (...args: T[]) => R;
type ClosureFactory<T = any, R = any> = (
  ...outerArgs: any[]
) => ClosureFunction<T, R>;

interface PrivateState<T> {
  get: () => T;
  set: (value: T | ((prev: T) => T)) => void;
  reset: () => void;
}

interface UseClosureReturn {
  // Create a closure with private state
  createPrivateState: <T>(initialValue: T) => PrivateState<T>;

  // Create a counter closure (classic example)
  createCounter: (initialValue?: number) => {
    increment: () => number;
    decrement: () => number;
    getValue: () => number;
    reset: () => void;
  };

  // Create a memoization closure
  createMemoizer: <T extends any[], R>(
    fn: (...args: T) => R
  ) => (...args: T) => R;

  // Create a closure with multiple private variables
  createModule: <T extends Record<string, any>>(
    initialState: T,
    methods: Record<string, (state: T, ...args: any[]) => any>
  ) => Record<string, (...args: any[]) => any>;

  // Create a closure-based event emitter
  createEventEmitter: () => {
    on: (event: string, callback: Function) => () => void;
    emit: (event: string, ...args: any[]) => void;
    off: (event: string, callback?: Function) => void;
    getListeners: (event: string) => Function[];
  };

  // Create a closure with access control
  createSecureState: <T>(
    initialValue: T,
    validator?: (value: T) => boolean
  ) => {
    read: () => T;
    write: (value: T) => boolean;
    isValid: (value: T) => boolean;
  };

  // Utility to demonstrate closure scope
  demonstrateScope: () => {
    outerVar: string;
    createInner: (innerVar: string) => () => string;
  };
}

export function useClosure(): UseClosureReturn {
  const createPrivateState = useCallback(
    <T>(initialValue: T): PrivateState<T> => {
      let privateValue = initialValue;
      const originalValue = initialValue;

      return {
        get: () => privateValue,
        set: (value: T | ((prev: T) => T)) => {
          privateValue =
            typeof value === "function"
              ? (value as (prev: T) => T)(privateValue)
              : value;
        },
        reset: () => {
          privateValue = originalValue;
        },
      };
    },
    []
  );

  const createCounter = useCallback((initialValue: number = 0) => {
    let count = initialValue;
    const initial = initialValue;

    return {
      increment: () => ++count,
      decrement: () => --count,
      getValue: () => count,
      reset: () => {
        count = initial;
      },
    };
  }, []);

  const createMemoizer = useCallback(
    <T extends any[], R>(fn: (...args: T) => R) => {
      const cache = new Map<string, R>();

      return (...args: T): R => {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
          return cache.get(key)!;
        }

        const result = fn(...args);
        cache.set(key, result);
        return result;
      };
    },
    []
  );

  const createModule = useCallback(
    <T extends Record<string, any>>(
      initialState: T,
      methods: Record<string, (state: T, ...args: any[]) => any>
    ) => {
      let state = { ...initialState };
      const publicMethods: Record<string, (...args: any[]) => any> = {};

      // Create public methods that have access to private state
      Object.keys(methods).forEach((methodName) => {
        publicMethods[methodName] = (...args: any[]) => {
          const method = methods[methodName];
          if (typeof method === "function") {
            return method(state, ...args);
          }
          throw new Error(`Method ${methodName} is not defined`);
        };
      });

      // Add state management methods
      publicMethods.getState = () => ({ ...state });
      publicMethods.setState = (newState: Partial<T>) => {
        state = { ...state, ...newState };
      };

      return publicMethods;
    },
    []
  );

  const createEventEmitter = useCallback(() => {
    const listeners = new Map<string, Set<Function>>();

    return {
      on: (event: string, callback: Function) => {
        if (!listeners.has(event)) {
          listeners.set(event, new Set());
        }
        listeners.get(event)!.add(callback);

        // Return unsubscribe function (closure over callback)
        return () => {
          listeners.get(event)?.delete(callback);
        };
      },

      emit: (event: string, ...args: any[]) => {
        const eventListeners = listeners.get(event);
        if (eventListeners) {
          eventListeners.forEach((callback) => callback(...args));
        }
      },

      off: (event: string, callback?: Function) => {
        if (callback) {
          listeners.get(event)?.delete(callback);
        } else {
          listeners.delete(event);
        }
      },

      getListeners: (event: string) => {
        return Array.from(listeners.get(event) || []);
      },
    };
  }, []);

  const createSecureState = useCallback(
    <T>(initialValue: T, validator?: (value: T) => boolean) => {
      let secureValue = initialValue;

      const isValid = (value: T): boolean => {
        return validator ? validator(value) : true;
      };

      return {
        read: () => secureValue,
        write: (value: T): boolean => {
          if (isValid(value)) {
            secureValue = value;
            return true;
          }
          return false;
        },
        isValid,
      };
    },
    []
  );

  const demonstrateScope = useCallback(() => {
    const outerVar = "I'm in the outer scope";

    return {
      outerVar,
      createInner: (innerVar: string) => {
        // This function closes over both outerVar and innerVar
        return () => `${outerVar} and ${innerVar} (from inner scope)`;
      },
    };
  }, []);

  return {
    createPrivateState,
    createCounter,
    createMemoizer,
    createModule,
    createEventEmitter,
    createSecureState,
    demonstrateScope,
  };
}
