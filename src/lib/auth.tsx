"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface User {
  user_id: string;
  email: string;
  name: string;
  role: string;
  created_at: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (
    email: string,
    name: string,
    password: string,
    role?: string
  ) => Promise<string | null>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("nx_token");
    const savedUser = localStorage.getItem("nx_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("nx_token");
        localStorage.removeItem("nx_user");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const err = await res.json();
          return err.detail || "Giriş başarısız";
        }
        const data = await res.json();
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("nx_token", data.token);
        localStorage.setItem("nx_user", JSON.stringify(data.user));
        return null;
      } catch {
        return "Sunucuya bağlanılamadı";
      }
    },
    []
  );

  const register = useCallback(
    async (
      email: string,
      name: string,
      password: string,
      role = "viewer"
    ): Promise<string | null> => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name, password, role }),
        });
        if (!res.ok) {
          const err = await res.json();
          return err.detail || "Kayıt başarısız";
        }
        // Auto login after register
        return login(email, password);
      } catch {
        return "Sunucuya bağlanılamadı";
      }
    },
    [login]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("nx_token");
    localStorage.removeItem("nx_user");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
