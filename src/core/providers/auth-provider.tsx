"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { api, SafeUser } from "@/lib/api";

interface AuthContextType {
  user: SafeUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: {
    email?: string;
    identifier?: string;
    password: string;
    turnstileToken?: string;
  }) => Promise<SafeUser>;
  loginAdmin: (credentials: {
    identifier: string;
    password: string;
    turnstileToken?: string;
  }) => Promise<SafeUser>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    mobile: string;
    collegeName: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    rollNumber?: string;
    isMmmutStudent?: boolean;
    studentType?: "MMMUT" | "OUTSIDER";
    turnstileToken?: string;
  }) => Promise<SafeUser>;
  logout: () => void;
  refreshUser: () => Promise<SafeUser | null>;
  setUser: React.Dispatch<React.SetStateAction<SafeUser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async (): Promise<SafeUser | null> => {
    if (typeof window === "undefined") return null;
    const currentToken = localStorage.getItem("ts27_token");
    if (!currentToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return null;
    }

    try {
      const meData = await api.auth.getMe();
      if (meData?.profile) {
        setUser(meData.profile);
        setToken(currentToken);
        localStorage.setItem("ts27_user_profile", JSON.stringify(meData.profile));
        return meData.profile;
      }
      return null;
    } catch (err: any) {
      console.warn("Session token validation attempt failed:", err);
      // Only purge credentials if token is explicitly rejected (HTTP 401 Unauthorized or expired)
      if (
        err?.code === "HTTP_401" ||
        err?.message?.toLowerCase().includes("unauthorized") ||
        err?.message?.toLowerCase().includes("expired")
      ) {
        api.auth.logout();
        setUser(null);
        setToken(null);
        return null;
      }

      // On network errors or cold-starts, preserve valid cached user session
      const cachedProfile = localStorage.getItem("ts27_user_profile");
      if (cachedProfile) {
        try {
          const parsed = JSON.parse(cachedProfile);
          setUser(parsed);
          setToken(currentToken);
          return parsed;
        } catch {
          // ignore parse error
        }
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check initial cached user to prevent UI flash
    if (typeof window !== "undefined") {
      const cachedToken = localStorage.getItem("ts27_token");
      const cachedProfile = localStorage.getItem("ts27_user_profile");
      if (cachedToken && cachedProfile) {
        try {
          setUser(JSON.parse(cachedProfile));
          setToken(cachedToken);
        } catch {
          // ignore parse error
        }
      }
    }
    // Verify session with backend
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials: {
    email?: string;
    identifier?: string;
    password: string;
    turnstileToken?: string;
  }): Promise<SafeUser> => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(credentials);
      setUser(res.user);
      setToken(res.token);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAdmin = async (credentials: {
    identifier: string;
    password: string;
    turnstileToken?: string;
  }): Promise<SafeUser> => {
    setIsLoading(true);
    try {
      const res = await api.auth.loginAdmin(credentials);
      setUser(res.user);
      setToken(res.token);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    name: string;
    mobile: string;
    collegeName: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    rollNumber?: string;
    isMmmutStudent?: boolean;
    studentType?: "MMMUT" | "OUTSIDER";
    turnstileToken?: string;
  }): Promise<SafeUser> => {
    setIsLoading(true);
    try {
      const res = await api.auth.register(data);
      setUser(res.user);
      setToken(res.token);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
    setToken(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(user && token),
    login,
    loginAdmin,
    register,
    logout,
    refreshUser,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
