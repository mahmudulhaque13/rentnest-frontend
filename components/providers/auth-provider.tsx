"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { getMe, logoutUser } from "@/services/auth";

interface AuthUser {
  id: string;
  email: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  iat?: number;
  exp?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setUser(null);
      return;
    }

    try {
      const result = await getMe(accessToken);

      if (result.success) {
        setUser(result.data);
      } else {
        setUser(null);
      }
    } catch {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        await refreshUser();
      } finally {
        setLoading(false);
      }
    };

    void loadUser();
  }, []);

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // Even if backend logout fails,
      // remove local authentication state.
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
