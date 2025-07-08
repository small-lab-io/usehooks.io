import { useState, useEffect, useCallback } from "react";

interface User {
  id: string;
  roles: string[];
  [key: string]: any;
}

interface UseRoleGuardOptions {
  user?: User | null;
  redirectTo?: string;
  fallbackComponent?: React.ComponentType;
  onUnauthorized?: () => void;
  sessionKey?: string;
}

interface UseRoleGuardReturn {
  hasAccess: boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
  isLoading: boolean;
  user: User | null;
  checkAccess: (requiredRoles: string[]) => boolean;
  redirect: () => void;
}

export function useRoleGuard(
  requiredRoles: string[],
  options: UseRoleGuardOptions = {}
): UseRoleGuardReturn {
  const {
    user: providedUser,
    redirectTo = "/unauthorized",
    onUnauthorized,
    sessionKey = "user",
  } = options;

  const [user, setUser] = useState<User | null>(providedUser || null);
  const [isLoading, setIsLoading] = useState(!providedUser);

  // Get user from session storage if not provided
  useEffect(() => {
    if (!providedUser && typeof window !== "undefined") {
      try {
        const sessionUser = sessionStorage.getItem(sessionKey);
        if (sessionUser) {
          const parsedUser = JSON.parse(sessionUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error parsing user from session:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [providedUser, sessionKey]);

  // Check if user has any of the required roles
  const hasAnyRole = useCallback(
    (roles: string[]): boolean => {
      if (!user || !user.roles) return false;
      return roles.some((role) => user.roles.includes(role));
    },
    [user]
  );

  // Check if user has all of the required roles
  const hasAllRoles = useCallback(
    (roles: string[]): boolean => {
      if (!user || !user.roles) return false;
      return roles.every((role) => user.roles.includes(role));
    },
    [user]
  );

  // Check access based on required roles
  const checkAccess = useCallback(
    (roles: string[]): boolean => {
      return hasAnyRole(roles);
    },
    [hasAnyRole]
  );

  // Calculate if user has access to current resource
  const hasAccess = checkAccess(requiredRoles);

  // Redirect function
  const redirect = useCallback(() => {
    if (typeof window !== "undefined" && redirectTo) {
      window.location.href = redirectTo;
    }
  }, [redirectTo]);

  // Handle unauthorized access
  useEffect(() => {
    if (!isLoading && !hasAccess) {
      if (onUnauthorized) {
        onUnauthorized();
      } else if (redirectTo && typeof window !== "undefined") {
        redirect();
      }
    }
  }, [hasAccess, isLoading, onUnauthorized, redirect, redirectTo]);

  return {
    hasAccess,
    hasAnyRole,
    hasAllRoles,
    isLoading,
    user,
    checkAccess,
    redirect,
  };
}
