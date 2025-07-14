"use client";

import { useState, useCallback } from "react";

interface UseArrayReturn<T> {
  array: T[];
  set: (newArray: T[]) => void;
  push: (...items: T[]) => void;
  pop: () => T | undefined;
  shift: () => T | undefined;
  unshift: (...items: T[]) => void;
  insert: (index: number, ...items: T[]) => void;
  remove: (index: number) => void;
  removeById: (id: any, key?: keyof T) => void;
  update: (index: number, item: T) => void;
  updateById: (id: any, item: Partial<T>, key?: keyof T) => void;
  clear: () => void;
  filter: (predicate: (item: T, index: number) => boolean) => void;
  sort: (compareFn?: (a: T, b: T) => number) => void;
  reverse: () => void;
  replace: (oldItem: T, newItem: T) => void;
  toggle: (item: T) => void;
  isEmpty: boolean;
  length: number;
}

export function useArray<T>(initialArray: T[] = []): UseArrayReturn<T> {
  const [array, setArray] = useState<T[]>(initialArray);

  const set = useCallback((newArray: T[]) => {
    setArray(newArray);
  }, []);

  const push = useCallback((...items: T[]) => {
    setArray((prev) => [...prev, ...items]);
  }, []);

  const pop = useCallback((): T | undefined => {
    let poppedItem: T | undefined;
    setArray((prev) => {
      if (prev.length === 0) return prev;
      poppedItem = prev[prev.length - 1];
      return prev.slice(0, -1);
    });
    return poppedItem;
  }, []);

  const shift = useCallback((): T | undefined => {
    let shiftedItem: T | undefined;
    setArray((prev) => {
      if (prev.length === 0) return prev;
      shiftedItem = prev[0];
      return prev.slice(1);
    });
    return shiftedItem;
  }, []);

  const unshift = useCallback((...items: T[]) => {
    setArray((prev) => [...items, ...prev]);
  }, []);

  const insert = useCallback((index: number, ...items: T[]) => {
    setArray((prev) => {
      const newArray = [...prev];
      newArray.splice(index, 0, ...items);
      return newArray;
    });
  }, []);

  const remove = useCallback((index: number) => {
    setArray((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const removeById = useCallback((id: any, key: keyof T = "id" as keyof T) => {
    setArray((prev) => prev.filter((item) => item[key] !== id));
  }, []);

  const update = useCallback((index: number, item: T) => {
    setArray((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      const newArray = [...prev];
      newArray[index] = item;
      return newArray;
    });
  }, []);

  const updateById = useCallback(
    (id: any, updates: Partial<T>, key: keyof T = "id" as keyof T) => {
      setArray((prev) =>
        prev.map((item) => (item[key] === id ? { ...item, ...updates } : item))
      );
    },
    []
  );

  const clear = useCallback(() => {
    setArray([]);
  }, []);

  const filter = useCallback(
    (predicate: (item: T, index: number) => boolean) => {
      setArray((prev) => prev.filter(predicate));
    },
    []
  );

  const sort = useCallback((compareFn?: (a: T, b: T) => number) => {
    setArray((prev) => [...prev].sort(compareFn));
  }, []);

  const reverse = useCallback(() => {
    setArray((prev) => [...prev].reverse());
  }, []);

  const replace = useCallback((oldItem: T, newItem: T) => {
    setArray((prev) => {
      const index = prev.indexOf(oldItem);
      if (index === -1) return prev;
      const newArray = [...prev];
      newArray[index] = newItem;
      return newArray;
    });
  }, []);

  const toggle = useCallback((item: T) => {
    setArray((prev) => {
      const index = prev.indexOf(item);
      if (index === -1) {
        return [...prev, item];
      } else {
        return prev.filter((_, i) => i !== index);
      }
    });
  }, []);

  return {
    array,
    set,
    push,
    pop,
    shift,
    unshift,
    insert,
    remove,
    removeById,
    update,
    updateById,
    clear,
    filter,
    sort,
    reverse,
    replace,
    toggle,
    isEmpty: array.length === 0,
    length: array.length,
  };
}

export default useArray;
