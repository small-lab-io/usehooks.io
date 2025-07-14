"use client";

import { useState, useCallback } from "react";

interface UseSetReturn<T> {
  set: Set<T>;
  add: (value: T) => void;
  addMultiple: (...values: T[]) => void;
  remove: (value: T) => boolean;
  removeMultiple: (...values: T[]) => void;
  clear: () => void;
  has: (value: T) => boolean;
  toggle: (value: T) => void;
  replace: (oldValue: T, newValue: T) => boolean;
  filter: (predicate: (value: T) => boolean) => void;
  union: (otherSet: Set<T> | T[]) => void;
  intersection: (otherSet: Set<T> | T[]) => void;
  difference: (otherSet: Set<T> | T[]) => void;
  isSubsetOf: (otherSet: Set<T> | T[]) => boolean;
  isSupersetOf: (otherSet: Set<T> | T[]) => boolean;
  toArray: () => T[];
  reset: () => void;
  size: number;
  isEmpty: boolean;
}

export function useSet<T>(initialValues?: T[] | Set<T>): UseSetReturn<T> {
  const [set, setSet] = useState<Set<T>>(() => {
    if (initialValues instanceof Set) {
      return new Set(initialValues);
    }
    return new Set(initialValues || []);
  });

  const add = useCallback((value: T) => {
    setSet((prev) => {
      if (prev.has(value)) return prev;
      const newSet = new Set(prev);
      newSet.add(value);
      return newSet;
    });
  }, []);

  const addMultiple = useCallback((...values: T[]) => {
    setSet((prev) => {
      const newSet = new Set(prev);
      let hasChanges = false;
      values.forEach((value) => {
        if (!newSet.has(value)) {
          newSet.add(value);
          hasChanges = true;
        }
      });
      return hasChanges ? newSet : prev;
    });
  }, []);

  const remove = useCallback((value: T): boolean => {
    let wasRemoved = false;
    setSet((prev) => {
      if (!prev.has(value)) {
        wasRemoved = false;
        return prev;
      }
      const newSet = new Set(prev);
      wasRemoved = newSet.delete(value);
      return newSet;
    });
    return wasRemoved;
  }, []);

  const removeMultiple = useCallback((...values: T[]) => {
    setSet((prev) => {
      const newSet = new Set(prev);
      let hasChanges = false;
      values.forEach((value) => {
        if (newSet.delete(value)) {
          hasChanges = true;
        }
      });
      return hasChanges ? newSet : prev;
    });
  }, []);

  const clear = useCallback(() => {
    setSet((prev) => (prev.size === 0 ? prev : new Set()));
  }, []);

  const has = useCallback(
    (value: T): boolean => {
      return set.has(value);
    },
    [set]
  );

  const toggle = useCallback((value: T) => {
    setSet((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  }, []);

  const replace = useCallback((oldValue: T, newValue: T): boolean => {
    let wasReplaced = false;
    setSet((prev) => {
      if (!prev.has(oldValue)) {
        wasReplaced = false;
        return prev;
      }
      const newSet = new Set(prev);
      newSet.delete(oldValue);
      newSet.add(newValue);
      wasReplaced = true;
      return newSet;
    });
    return wasReplaced;
  }, []);

  const filter = useCallback((predicate: (value: T) => boolean) => {
    setSet((prev) => {
      const newSet = new Set<T>();
      let hasChanges = false;
      prev.forEach((value) => {
        if (predicate(value)) {
          newSet.add(value);
        } else {
          hasChanges = true;
        }
      });
      return hasChanges ? newSet : prev;
    });
  }, []);

  const union = useCallback(
    (otherSet: Set<T> | T[]) => {
      const otherValues = Array.isArray(otherSet)
        ? otherSet
        : Array.from(otherSet);
      addMultiple(...otherValues);
    },
    [addMultiple]
  );

  const intersection = useCallback((otherSet: Set<T> | T[]) => {
    const otherSetInstance = Array.isArray(otherSet)
      ? new Set(otherSet)
      : otherSet;
    setSet((prev) => {
      const newSet = new Set<T>();
      prev.forEach((value) => {
        if (otherSetInstance.has(value)) {
          newSet.add(value);
        }
      });
      return newSet.size !== prev.size ? newSet : prev;
    });
  }, []);

  const difference = useCallback((otherSet: Set<T> | T[]) => {
    const otherSetInstance = Array.isArray(otherSet)
      ? new Set(otherSet)
      : otherSet;
    setSet((prev) => {
      const newSet = new Set<T>();
      let hasChanges = false;
      prev.forEach((value) => {
        if (!otherSetInstance.has(value)) {
          newSet.add(value);
        } else {
          hasChanges = true;
        }
      });
      return hasChanges ? newSet : prev;
    });
  }, []);

  const isSubsetOf = useCallback(
    (otherSet: Set<T> | T[]): boolean => {
      const otherSetInstance = Array.isArray(otherSet)
        ? new Set(otherSet)
        : otherSet;
      for (const value of set) {
        if (!otherSetInstance.has(value)) {
          return false;
        }
      }
      return true;
    },
    [set]
  );

  const isSupersetOf = useCallback(
    (otherSet: Set<T> | T[]): boolean => {
      const otherSetInstance = Array.isArray(otherSet)
        ? new Set(otherSet)
        : otherSet;
      for (const value of otherSetInstance) {
        if (!set.has(value)) {
          return false;
        }
      }
      return true;
    },
    [set]
  );

  const toArray = useCallback((): T[] => {
    return Array.from(set);
  }, [set]);

  const reset = useCallback(() => {
    const initialSet =
      initialValues instanceof Set
        ? new Set(initialValues)
        : new Set(initialValues || []);
    setSet(initialSet);
  }, [initialValues]);

  return {
    set,
    add,
    addMultiple,
    remove,
    removeMultiple,
    clear,
    has,
    toggle,
    replace,
    filter,
    union,
    intersection,
    difference,
    isSubsetOf,
    isSupersetOf,
    toArray,
    reset,
    size: set.size,
    isEmpty: set.size === 0,
  };
}

export default useSet;
