// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { getMe } from "@/data/api/user.api";
import type { UserPublic } from "@/data/api/companies.api";

let cachedUser: UserPublic | null = null;
let isLoaded = false;
let pending: Promise<void> | null = null;

export const useAuth = () => {
  const [user, setUser] = useState<UserPublic | null>(
    cachedUser
  );
  const [isLoading, setIsLoading] = useState(!isLoaded);

  useEffect(() => {
    if (isLoaded) return;

    if (!pending) {
      pending = (async () => {
        try {
          cachedUser = await getMe();
        } catch {
          cachedUser = null;
        } finally {
          isLoaded = true;
          pending = null;
        }
      })();
    }

    pending.then(() => {
      setUser(cachedUser);
      setIsLoading(false);
    });
  }, []);

  const refresh = async () => {
    setIsLoading(true);
    try {
      cachedUser = await getMe();
    } catch {
      cachedUser = null;
    } finally {
      isLoaded = true;
      setUser(cachedUser);
      setIsLoading(false);
    }
  };

  const logout = () => {
    cachedUser = null;
    isLoaded = true;
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    refresh,
    logout,
  };
};
