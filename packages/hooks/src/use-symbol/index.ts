"use client";

import { useState, useCallback, useMemo, useRef } from "react";

interface UseSymbolReturn {
  // Create new unique symbols
  createSymbol: (description?: string) => symbol;

  // Global symbol registry operations
  getGlobalSymbol: (key: string) => symbol;
  getSymbolKey: (symbol: symbol) => string | undefined;

  // Symbol utilities
  isSymbol: (value: any) => value is symbol;
  getDescription: (symbol: symbol) => string | undefined;

  // Well-known symbols
  wellKnownSymbols: {
    iterator: symbol;
    asyncIterator: symbol;
    hasInstance: symbol;
    isConcatSpreadable: symbol;
    species: symbol;
    toPrimitive: symbol;
    toStringTag: symbol;
    unscopables: symbol;
    match: symbol;
    matchAll: symbol;
    replace: symbol;
    search: symbol;
    split: symbol;
  };

  // Symbol collection management
  symbols: symbol[];
  addSymbol: (symbol: symbol) => void;
  removeSymbol: (symbol: symbol) => void;
  clearSymbols: () => void;
}

export function useSymbol(): UseSymbolReturn {
  const [symbols, setSymbols] = useState<symbol[]>([]);
  const symbolsRef = useRef<Set<symbol>>(new Set());

  const createSymbol = useCallback((description?: string): symbol => {
    const newSymbol = Symbol(description);
    setSymbols((prev) => [...prev, newSymbol]);
    symbolsRef.current.add(newSymbol);
    return newSymbol;
  }, []);

  const getGlobalSymbol = useCallback((key: string): symbol => {
    return Symbol.for(key);
  }, []);

  const getSymbolKey = useCallback((symbol: symbol): string | undefined => {
    return Symbol.keyFor(symbol);
  }, []);

  const isSymbol = useCallback((value: any): value is symbol => {
    return typeof value === "symbol";
  }, []);

  const getDescription = useCallback((symbol: symbol): string | undefined => {
    return symbol.description;
  }, []);

  const addSymbol = useCallback((symbol: symbol) => {
    if (!symbolsRef.current.has(symbol)) {
      setSymbols((prev) => [...prev, symbol]);
      symbolsRef.current.add(symbol);
    }
  }, []);

  const removeSymbol = useCallback((symbol: symbol) => {
    if (symbolsRef.current.has(symbol)) {
      setSymbols((prev) => prev.filter((s) => s !== symbol));
      symbolsRef.current.delete(symbol);
    }
  }, []);

  const clearSymbols = useCallback(() => {
    setSymbols([]);
    symbolsRef.current.clear();
  }, []);

  const wellKnownSymbols = useMemo(
    () => ({
      iterator: Symbol.iterator,
      asyncIterator: Symbol.asyncIterator,
      hasInstance: Symbol.hasInstance,
      isConcatSpreadable: Symbol.isConcatSpreadable,
      species: Symbol.species,
      toPrimitive: Symbol.toPrimitive,
      toStringTag: Symbol.toStringTag,
      unscopables: Symbol.unscopables,
      match: Symbol.match,
      matchAll: Symbol.matchAll,
      replace: Symbol.replace,
      search: Symbol.search,
      split: Symbol.split,
    }),
    []
  );

  return {
    createSymbol,
    getGlobalSymbol,
    getSymbolKey,
    isSymbol,
    getDescription,
    wellKnownSymbols,
    symbols,
    addSymbol,
    removeSymbol,
    clearSymbols,
  };
}
