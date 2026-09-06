import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/client";

interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  organizationId: number;
  departmentId: number;
  status: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  roles: string[];
  permissions: string[];
  loading: boolean;
  login: (username: string, password?: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  hasPermission: (perm: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("aegis_token"));
  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadAuth() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/auth/me");
        setUser(res.user);
        setRoles(res.roles || [res.user.role]);
        setPermissions(res.permissions || []);
      } catch (err) {
        console.error("Auth session expired", err);
        logout();
      } finally {
        setLoading(false);
      }
    }
    loadAuth();
  }, [token]);

  const login = async (username: string, password = "password") => {
    const res = await api.post("/auth/login", { username, password });
    localStorage.setItem("aegis_token", res.token);
    setToken(res.token);
    setUser(res.user);
    setRoles([res.user.role]);
  };

  const register = async (userData: any) => {
    await api.post("/auth/register", userData);
    await login(userData.username, userData.password);
  };

  const logout = () => {
    localStorage.removeItem("aegis_token");
    setToken(null);
    setUser(null);
    setRoles([]);
    setPermissions([]);
  };

  const hasPermission = (perm: string) => {
    if (user?.role === "SUPER_ADMIN" || user?.role === "ADMIN") return true;
    return permissions.includes(perm) || roles.includes("SUPER_ADMIN");
  };

  return (
    <AuthContext.Provider value={{ user, token, roles, permissions, loading, login, register, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
