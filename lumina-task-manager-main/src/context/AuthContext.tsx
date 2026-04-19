import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { MOCK_USERS, MockUser, Role } from "@/data/mockUsers";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  tenantId: string | null;
  bio?: string;
  joinedAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string, companyName: string, role: Role) => Promise<boolean>;
  allUsers: MockUser[];
  setAllUsers: React.Dispatch<React.SetStateAction<MockUser[]>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<MockUser[]>(MOCK_USERS);

  useEffect(() => {
    const stored = localStorage.getItem("lumina_token");
    if (stored) {
      try {
        const decoded = JSON.parse(atob(stored));
        if (decoded.exp > Date.now()) {
          const found = allUsers.find((u) => u.id === decoded.userId);
          if (found) {
            setUser({ id: found.id, name: found.name, email: found.email, role: found.role, tenantId: found.tenantId, bio: found.bio, joinedAt: found.joinedAt });
            setToken(stored);
          }
        } else {
          localStorage.removeItem("lumina_token");
        }
      } catch {
        localStorage.removeItem("lumina_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const found = allUsers.find((u) => u.email === email && u.password === password);
    if (!found) return false;
    const jwt = btoa(JSON.stringify({ userId: found.id, role: found.role, tenantId: found.tenantId, exp: Date.now() + 3600000 }));
    localStorage.setItem("lumina_token", jwt);
    setToken(jwt);
    setUser({ id: found.id, name: found.name, email: found.email, role: found.role, tenantId: found.tenantId, bio: found.bio, joinedAt: found.joinedAt });
    return true;
  }, [allUsers]);

  const logout = useCallback(() => {
    localStorage.removeItem("lumina_token");
    setToken(null);
    setUser(null);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, companyName: string, role: Role): Promise<boolean> => {
    if (allUsers.find((u) => u.email === email)) return false;
    const tenantId = `tenant_${Date.now()}`;
    const newUser: MockUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      password,
      role: role === "super_admin" ? "tenant_admin" : role,
      tenantId,
      bio: "",
      joinedAt: new Date().toISOString().split("T")[0],
    };
    setAllUsers((prev) => [...prev, newUser]);
    return true;
  }, [allUsers]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, logout, signup, allUsers, setAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
