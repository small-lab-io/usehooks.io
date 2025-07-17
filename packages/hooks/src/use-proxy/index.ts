"use client";

import { useState, useCallback, useMemo } from "react";

type ProxyHandler<T extends object> = {
  get?: (target: T, property: string | symbol, receiver: any) => any;
  set?: (
    target: T,
    property: string | symbol,
    value: any,
    receiver: any
  ) => boolean;
  has?: (target: T, property: string | symbol) => boolean;
  deleteProperty?: (target: T, property: string | symbol) => boolean;
  ownKeys?: (target: T) => ArrayLike<string | symbol>;
  getOwnPropertyDescriptor?: (
    target: T,
    property: string | symbol
  ) => PropertyDescriptor | undefined;
  defineProperty?: (
    target: T,
    property: string | symbol,
    attributes: PropertyDescriptor
  ) => boolean;
  preventExtensions?: (target: T) => boolean;
  getPrototypeOf?: (target: T) => object | null;
  isExtensible?: (target: T) => boolean;
  setPrototypeOf?: (target: T, prototype: object | null) => boolean;
  apply?: (target: T, thisArg: any, argArray: any[]) => any;
  construct?: (target: T, argArray: any[], newTarget: Function) => object;
};

interface UseProxyReturn<T extends object> {
  proxy: T;
  target: T;
  updateTarget: (newTarget: T | ((prevTarget: T) => T)) => void;
  revoke: () => void;
  isRevoked: boolean;
}

export function useProxy<T extends object>(
  initialTarget: T,
  handler: ProxyHandler<T>
): UseProxyReturn<T> {
  const [target, setTarget] = useState<T>(initialTarget);
  const [isRevoked, setIsRevoked] = useState(false);

  // Create a revocable proxy
  const { proxy, revoke: revokeProxy } = useMemo(() => {
    if (isRevoked) {
      return { proxy: target, revoke: () => {} };
    }
    return Proxy.revocable(target, handler);
  }, [target, handler, isRevoked]);

  const updateTarget = useCallback(
    (newTarget: T | ((prevTarget: T) => T)) => {
      if (isRevoked) {
        console.warn("Cannot update target of a revoked proxy");
        return;
      }
      setTarget((prevTarget) =>
        typeof newTarget === "function"
          ? (newTarget as (prevTarget: T) => T)(prevTarget)
          : newTarget
      );
    },
    [isRevoked]
  );

  const revoke = useCallback(() => {
    if (!isRevoked) {
      revokeProxy();
      setIsRevoked(true);
    }
  }, [revokeProxy, isRevoked]);

  return {
    proxy: isRevoked ? target : proxy,
    target,
    updateTarget,
    revoke,
    isRevoked,
  };
}
