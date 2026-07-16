import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { LOGIN_PATH } from "@/const";
import { useStore } from "@/stores";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

/** 本地 mock 认证 —— 无真实后端，直接读写 zustand store 里的 user */
export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = LOGIN_PATH } =
    options ?? {};

  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);

  const logout = useCallback(() => {
    setUser(null);
    navigate(redirectPath);
  }, [setUser, navigate, redirectPath]);

  useEffect(() => {
    if (redirectOnUnauthenticated && !user) {
      const currentPath = window.location.pathname;
      if (currentPath !== redirectPath) {
        navigate(redirectPath);
      }
    }
  }, [redirectOnUnauthenticated, user, navigate, redirectPath]);

  return useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading: false,
      error: null,
      logout,
      refresh: () => {},
    }),
    [user, logout],
  );
}
